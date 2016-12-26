;(function () {
    'use strict';
    
    // registers the extension on a cytoscape lib ref
    var register = function (cytoscape, $) {

        // can't register if required libraries does not exist 
        // note that oCanvas is not parametrezid here because it is not commonjs nor amd compatible
        // it is expected to be defined as a browser global
        if (!cytoscape || !$ || !oCanvas) {
            return;
        } 

        var options = {
            padding: 5, // spacing between node and grapples/rectangle
            undoable: true, // and if cy.undoRedo exists

            grappleSize: 8, // size of square dots
            grappleColor: "green", // color of grapples
            inactiveGrappleStroke: "inside 1px blue",
            boundingRectangle: true, // enable/disable bounding rectangle
            boundingRectangleLineDash: [4, 8], // line dash of bounding rectangle
            boundingRectangleLineColor: "red",
            boundingRectangleLineWidth: 1.5,
            zIndex: 999,

            minWidth: function (node) {
                var data = node.data("resizeMinWidth");
                return data ? data : 15;
            }, // a function returns min width of node
            minHeight: function (node) {
                var data = node.data("resizeMinHeight");
                return data ? data : 15;
            }, // a function returns min height of node

            isFixedAspectRatioResizeMode: function (node) { return node.is(".fixedAspectRatioResizeMode") },// with only 4 active grapples (at corners)
            isNoResizeMode: function (node) { return node.is(".noResizeMode, :parent") }, // no active grapples

            cursors: { // See http://www.w3schools.com/cssref/tryit.asp?filename=trycss_cursor
                // May take any "cursor" css property
                default: "default", // to be set after resizing finished or mouseleave
                inactive: "not-allowed",
                nw: "nw-resize",
                n: "n-resize",
                ne: "ne-resize",
                e: "e-resize",
                se: "se-resize",
                s: "s-resize",
                sw: "sw-resize",
                w: "w-resize"
            }
        };

        cytoscape('core', 'nodeResize', function (opts) {
            var cy = this;
            // Nodes to draw grapples this variable is set if there is just one selected node
            var nodeToDrawGrapples; 
            // We need to keep the number of selected nodes to check if we should draw grapples. 
            // Calculating it each time decreases performance.
            var numberOfSelectedNodes;
            // Events to bind and unbind
            var eUnselectNode, ePositionNode, eZoom, ePan, eSelectNode, eRemoveNode, eAddNode;
            
            // Initilize nodes to draw grapples and the number of selected nodes
            {
              var selectedNodes = cy.nodes(':selected');
              numberOfSelectedNodes = selectedNodes.length;

              if (numberOfSelectedNodes === 1) {
                nodeToDrawGrapples = selectedNodes[0];
              }
            }

            options = $.extend(true, options, opts);

            var $canvas = $('<canvas id="node-resize"></canvas>');
            var $container = $(cy.container());
            $container.append($canvas);

            // Note that this function is expected to be called with debounce. However, in that case oCanvas library does not
            // work as expected (the events are not listened correctly etc.). Therefore, we do not use debounce function here
            // for now.
            var _sizeCanvas = function () {
                $canvas
                  .attr('height', $container.height())
                  .attr('width', $container.width())
                  .css({
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'z-index': '999'
                  })
                ;

                setTimeout(function () {
                  var canvasBb = $canvas.offset();
                  var containerBb = $container.offset();

                  $canvas
                    .css({
                      'top': -(canvasBb.top - containerBb.top),
                      'left': -(canvasBb.left - containerBb.left)
                    })
                  ;

                  // redraw on canvas resize
                  if(cy){
                    refreshGrapples();
                  }
                }, 0);

              };

              function sizeCanvas() {
                _sizeCanvas();
              }

              sizeCanvas();

            $(window).on('resize', sizeCanvas);
            

            oCanvas.registerDisplayObject("dashedRectangle", function (settings, core) {

                return oCanvas.extend({
                    core: core,

                    shapeType: "rectangular",

                    draw: function () {
                        var canvas = this.core.canvas,
                            origin = this.getOrigin(),
                            x = this.abs_x - origin.x + this.lineWidth/2,
                            y = this.abs_y - origin.y + this.lineWidth/2,
                            width = this.width,
                            height = this.height;

                        canvas.beginPath();


                        if (this.lineWidth > 0) {
                            canvas.strokeStyle = this.lineColor;
                            canvas.lineWidth = this.lineWidth;
                            canvas.setLineDash(this.lineDash);
                            canvas.strokeRect(x, y, width, height);
                        }

                        canvas.closePath();
                    }
                }, settings);
            });

            var canvas = oCanvas.create({
                canvas: "#node-resize"
            });

            var clearDrawing = function () {
                // reset the canvas
                canvas.reset();
                
                // Normally canvas.reset() should clear the drawings as well.
                // It works as expected id windows is never resized however if it is resized the drawings are not cleared unexpectedly. 
                // Therefore we need to access the canvas and clear the rectangle (Note that canvas.clear(false) does not work as expected 
                // as well so wee need to do it manually.) TODO: Figure out the bug clearly and file it to oCanvas library.
                var w = $container.width();
                var h = $container.height();

                canvas.canvas.clearRect(0, 0, w, h);

            };

            var getGrappleSize = function (node) {
                return Math.max(1, cy.zoom()) * options.grappleSize * Math.min(node.width()/25, node.height()/25, 1);
            };

            var getPadding = function () {
                return options.padding*Math.max(1, cy.zoom());
            };

            var drawGrapple = function (x, y, t, node, cur) {
                if (options.isNoResizeMode(node) || (options.isFixedAspectRatioResizeMode(node) && t.indexOf("center") >= 0)) {
                    var inactiveGrapple = canvas.display.rectangle({
                        x: x,
                        y: y,
                        height: getGrappleSize(node),
                        width: getGrappleSize(node),
                        stroke: options.inactiveGrappleStroke
                    });

                    canvas.addChild(inactiveGrapple);


                    var eMouseEnter = function () {
                        canvas.mouse.cursor(options.cursors.inactive);
                        inactiveGrapple.bind("touchleave mouseleave", eMouseLeave);
                    };

                    var eMouseLeave = function () {
                        canvas.mouse.cursor(options.cursors.default);
                        inactiveGrapple.unbind("touchleave mouseleave", eMouseLeave);
                    };

                    var eMouseDown = function () {
                        cy.boxSelectionEnabled(false);
                        cy.panningEnabled(false);
                        cy.autounselectify(true);
                        cy.autoungrabify(true);
                        canvas.bind("touchend mouseup", eMouseUp);
                    };
                    var eMouseUp = function () {
                        cy.boxSelectionEnabled(true);
                        cy.panningEnabled(true);
                        cy.autounselectify(false);
                        cy.autoungrabify(false);
                        setTimeout(function () {
                            cy.$().unselect();
                            node.select();
                        }, 0);
                        canvas.unbind("touchend mouseup", eMouseUp);
                    };

                    inactiveGrapple.bind("touchstart mousedown", eMouseDown);
                    inactiveGrapple.bind("touchenter mouseenter", eMouseEnter);

                    return inactiveGrapple;
                }
                var grapple = canvas.display.rectangle({
                    x: x,
                    y: y,
                    height: getGrappleSize(node),
                    width: getGrappleSize(node),
                    fill: options.grappleColor
                });

                canvas.addChild(grapple);

                var startPos = {};
                var tmpActiveBgOpacity;
                var eMouseDown = function () {
                    cy.trigger("noderesize.resizestart", [t, node]);
                    tmpActiveBgOpacity = cy.style()._private.coreStyle["active-bg-opacity"].value;
                    cy.style()
                        .selector("core")
                        .style("active-bg-opacity", 0)
                        .update();
                    canvas.mouse.cursor(cur);
                    startPos.x = this.core.pointer.x;
                    startPos.y = this.core.pointer.y;
                    cy.boxSelectionEnabled(false);
                    cy.panningEnabled(false);
                    cy.autounselectify(true);
                    cy.autoungrabify(true);
                    grapple.unbind("touchleave mouseleave", eMouseLeave);
                    grapple.unbind("touchenter mouseenter", eMouseEnter);
                    canvas.bind("touchmove mousemove", eMouseMove);
                    canvas.bind("touchend mouseup", eMouseUp);
                };
                var eMouseUp = function () {
                    cy.style()
                        .selector("core")
                        .style("active-bg-opacity", tmpActiveBgOpacity)
                        .update();
                    canvas.mouse.cursor(options.cursors.default);
                    cy.boxSelectionEnabled(true);
                    cy.panningEnabled(true);
                    cy.autounselectify(false);
                    cy.autoungrabify(false);
                    cy.trigger("noderesize.resizeend", [t, node]);
                    setTimeout(function () {
                        cy.$().unselect();
                        node.select();
                    }, 0);
                    canvas.unbind("touchmove mousemove", eMouseMove);
                    canvas.unbind("touchend mouseup", eMouseUp);
                    grapple.bind("touchenter mouseenter", eMouseEnter);
                };
                var eMouseMove = function () {
                    var core = this;
                    var x = core.pointer.x;
                    var y = core.pointer.y;

                    var xHeight = (y - startPos.y) / cy.zoom();
                    var xWidth = (x - startPos.x) / cy.zoom();

                    cy.batch(function () {
                        var isAspectedMode = options.isFixedAspectRatioResizeMode(node);
                        if ((isAspectedMode && t.indexOf("center") >= 0) ||
                            options.isNoResizeMode(node))
                            return;

                        if (isAspectedMode) {
                            var aspectRatio = node.height() / node.width();

                            var aspectedSize = Math.min(xWidth, xHeight);

                            var isCrossCorners = (t == "topright") || (t == "bottomleft");
                            if (xWidth > xHeight)
                                xHeight = xWidth * aspectRatio * (isCrossCorners ? -1 : 1);
                            else
                                xWidth = xHeight / aspectRatio * (isCrossCorners ? -1 : 1);

                        }


                        var nodePos = node.position();

                        if (t.startsWith("top")) {
                            if (node.height() - xHeight > options.minHeight(node)) {
                                node.position("y", nodePos.y + xHeight / 2);
                                node.css("height", node.height() - xHeight);
                            } else if (isAspectedMode)
                                return;
                        } else if (t.startsWith("bottom")) {
                            if (node.height() + xHeight > options.minHeight(node)) {
                                node.position("y", nodePos.y + xHeight / 2);
                                node.css("height", node.height() + xHeight);
                            } else if (isAspectedMode)
                                return;
                        }

                        if (t.endsWith("left") && node.width() - xWidth > options.minWidth(node)) {
                            node.position("x", nodePos.x + xWidth / 2);
                            node.css("width", node.width() - xWidth);
                        } else if (t.endsWith("right") && node.width() + xWidth > options.minWidth(node)) {
                            node.position("x", nodePos.x + xWidth / 2);
                            node.css("width", node.width() + xWidth);
                        }
                    });

                    startPos.x = x;
                    startPos.y = y;
                    
                    cy.trigger("noderesize.resizedrag", [t, node]);
                };

                var eMouseEnter = function () {
                    canvas.mouse.cursor(cur);
                    grapple.bind("touchleave mouseleave", eMouseLeave);
                };

                var eMouseLeave = function () {
                    canvas.mouse.cursor(options.cursors.default);
                    grapple.unbind("touchleave mouseleave", eMouseLeave);
                };

                grapple.bind("touchstart mousedown", eMouseDown);
                grapple.bind("touchenter mouseenter", eMouseEnter);


                return grapple;
            };

            var drawGrapples = function (node) {
                var nodePos = node.renderedPosition();
                var width = node.renderedOuterWidth() + getPadding();
                var height = node.renderedOuterHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };

                var gs = getGrappleSize(node);

                if (options.boundingRectangle) {
                    var rect = canvas.display.dashedRectangle({
                        x: startPos.x,
                        y: startPos.y,
                        width: width,
                        height: height,
                        lineColor: options.boundingRectangleLineColor,
                        lineWidth: options.boundingRectangleLineWidth,
                        lineDash: options.boundingRectangleLineDash
                    });
                    canvas.addChild(rect);
                }


                // Clock turning
                drawGrapple(startPos.x - gs / 2, startPos.y - gs / 2, "topleft", node, options.cursors.nw);
                drawGrapple(startPos.x + width / 2 - gs / 2, startPos.y - gs / 2, "topcenter", node, options.cursors.n);
                drawGrapple(startPos.x + width - gs / 2, startPos.y - gs / 2, "topright", node, options.cursors.ne);
                drawGrapple(startPos.x + width - gs / 2, startPos.y + height / 2 - gs / 2, "centerright", node, options.cursors.e);
                drawGrapple(startPos.x + width - gs / 2, startPos.y + height - gs / 2, "bottomright", node, options.cursors.se);
                drawGrapple(startPos.x + width / 2 - gs / 2, startPos.y + height - gs / 2, "bottomcenter", node, options.cursors.s);
                drawGrapple(startPos.x - gs / 2, startPos.y + height - gs / 2, "bottomleft", node, options.cursors.sw);
                drawGrapple(startPos.x - gs / 2, startPos.y + height / 2 - gs / 2, "centerleft", node, options.cursors.w);

            };

            var refreshGrapples = function () {
                clearDrawing();
                
                // If the node to draw grapples is defined it means that there is just one node selected and
                // we need to draw grapples for that node.
                if(nodeToDrawGrapples) {
                    drawGrapples(nodeToDrawGrapples);
                }
            };

            var unBindEvents = function() {
                cy.off("unselect", "node", eUnselectNode);
                cy.off("position", "node", ePositionNode);
                cy.off("zoom", eZoom);
                cy.off("pan", ePan);
                //cy.off("style", "node", redraw);
                cy.off("select", "node", eSelectNode);
                cy.off("remove", "node", eRemoveNode);
                cy.off("add", "node", eAddNode);
            };

            var bindEvents = function() {
                cy.on("unselect", "node", eUnselectNode = function() {
                    numberOfSelectedNodes = numberOfSelectedNodes - 1;
                    
                    if (numberOfSelectedNodes === 1) {
                      var selectedNodes = cy.nodes(':selected');

                      // If user unselects all nodes by tapping to the core etc. then our 'numberOfSelectedNodes'
                      // may be misleading. Therefore we need to check if the number of nodes to draw grapples is really 1 here.
                      if (selectedNodes.length === 1) {
                          nodeToDrawGrapples = selectedNodes[0];
                      }
                      else {
                          nodeToDrawGrapples = undefined;
                      }
                    }
                    else {
                        nodeToDrawGrapples = undefined;
                    }

                    refreshGrapples();
                });
                
                cy.on("select", "node", eSelectNode = function() {
                    var node = this;

                    numberOfSelectedNodes = numberOfSelectedNodes + 1;

                    if (numberOfSelectedNodes === 1) {
                        nodeToDrawGrapples = node;
                    }
                    else {
                        nodeToDrawGrapples = undefined;
                    }
                    refreshGrapples();
                });
                
                cy.on("remove", "node", eRemoveNode = function() {
                    var node = this;
                    // If a selected node is removed we should regard this event just like an unselect event
                    if ( node.selected() ) {
                        eUnselectNode();
                    }
                });
                
                cy.on("add", "node", eAddNode = function() {
                    var node = this;
                    // If a selected node is added we should regard this event just like a select event
                    if ( node.selected() ) {
                        eSelectNode();
                    }
                });
                
                cy.on("position", "node", ePositionNode = function() {
                    var node = this;
                    if (nodeToDrawGrapples && nodeToDrawGrapples.id() === node.id()) {
                        refreshGrapples();
                    }
                });
                
                cy.on("zoom", eZoom = function() {
                    if ( nodeToDrawGrapples ) {
                      refreshGrapples();
                    }
                });
                
                cy.on("pan", ePan = function() {
                  if ( nodeToDrawGrapples ) {
                    refreshGrapples();
                  }
                });
                //cy.on("style", "node", redraw);
            };
            bindEvents();

            if (cy.undoRedo && options.undoable) {

                var param;

                cy.on("noderesize.resizestart", function (e, type, node) {
                    param = {
                        node: node,
                        css: {
                            width: node.width(),
                            height: node.height()
                        },
                        position: $.extend({}, node.position())
                    };
                });
                
                cy.on("noderesize.resizeend", function (e, type, node) {
                    param.firstTime = true;
                    cy.undoRedo().do("resize", param);
                    param = undefined;
                });

                var resizeDo = function (arg) {
                    if (arg.firstTime) {
                        delete arg.firstTime;
                        return arg;
                    }
                    
                    var node = arg.node;
                    
                    var result = {
                        node: node,
                        css: {
                            width: node.width(),
                            height: node.height()
                        },
                        position: $.extend({}, node.position())
                    };
                    
                    node.position(arg.position)
                            .css("width", arg.css.width)
                            .css("height", arg.css.height);
                    
                    refreshGrapples(); // refresh grapplers after node resize
                    
                    return result;
                };

                cy.undoRedo().action("resize", resizeDo, resizeDo);
            }


            return this; // chainability
        });

    };

    if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
        module.exports = register;
    }

    if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
        define('cytoscape-node-resize', function () {
            return register;
        });
    }

    if (typeof cytoscape !== 'undefined' && typeof jQuery !== "undefined") { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape, jQuery);
    }

})();
