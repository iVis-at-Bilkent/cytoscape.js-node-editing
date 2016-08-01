;(function () {
    'use strict';

    // registers the extension on a cytoscape lib ref
    var register = function (cytoscape, $, oCanvas) {

        if (!cytoscape || !$ || !oCanvas) {
            return;
        } // can't register if cytoscape unspecified

        var options = {
            padding: 5, // spacing between node and grapples/rectangle
            undoable: true, // and if cy.undoRedo exists

            grappleSize: 8, // size of square dots
            grappleColor: "green", // color of grapples
            inactiveGrappleStroke: "outside 1px blue",
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

            options = $.extend(true, options, opts);

            var $canvas = $('<canvas id="node-resize"></canvas>');
            var $container = $(cy.container());
            $container.append($canvas);


            var resizeCanvas = function () {
                $canvas
                    .attr('height', $container.height())
                    .attr('width', $container.width())
                    .css({
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'z-index': options.zIndex
                    });
                setTimeout(function () {
                    var canvasBb = $canvas.offset();
                    var containerBb = $container.offset();
                    $canvas
                        .attr('height', $container.height())
                        .attr('width', $container.width())
                        .css({
                            'top': -( canvasBb.top - containerBb.top ),
                            'left': -( canvasBb.left - containerBb.left )
                        });
                    redraw();
                }, 0);
            };

            $(window).on('resize', resizeCanvas);
            resizeCanvas();

            oCanvas.registerDisplayObject("dashedRectangle", function (settings, core) {

                return oCanvas.extend({
                    core: core,

                    shapeType: "rectangular",

                    draw: function () {
                        var canvas = this.core.canvas,
                            origin = this.getOrigin(),
                            x = this.abs_x - origin.x,
                            y = this.abs_y - origin.y,
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

                canvas.reset();

            };

            var getGrappleSize = function () {
                return Math.max(1, cy.zoom()) * options.grappleSize;
            };

            var getPadding = function () {
                return options.padding*Math.max(1, cy.zoom());
            };

            var drawGrapple = function (x, y, t, n, cur) {
                if (options.isNoResizeMode(n) || (options.isFixedAspectRatioResizeMode(n) && t.indexOf("center") >= 0)) {
                    var inactiveGrapple = canvas.display.rectangle({
                        x: x,
                        y: y,
                        height: getGrappleSize(),
                        width: getGrappleSize(),
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
                    var selectedEles;

                    var eMouseDown = function () {
                        cy.boxSelectionEnabled(false);
                        cy.panningEnabled(false);
                        cy.autounselectify(true);
                        cy.autoungrabify(true);
                        selectedEles = cy.$(":selected");
                        canvas.bind("touchend mouseup", eMouseUp);
                    };
                    var eMouseUp = function () {
                        cy.boxSelectionEnabled(true);
                        cy.panningEnabled(true);
                        cy.autounselectify(false);
                        cy.autoungrabify(false);
                        setTimeout(function () {
                            cy.$().unselect();
                            selectedEles.select();
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
                    height: getGrappleSize(),
                    width: getGrappleSize(),
                    fill: options.grappleColor
                });

                canvas.addChild(grapple);

                var startPos = {};
                var nodes;
                var selectedEles;
                var tmpActiveBgOpacity;
                var eMouseDown = function () {
                    nodes = cy.nodes(":selected");
                    selectedEles = cy.$(":selected");
                    cy.trigger("resizestart", [t, nodes]);
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
                    cy.trigger("resizeend", [t, nodes]);
                    setTimeout(function () {
                        cy.$().unselect();
                        selectedEles.select();
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
                        for (var i = 0; i < nodes.length; i++) {
                            var node = nodes[i];


                            var isAspectedMode = options.isFixedAspectRatioResizeMode(node);
                            if ((isAspectedMode && t.indexOf("center") >= 0) ||
                                options.isNoResizeMode(node))
                                continue;

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
                                    continue;
                            } else if (t.startsWith("bottom")) {
                                if (node.height() + xHeight > options.minHeight(node)) {
                                    node.position("y", nodePos.y + xHeight / 2);
                                    node.css("height", node.height() + xHeight);
                                } else if (isAspectedMode)
                                    continue;
                            }

                            if (t.endsWith("left") && node.width() - xWidth > options.minWidth(node)) {
                                node.position("x", nodePos.x + xWidth / 2);
                                node.css("width", node.width() - xWidth);
                            } else if (t.endsWith("right") && node.width() + xWidth > options.minWidth(node)) {
                                node.position("x", nodePos.x + xWidth / 2);
                                node.css("width", node.width() + xWidth);
                            }
                        }
                    });

                    startPos.x = x;
                    startPos.y = y;

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
                var width = node.renderedWidth() + getPadding();
                var height = node.renderedHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };

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

                var gs = getGrappleSize();

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

            var restoreGrapples = function () {
                cy.nodes(":selected").each(function (i, node) {
                    drawGrapples(node);
                });
            };

            var redraw = function () {
                clearDrawing();
                restoreGrapples();
            };

            cy.on("unselect", "node", redraw);
            cy.on("position", "node", redraw);
            cy.on("zoom", redraw);
            cy.on("pan", redraw);
            cy.on("style", "node", redraw);

            cy.on("select", "node", redraw);

            if (cy.undoRedo && options.undoable) {

                var firstMap = { };

                cy.on("resizestart", function (e, type, nodes) {
                    nodes.each(function (i, ele) {
                        firstMap[ele.id()] = {
                            css: {
                                width: ele.width(),
                                height: ele.height()
                            },
                            position: $.extend({}, ele.position())
                        };
                    });
                });

                var resizeDo = function (arg) {
                    if (arg.firstTime)
                        return { undoMap: arg.firstMap, nodes: arg.nodes };


                    var undoMap = { };
                    arg.nodes.each(function (i, ele) {
                        undoMap[ele.id()] = {
                            css: {
                                width: ele.width(),
                                height: ele.height()
                            },
                            position: $.extend({}, ele.position())
                        };
                    });
                    cy.batch(function () {
                        for (var id in arg.undoMap){
                            cy.getElementById(id)
                                .position(arg.undoMap[id].position)
                                .css("width", arg.undoMap[id].css.width)
                                .css("height", arg.undoMap[id].css.height);

                        }

                    });
                    return {undoMap: undoMap, nodes: arg.nodes };
                };

                cy.undoRedo().action("resize", resizeDo, resizeDo);

                cy.on("resizeend", function (e, type, nodes) {
                    cy.undoRedo().do("resize", { firstMap: firstMap, nodes: nodes });
                    firstMap = { };
                });
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

    if (typeof cytoscape !== 'undefined' || typeof jQuery !== "undefined" || typeof oCanvas !== "undefined") { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape, jQuery, oCanvas);
    }

})();
