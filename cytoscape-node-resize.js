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
                    redrawNow();
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

                canvas.reset();

            };

            var getGrappleSize = function (node) {
                return Math.max(1, cy.zoom()) * options.grappleSize * Math.min(node.width()/25, node.height()/25, 1);
            };

            var getPadding = function () {
                return options.padding*Math.max(1, cy.zoom());
            };

            var drawGrapple = function (x, y, t, n, cur) {
                if (options.isNoResizeMode(n) || (options.isFixedAspectRatioResizeMode(n) && t.indexOf("center") >= 0)) {
                    var inactiveGrapple = canvas.display.rectangle({
                        x: x,
                        y: y,
                        height: getGrappleSize(n),
                        width: getGrappleSize(n),
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
                    height: getGrappleSize(n),
                    width: getGrappleSize(n),
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

            var restoreGrapples = function () {
                cy.nodes(":selected").each(function (i, node) {
                    drawGrapples(node);
                });
            };

            var redrawNow = function () {
                clearDrawing();
                restoreGrapples();
            };
            var redraw = debounce(redrawNow, 15);

            cy.on("unselect", "node", redrawNow);
            cy.on("position", "node", redraw);
            cy.on("zoom", redrawNow);
            cy.on("pan", redrawNow);
            cy.on("style", "node", redraw);

            cy.on("select", "node", redrawNow);

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
