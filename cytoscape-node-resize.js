;(function () {
    'use strict';

    var debounce = (function(){
        /**
         * lodash 3.1.1 (Custom Build) <https://lodash.com/>
         * Build: `lodash modern modularize exports="npm" -o ./`
         * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
         * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
         * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
         * Available under MIT license <https://lodash.com/license>
         */
        /** Used as the `TypeError` message for "Functions" methods. */
        var FUNC_ERROR_TEXT = 'Expected a function';

        /* Native method references for those with the same name as other `lodash` methods. */
        var nativeMax = Math.max,
            nativeNow = Date.now;

        /**
         * Gets the number of milliseconds that have elapsed since the Unix epoch
         * (1 January 1970 00:00:00 UTC).
         *
         * @static
         * @memberOf _
         * @category Date
         * @example
         *
         * _.defer(function(stamp) {
       *   console.log(_.now() - stamp);
       * }, _.now());
         * // => logs the number of milliseconds it took for the deferred function to be invoked
         */
        var now = nativeNow || function() {
                return new Date().getTime();
            };

        /**
         * Creates a debounced function that delays invoking `func` until after `wait`
         * milliseconds have elapsed since the last time the debounced function was
         * invoked. The debounced function comes with a `cancel` method to cancel
         * delayed invocations. Provide an options object to indicate that `func`
         * should be invoked on the leading and/or trailing edge of the `wait` timeout.
         * Subsequent calls to the debounced function return the result of the last
         * `func` invocation.
         *
         * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
         * on the trailing edge of the timeout only if the the debounced function is
         * invoked more than once during the `wait` timeout.
         *
         * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
         * for details over the differences between `_.debounce` and `_.throttle`.
         *
         * @static
         * @memberOf _
         * @category Function
         * @param {Function} func The function to debounce.
         * @param {number} [wait=0] The number of milliseconds to delay.
         * @param {Object} [options] The options object.
         * @param {boolean} [options.leading=false] Specify invoking on the leading
         *  edge of the timeout.
         * @param {number} [options.maxWait] The maximum time `func` is allowed to be
         *  delayed before it's invoked.
         * @param {boolean} [options.trailing=true] Specify invoking on the trailing
         *  edge of the timeout.
         * @returns {Function} Returns the new debounced function.
         * @example
         *
         * // avoid costly calculations while the window size is in flux
         * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
         *
         * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
         * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
       *   'leading': true,
       *   'trailing': false
       * }));
         *
         * // ensure `batchLog` is invoked once after 1 second of debounced calls
         * var source = new EventSource('/stream');
         * jQuery(source).on('message', _.debounce(batchLog, 250, {
       *   'maxWait': 1000
       * }));
         *
         * // cancel a debounced call
         * var todoChanges = _.debounce(batchLog, 1000);
         * Object.observe(models.todo, todoChanges);
         *
         * Object.observe(models, function(changes) {
       *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
       *     todoChanges.cancel();
       *   }
       * }, ['delete']);
         *
         * // ...at some point `models.todo` is changed
         * models.todo.completed = true;
         *
         * // ...before 1 second has passed `models.todo` is deleted
         * // which cancels the debounced `todoChanges` call
         * delete models.todo;
         */
        function debounce(func, wait, options) {
            var args,
                maxTimeoutId,
                result,
                stamp,
                thisArg,
                timeoutId,
                trailingCall,
                lastCalled = 0,
                maxWait = false,
                trailing = true;

            if (typeof func != 'function') {
                throw new TypeError(FUNC_ERROR_TEXT);
            }
            wait = wait < 0 ? 0 : (+wait || 0);
            if (options === true) {
                var leading = true;
                trailing = false;
            } else if (isObject(options)) {
                leading = !!options.leading;
                maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
                trailing = 'trailing' in options ? !!options.trailing : trailing;
            }

            function cancel() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (maxTimeoutId) {
                    clearTimeout(maxTimeoutId);
                }
                lastCalled = 0;
                maxTimeoutId = timeoutId = trailingCall = undefined;
            }

            function complete(isCalled, id) {
                if (id) {
                    clearTimeout(id);
                }
                maxTimeoutId = timeoutId = trailingCall = undefined;
                if (isCalled) {
                    lastCalled = now();
                    result = func.apply(thisArg, args);
                    if (!timeoutId && !maxTimeoutId) {
                        args = thisArg = undefined;
                    }
                }
            }

            function delayed() {
                var remaining = wait - (now() - stamp);
                if (remaining <= 0 || remaining > wait) {
                    complete(trailingCall, maxTimeoutId);
                } else {
                    timeoutId = setTimeout(delayed, remaining);
                }
            }

            function maxDelayed() {
                complete(trailing, timeoutId);
            }

            function debounced() {
                args = arguments;
                stamp = now();
                thisArg = this;
                trailingCall = trailing && (timeoutId || !leading);

                if (maxWait === false) {
                    var leadingCall = leading && !timeoutId;
                } else {
                    if (!maxTimeoutId && !leading) {
                        lastCalled = stamp;
                    }
                    var remaining = maxWait - (stamp - lastCalled),
                        isCalled = remaining <= 0 || remaining > maxWait;

                    if (isCalled) {
                        if (maxTimeoutId) {
                            maxTimeoutId = clearTimeout(maxTimeoutId);
                        }
                        lastCalled = stamp;
                        result = func.apply(thisArg, args);
                    }
                    else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                    }
                }
                if (isCalled && timeoutId) {
                    timeoutId = clearTimeout(timeoutId);
                }
                else if (!timeoutId && wait !== maxWait) {
                    timeoutId = setTimeout(delayed, wait);
                }
                if (leadingCall) {
                    isCalled = true;
                    result = func.apply(thisArg, args);
                }
                if (isCalled && !timeoutId && !maxTimeoutId) {
                    args = thisArg = undefined;
                }
                return result;
            }
            debounced.cancel = cancel;
            return debounced;
        }

        /**
         * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
         * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
         *
         * @static
         * @memberOf _
         * @category Lang
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if `value` is an object, else `false`.
         * @example
         *
         * _.isObject({});
         * // => true
         *
         * _.isObject([1, 2, 3]);
         * // => true
         *
         * _.isObject(1);
         * // => false
         */
        function isObject(value) {
            // Avoid a V8 JIT bug in Chrome 19-20.
            // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
            var type = typeof value;
            return !!value && (type == 'object' || type == 'function');
        }

        return debounce;

    })();

    // registers the extension on a cytoscape lib ref
    var register = function (cytoscape, $, Konva) {

        // can't register if required libraries does not exist
        if (!cytoscape || !$ || !Konva) {
            return;
        }

        var canvas;

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
            
            // These optional function will be executed to set the width/height of a node in this extension
            // Using node.css() is not a recommended way (http://js.cytoscape.org/#eles.style) to do this. Therefore, overriding these defaults
            // so that a data field or something like that will be used to set node dimentions instead of directly calling node.css() 
            // is highly recommended (Of course this will require a proper setting in the stylesheet).
            setWidth: function(node, width) { 
                node.css('width', width);
            },
            setHeight: function(node, height) {
                node.css('height', height);
            },
            
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
            var controls;
            // We need to keep the number of selected nodes to check if we should draw grapples.
            // Calculating it each time decreases performance.
            var numberOfSelectedNodes;
            // Events to bind and unbind
            var eUnselectNode, ePositionNode, eZoom, ePan, eSelectNode, eRemoveNode, eAddNode, eFreeNode;

            // Initilize nodes to draw grapples and the number of selected nodes
            {
                var selectedNodes = cy.nodes(':selected');
                numberOfSelectedNodes = selectedNodes.length;

                if (numberOfSelectedNodes === 1) {
                    nodeToDrawGrapples = selectedNodes[0];
                }
            }

            options = $.extend(true, options, opts);

            var $canvasElement = $('<div id="node-resize"></div>');
            var $container = $(cy.container());
            $container.append($canvasElement);

            var stage = new Konva.Stage({
                container: 'node-resize',   // id of container <div>
                width: $container.width(),
                height: $container.height()
            });
            // then create layer
            canvas = new Konva.Layer();
            // add the layer to the stage
            stage.add(canvas);

            // Resize the canvas
            var sizeCanvas = debounce( function(){
                $canvasElement
                    .attr('height', $container.height())
                    .attr('width', $container.width())
                    .css({
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'z-index': '999'
                    });

                setTimeout(function () {
                    var canvasBb = $canvasElement.offset();
                    var containerBb = $container.offset();

                    $canvasElement
                        .css({
                            'top': -(canvasBb.top - containerBb.top),
                            'left': -(canvasBb.left - containerBb.left)
                        })
                    ;
                    canvas.getStage().setWidth($container.width());
                    canvas.getStage().setHeight($container.height());
                }, 0);

            }, 250 );

            sizeCanvas();

            $(window).on('resize', sizeCanvas);

            var ResizeControls = function (node) {
                this.parent = node;
                this.boundingRectangle = new BoundingRectangle(node);
                var grappleLocations = ["topleft", "topcenter", "topright", "centerright", "bottomright",
                                  "bottomcenter", "bottomleft", "centerleft"];
                this.grapples = [];
                for(var i=0; i < grappleLocations.length; i++) {
                    var location = grappleLocations[i];
                    console.log("create grapple", location);
                    var isActive = true;
                    if (options.isNoResizeMode(node) || (options.isFixedAspectRatioResizeMode(node) && location.indexOf("center") >= 0)) {
                        isActive = false;
                    }
                    this.grapples.push(new Grapple(node, this, location, isActive))
                };
                canvas.draw();
            };

            ResizeControls.prototype.update = function () {
                this.boundingRectangle.update();
                for(var i=0; i < this.grapples.length; i++) {
                    this.grapples[i].update();
                };
                canvas.draw();
            };

            ResizeControls.prototype.remove = function () {
                this.boundingRectangle.shape.destroy();
                delete this.boundingRectangle;
                for(var i=0; i < this.grapples.length; i++) {
                    this.grapples[i].shape.destroy();
                };
                delete this.grapples;
                canvas.draw();
            };

            var BoundingRectangle = function (node) {
                this.parent = node;
                this.shape = null;

                var nodePos = node.renderedPosition();
                var width = node.renderedOuterWidth() + getPadding();
                var height = node.renderedOuterHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };
                // create our shape
                var rect = new Konva.Rect({
                    x: startPos.x,
                    y: startPos.y,
                    width: width,
                    height: height,
                    stroke: options.boundingRectangleLineColor,
                    strokeWidth: options.boundingRectangleLineWidth,
                    dash: options.boundingRectangleLineDash
                });
                // add the shape to the layer
                canvas.add(rect);
                this.shape = rect;

                console.log(startPos, canvas, node.position());
            };

            BoundingRectangle.prototype.update = function () {
                var nodePos = this.parent.renderedPosition();
                var width = this.parent.renderedOuterWidth() + getPadding();
                var height = this.parent.renderedOuterHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };
                this.shape.x(startPos.x);
                this.shape.y(startPos.y);
                this.shape.width(width);
                this.shape.height(height);
            };

            var Grapple = function (node, resizeControls, location, isActive) {
                this.parent = node;
                this.location = location;
                this.isActive = isActive;
                this.resizeControls = resizeControls;

                var nodePos = node.renderedPosition();
                var width = node.renderedOuterWidth() + getPadding();
                var height = node.renderedOuterHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };

                var gs = getGrappleSize(node);

                this.shape = new Konva.Rect({
                    width: gs,
                    height: gs
                });
                if(this.isActive) {
                    this.shape.fill(options.grappleColor);
                }
                else {
                    // we need to parse the inactiveGrappleStroke option that is composed of 3 parts
                    var parts = options.inactiveGrappleStroke.split(' ');
                    var color = parts[2];
                    var strokeWidth = parseInt(parts[1].replace(/px/, ''));
                    this.shape.stroke(color);
                    this.shape.strokeWidth(strokeWidth);
                }

                this.updateShapePosition(startPos, width, height, gs);
                canvas.add(this.shape);

                if(this.isActive) {
                    this.bindActiveEvents();
                }
                else {
                    this.bindInactiveEvents();
                }
            };

            Grapple.prototype.bindInactiveEvents = function () {
                var self = this; // keep reference to the grapple object inside events

                var eMouseEnter = function (event) {
                    event.target.getStage().container().style.cursor = options.cursors.inactive;
                };

                var eMouseLeave = function (event) {
                    event.target.getStage().container().style.cursor = options.cursors.default;
                };

                var eMouseDown = function (event) {
                    cy.boxSelectionEnabled(false);
                    cy.panningEnabled(false);
                    cy.autounselectify(true);
                    cy.autoungrabify(true);
                    canvas.getStage().on("contentTouchend contentMouseup", eMouseUp);
                    nodeToDrawGrapples = self.parent; // keep global reference of the concerned node
                };
                var eMouseUp = function (event) {
                    // stage scope
                    cy.boxSelectionEnabled(true);
                    cy.panningEnabled(true);
                    cy.autounselectify(false);
                    cy.autoungrabify(false);
                    /*setTimeout(function () {
                        cy.$().unselect();
                        nodeToDrawGrapples.select();
                    }, 0);*/
                    canvas.getStage().off("contentTouchend contentMouseup", eMouseUp);
                };

                this.shape.on("mouseenter", eMouseEnter);
                this.shape.on("mouseleave", eMouseLeave);
                this.shape.on("touchstart mousedown", eMouseDown);
            };

            Grapple.prototype.bindActiveEvents = function () {
                var self = this; // keep reference to the grapple object inside events
                var startPos = {};
                var tmpActiveBgOpacity;

                var eMouseDown = function (event) {
                    cy.trigger("noderesize.resizestart", [self.location, self.parent]);
                    tmpActiveBgOpacity = cy.style()._private.coreStyle["active-bg-opacity"].value;
                    cy.style()
                        .selector("core")
                        .style("active-bg-opacity", 0)
                        .update();
                    event.target.getStage().container().style.cursor = options.cursors[translateLocation[self.location]];
                    var currentPointer = event.target.getStage().getPointerPosition();
                    startPos.x = currentPointer.x;
                    startPos.y = currentPointer.y;
                    cy.boxSelectionEnabled(false);
                    cy.panningEnabled(false);
                    cy.autounselectify(true);
                    cy.autoungrabify(true);
                    self.shape.off("mouseenter", eMouseEnter);
                    self.shape.off("mouseleave", eMouseLeave);
                    //canvas.bind("touchmove mousemove", eMouseMove);
                    //canvas.bind("touchend mouseup", eMouseUp);
                    canvas.getStage().on("contentTouchend contentMouseup", eMouseUp);
                    canvas.getStage().on("contentTouchmove contentMousemove", eMouseMove);
                };

                var eMouseUp = function (event) {
                    cy.style()
                        .selector("core")
                        .style("active-bg-opacity", tmpActiveBgOpacity)
                        .update();
                    self.shape.getStage().container().style.cursor = options.cursors.default;
                    cy.boxSelectionEnabled(true);
                    cy.panningEnabled(true);
                    setTimeout(function () { // for some reason, making node unselectable before doesn't work
                        //cy.$().unselect();
                        //node.select();
                        cy.autounselectify(false); // think about those 2
                        cy.autoungrabify(false);
                    }, 0);
                    cy.trigger("noderesize.resizeend", [self.location, self.parent]);
                    canvas.getStage().off("contentTouchend contentMouseup", eMouseUp);
                    canvas.getStage().off("contentTouchmove contentMousemove", eMouseMove);
                    self.shape.on("mouseenter", eMouseEnter);
                    self.shape.on("mouseleave", eMouseLeave);
                    //canvas.unbind("touchmove mousemove", eMouseMove);
                    //canvas.unbind("touchend mouseup", eMouseUp);
                    //grapple.bind("touchenter mouseenter", eMouseEnter);
                };

                var eMouseMove = function (event) {
                    var currentPointer = self.shape.getStage().getPointerPosition();
                    var x = currentPointer.x;
                    var y = currentPointer.y;

                    var xHeight = (y - startPos.y) / cy.zoom();
                    var xWidth = (x - startPos.x) / cy.zoom();

                    var node = self.parent;
                    var location = self.location;
                    cy.batch(function () {
                        var isAspectedMode = options.isFixedAspectRatioResizeMode(node);
                        if ((isAspectedMode && location.indexOf("center") >= 0) ||
                        options.isNoResizeMode(node))
                            return;

                        if (isAspectedMode) {
                            var aspectRatio = node.height() / node.width();

                            var aspectedSize = Math.min(xWidth, xHeight);

                            var isCrossCorners = (location == "topright" || location == "bottomleft");
                            if (xWidth > xHeight)
                                xHeight = xWidth * aspectRatio * (isCrossCorners ? -1 : 1);
                            else
                                xWidth = xHeight / aspectRatio * (isCrossCorners ? -1 : 1);
                        }

                        var nodePos = node.position();

                        if (location.startsWith("top")) {
                            if (node.height() - xHeight > options.minHeight(node)) {
                                node.position("y", nodePos.y + xHeight / 2);
                                options.setHeight(node, node.height() - xHeight);
                            } else if (isAspectedMode)
                                return;
                        } else if (location.startsWith("bottom")) {
                            if (node.height() + xHeight > options.minHeight(node)) {
                                node.position("y", nodePos.y + xHeight / 2);
                                options.setHeight(node, node.height() + xHeight);
                            } else if (isAspectedMode)
                                return;
                        }

                        if (location.endsWith("left") && node.width() - xWidth > options.minWidth(node)) {
                            node.position("x", nodePos.x + xWidth / 2);
                            options.setWidth(node, node.width() - xWidth);
                        } else if (location.endsWith("right") && node.width() + xWidth > options.minWidth(node)) {
                            node.position("x", nodePos.x + xWidth / 2);
                            options.setWidth(node, node.width() + xWidth);
                        }
                    });

                    startPos.x = x;
                    startPos.y = y;
                    self.resizeControls.update();

                    cy.trigger("noderesize.resizedrag", [location, node]);
                };

                var translateLocation = {
                    "topleft": "nw",
                    "topcenter": "n",
                    "topright": "ne",
                    "centerright": "e",
                    "bottomright": "se",
                    "bottomcenter": "s",
                    "bottomleft": "sw",
                    "centerleft": "w"
                };
                var eMouseEnter = function (event) {
                    event.target.getStage().container().style.cursor = options.cursors[translateLocation[self.location]];
                };

                var eMouseLeave = function (event) {
                    event.target.getStage().container().style.cursor = options.cursors.default;
                };

                this.shape.on("mouseenter", eMouseEnter);
                this.shape.on("mouseleave", eMouseLeave);
                this.shape.on("touchstart mousedown", eMouseDown);
            };

            Grapple.prototype.update = function() {
                var nodePos = this.parent.renderedPosition();
                var width = this.parent.renderedOuterWidth() + getPadding();
                var height = this.parent.renderedOuterHeight() + getPadding();
                var startPos = {
                    x: nodePos.x - width / 2,
                    y: nodePos.y - height / 2
                };

                var gs = getGrappleSize(this.parent);

                this.shape.width(gs);
                this.shape.height(gs);
                this.updateShapePosition(startPos, width, height, gs);
            };

            Grapple.prototype.updateShapePosition = function (startPos, width, height, gs) {
                switch(this.location) {
                    case "topleft":
                        this.shape.x(startPos.x - gs / 2);
                        this.shape.y(startPos.y - gs / 2);
                        break;
                    case "topcenter":
                        this.shape.x(startPos.x + width / 2 - gs / 2);
                        this.shape.y(startPos.y - gs / 2);
                        break;
                    case "topright":
                        this.shape.x(startPos.x + width - gs / 2);
                        this.shape.y(startPos.y - gs / 2);
                        break;
                    case "centerright":
                        this.shape.x(startPos.x + width - gs / 2);
                        this.shape.y(startPos.y + height / 2 - gs / 2);
                        break;
                    case "bottomright":
                        this.shape.x(startPos.x + width - gs / 2);
                        this.shape.y(startPos.y + height - gs / 2);
                        break;
                    case "bottomcenter":
                        this.shape.x(startPos.x + width / 2 - gs / 2);
                        this.shape.y(startPos.y + height - gs / 2);
                        break;
                    case "bottomleft":
                        this.shape.x(startPos.x - gs / 2);
                        this.shape.y(startPos.y + height - gs / 2);
                        break;
                    case "centerleft":
                        this.shape.x(startPos.x - gs / 2);
                        this.shape.y(startPos.y + height / 2 - gs / 2);
                        break;
                }
            };

            var clearDrawing = function () {
                throw new Error("clearDrawing should not be called");
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

            var refreshGrapples = function () {
                throw new Error("refreshGrapples should not be called");
                clearDrawing();

                // If the node to draw grapples is defined it means that there is just one node selected and
                // we need to draw grapples for that node.
                if(nodeToDrawGrapples) {
                    drawGrapples(nodeToDrawGrapples);
                }
            };

            function getTopMostNodes(nodes) {
                var nodesMap = {};
                for (var i = 0; i < nodes.length; i++) {
                    nodesMap[nodes[i].id()] = true;
                }
                var roots = nodes.filter(function (ele, i) {
                    if(typeof ele === "number") {
                      ele = i;
                    }
                    var parent = ele.parent()[0];
                    while(parent != null){
                        if(nodesMap[parent.id()]){
                            return false;
                        }
                        parent = parent.parent()[0];
                    }
                    return true;
                });

                return roots;
            }

            function moveNodes(positionDiff, nodes) {
                // Get the descendants of top most nodes. Note that node.position() can move just the simple nodes.
                var topMostNodes = getTopMostNodes(nodes);
                var nodesToMove = topMostNodes.union(topMostNodes.descendants());

                nodesToMove.positions(function(node, i) {
                    if(typeof node === "number") {
                      node = i;
                    }
                    var oldX = node.position("x");
                    var oldY = node.position("y");
                    return {
                        x: oldX + positionDiff.x,
                        y: oldY + positionDiff.y
                    };
                });
            }

            var selectedNodesToMove;
            var nodesMoving = false;

            var keys = {};
            function keyDown(e) {
                //Checks if the tagname is textarea or input
                var tn = document.activeElement.tagName;
                if (tn != "TEXTAREA" && tn != "INPUT")
                {
                    keys[e.keyCode] = true;
                    switch(e.keyCode){
                        case 37: case 39: case 38:  case 40: // Arrow keys
                        case 32: e.preventDefault(); break; // Space
                        default: break; // do not block other keys
                    }

					
                    if (e.keyCode < '37' || e.keyCode > '40') {
                        return;
                    }

                    if (!nodesMoving)
                    {
                        selectedNodesToMove = cy.nodes(':selected');
                        cy.trigger("noderesize.movestart", [selectedNodesToMove]);
                        nodesMoving = true;
                    }
                    if (e.altKey && e.which == '38') {
                        // up arrow and alt
                        moveNodes ({x:0, y:-1},selectedNodesToMove);
                    }
                    else if (e.altKey && e.which == '40') {
                        // down arrow and alt
                        moveNodes ({x:0, y:1},selectedNodesToMove);
                    }
                    else if (e.altKey && e.which == '37') {
                        // left arrow and alt
                        moveNodes ({x:-1, y:0},selectedNodesToMove);
                    }
                    else if (e.altKey && e.which == '39') {
                        // right arrow and alt
                        moveNodes ({x:1, y:0},selectedNodesToMove);
                    }

                    else if (e.shiftKey && e.which == '38') {
                        // up arrow and shift
                        moveNodes ({x:0, y:-10},selectedNodesToMove);
                    }
                    else if (e.shiftKey && e.which == '40') {
                        // down arrow and shift
                        moveNodes ({x:0, y:10},selectedNodesToMove);
                    }
                    else if (e.shiftKey && e.which == '37') {
                        // left arrow and shift
                        moveNodes ({x:-10, y:0},selectedNodesToMove);

                    }
                    else if (e.shiftKey && e.which == '39' ) {
                        // right arrow and shift
                        moveNodes ({x:10, y:0},selectedNodesToMove);
                    }

                    else if (e.keyCode == '38') {
                        // up arrow
                        moveNodes ({x:0, y:-3},selectedNodesToMove);
                    }
                    else if (e.keyCode == '40') {
                        // down arrow
                        moveNodes ({x:0, y:3},selectedNodesToMove);
                    }
                    else if (e.keyCode == '37') {
                        // left arrow
                        moveNodes ({x:-3, y:0},selectedNodesToMove);
                    }
                    else if (e.keyCode == '39') {
                        //right arrow
                        moveNodes ({x:3, y:0},selectedNodesToMove);
                    }
                }
            }

            function keyUp(e) {
                if (e.keyCode < '37' || e.keyCode > '40') {
                    return;
                }

                cy.trigger("noderesize.moveend", [selectedNodesToMove]);
                selectedNodesToMove = undefined;
                nodesMoving = false;
            }

            var unBindEvents = function() {
                cy.off("unselect", "node", eUnselectNode);
                cy.off("position", "node", ePositionNode);
                cy.off("position", "node", eFreeNode);
                cy.off("zoom", eZoom);
                cy.off("pan", ePan);
                //cy.off("style", "node", redraw);
                cy.off("select", "node", eSelectNode);
                cy.off("remove", "node", eRemoveNode);
                cy.off("add", "node", eAddNode);
            };

            var bindEvents = function() {
                // declare old and current positions
                var oldPos = {x: undefined, y: undefined};
                var currentPos = {x : 0, y : 0};
                cy.on("unselect", "node", eUnselectNode = function() {
                    var node = this;
                    // reinitialize old and current compound positions
                    oldPos = {x: undefined, y: undefined};
                    currentPos = {x: 0, y: 0};

                    /*numberOfSelectedNodes = numberOfSelectedNodes - 1;

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

                    refreshGrapples();*/
                    if(cy.nodes(':selected').size() == 1) {
                        controls = new ResizeControls(cy.nodes(':selected'));
                    }
                    else {
                        if(controls) {
                            controls.remove();
                            controls = null;
                        }
                    }
                });

                cy.on("select", "node", eSelectNode = function() {
                    var node = this;

                    /*numberOfSelectedNodes = numberOfSelectedNodes + 1;

                    if (numberOfSelectedNodes === 1) {
                        nodeToDrawGrapples = node;
                    }
                    else {
                        nodeToDrawGrapples = undefined;
                    }
                    refreshGrapples();*/
                    if(cy.nodes(':selected').size() == 1) {
                        controls = new ResizeControls(node);
                    }
                    else {
                        if(controls) {
                            controls.remove();
                            controls = null;
                        }
                    }
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
                        if(controls) {
                            controls.remove();
                            controls = null;
                        }
                        eSelectNode();
                    }
                });

                // listens for position event and refreshGrapples if necessary
                cy.on("position", "node", ePositionNode = function() {
                    var node = this;
                    // if position of selected node or compound changes refreshGrapples
                    /*if (nodeToDrawGrapples && nodeToDrawGrapples.id() === node.id()){
                        refreshGrapples();
                    }
                    // if the position of compund changes by repositioning its children's
                    // Note: position event for compound is not triggered in this case
                    else if (nodeToDrawGrapples && (currentPos.x != oldPos.x || currentPos.y != oldPos.y)){
                        currentPos = nodeToDrawGrapples.position();
                        refreshGrapples();
                        oldPos = {x : currentPos.x, y : currentPos.y};
                    };*/
                    if(controls) {
                        if(currentPos.x != oldPos.x || currentPos.y != oldPos.y) {
                            currentPos = controls.parent.position();
                            oldPos = {x : currentPos.x, y : currentPos.y};
                        }
                        controls.update();
                    }
                });

                cy.on("zoom", eZoom = function() {
                    if ( controls ) {
                        controls.update();
                    }
                });

                cy.on("pan", ePan = function() {
                    if ( controls ) {
                        controls.update();
                    }
                });

                document.addEventListener("keydown",keyDown, true);
                document.addEventListener("keyup",keyUp, true);
            };
            bindEvents();

            if (cy.undoRedo && options.undoable) {

                var param;
                var moveparam;

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

                cy.on("noderesize.movestart", function (e, nodes) {

                    moveparam = {
                        firstTime : true,
                        firstNodePosition: {
                            x: nodes[0].position('x'),
                            y: nodes[0].position('y')
                        },
                        nodes: nodes
                    }
                });

                cy.on("noderesize.moveend", function (e, nodes) {
                    var initialPos = moveparam.firstNodePosition;

                    moveparam.positionDiff = {
                        x: -nodes[0].position('x') + initialPos.x,
                        y: -nodes[0].position('y') + initialPos.y
                    }

                    delete moveparam.firstNodePosition;

                    cy.undoRedo().do("noderesize.move", moveparam);
                    moveparam = undefined;
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

                    node.position(arg.position);
                    options.setWidth(node, arg.css.width);
                    options.setHeight(node, arg.css.height);

                    if (controls) {
                        controls.update(); // refresh grapplers after node resize
                    }

                    return result;
                };

                var moveDo = function (arg) {
                    if (arg.firstTime) {
                        delete arg.firstTime;
                        return arg;
                    }

                    var nodes = arg.nodes;

                    var positionDiff = arg.positionDiff;

                    var result = {
                        nodes: nodes,
                        positionDiff: {
                            x: -positionDiff.x,
                            y: -positionDiff.y
                        }
                    };


                    moveNodes (positionDiff,nodes);

                    return result;
                };

                cy.undoRedo().action("resize", resizeDo, resizeDo);
                cy.undoRedo().action("noderesize.move", moveDo, moveDo);
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

    if (typeof cytoscape !== 'undefined' && typeof jQuery !== "undefined" && typeof Konva !== "undefined") { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape, jQuery, Konva);
    }

})();
