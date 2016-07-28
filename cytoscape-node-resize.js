;(function(){ 'use strict';

  // registers the extension on a cytoscape lib ref
  var register = function( cytoscape, $, oCanvas ){

    if( !cytoscape || !$ || !oCanvas){ return; } // can't register if cytoscape unspecified

    var options = {
      padding: 20, // spacing between node and grapples/rectangle

      grappleSize: 8, // size of square dots
      grappleColor: "green", // color of grapples

      boundingRectangle: true, // enable/disable bounding rectangle
      boundingRectangleStroke: "1.5px red", // style bounding rectangle

      minNodeSize: 15 // minimum width/height of node to be set
    };

    cytoscape( 'core', 'nodeResize', function(opts){
      var cy = this;

      options = $.extend(true, options, opts);

      var $canvas = $('<canvas id="node-resize"></canvas>');
      var $container = $(cy.container());
      $container.append($canvas);

      $canvas
          .attr('height', $container.height())
          .attr('width', $container.width())
          .css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 15
          });

      var resizeCanvas = function () {
        var canvasBb = $canvas.offset();
        var containerBb = $container.offset();

        $canvas
            .attr( 'height', $container.height() )
            .attr( 'width', $container.width() )
            .css( {
              'top': -( canvasBb.top - containerBb.top ),
              'left': -( canvasBb.left - containerBb.left )
            } );
      };

      $(window).on('resize', resizeCanvas);
      resizeCanvas();

      var canvas = oCanvas.create({
        canvas: "#node-resize"
      });

      var clearDrawing = function () {
        var width = $container.width();
        var height = $container.height();

        canvas.reset();

      };

      var drawGrapple = function (x, y, t, node) {
        var grapple = canvas.display.rectangle({
          x: x,
          y: y,
          height: options.grappleSize,
          width: options.grappleSize,
          fill: options.grappleColor
        });

        canvas.addChild(grapple);

        var startPos = { };
        var nodes;
        var eMouseDown = function () {
          startPos.x = this.core.pointer.x;
          startPos.y = this.core.pointer.y;
          cy.boxSelectionEnabled(false);
          cy.panningEnabled(false);
          cy.autounselectify(true);
          cy.autoungrabify(true);
          nodes = cy.nodes(":selected");
          cy.trigger("start_resize_" + t);
          canvas.bind("touchmove mousemove", eMouseMove);
          canvas.bind("touchend mouseup", eMouseUp);
        };
        var eMouseUp = function () {
          cy.boxSelectionEnabled(true);
          cy.panningEnabled(true);
          cy.autounselectify(false);
          cy.autoungrabify(false);
          setTimeout(function () {
            cy.$().unselect();
            nodes.select();
          }, 0);
          cy.trigger("end_resize_" + t);
          canvas.unbind("touchmove mousemove", eMouseMove);
          canvas.unbind("touchend mouseup", eMouseUp);
        };
        var eMouseMove = function () {
          var core = this;
          var x = core.pointer.x;
          var y = core.pointer.y;

          var xHeight = (y - startPos.y)/cy.zoom();
          var xWidth = (x - startPos.x)/cy.zoom();

          cy.batch(function () {
            for (var i = 0; i < nodes.length; i++) {
              var node = nodes[i];
              var nodePos = node.position();

              if (t.startsWith("top") && node.height() - xHeight > options.minNodeSize) {
                node.position("y", nodePos.y + xHeight/2);
                node.css("height", node.height() - xHeight);
              } else if(t.startsWith("bottom") && node.height() + xHeight > options.minNodeSize) {
                node.position("y", nodePos.y + xHeight/2);
                node.css("height", node.height() + xHeight);
              }

              if (t.endsWith("left") && node.width() - xWidth > options.minNodeSize) {
                node.position("x", nodePos.x + xWidth/2);
                node.css("width", node.width() - xWidth);
              } else if (t.endsWith("right") && node.width() + xWidth > options.minNodeSize) {
                node.position("x", nodePos.x + xWidth/2);
                node.css("width", node.width() + xWidth);
              }
            }
          });

          startPos.x = x;
          startPos.y = y;

        };

        grapple.bind("touchstart mousedown", eMouseDown);
        var startPos = {};


        return grapple;
      };

      var drawGrapples = function (node) {
        var nodePos = node.renderedPosition();
        var width = node.renderedWidth() + options.padding;
        var height = node.renderedHeight() + options.padding;
        var startPos = {
          x: nodePos.x - width / 2,
          y: nodePos.y - height / 2
        };

        if (options.boundingRectangle) {
          var rect = canvas.display.rectangle({
            x: startPos.x,
            y: startPos.y,
            width: width,
            height: height,
            stroke: options.boundingRectangleStroke
          });
          canvas.addChild(rect);
        }

        var gs = options.grappleSize;

        // Clock turning
        var grapples = {
          "topleft": drawGrapple(startPos.x - gs/2, startPos.y - gs/2, "topleft", node),
          "topcenter": drawGrapple(startPos.x + width/2 - gs/2, startPos.y - gs/2, "topcenter", node),
          "topright": drawGrapple(startPos.x + width - gs/2, startPos.y - gs/2, "topright", node),
          "centerright": drawGrapple(startPos.x + width - gs/2, startPos.y + height/2 - gs/2, "centerright", node),
          "bottomright": drawGrapple(startPos.x + width - gs/2, startPos.y + height - gs/2, "bottomright", node),
          "bottomcenter": drawGrapple(startPos.x + width/2 - gs/2, startPos.y + height - gs/2, "bottomcenter", node),
          "bottomleft": drawGrapple(startPos.x - gs/2, startPos.y + height - gs/2, "bottomleft", node),
          "centerleft": drawGrapple(startPos.x - gs/2, startPos.y + height/2 - gs/2, "centerleft", node)
        };


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


      return this; // chainability
    } );

  };

  if( typeof module !== 'undefined' && module.exports ){ // expose as a commonjs module
    module.exports = register;
  }

  if( typeof define !== 'undefined' && define.amd ){ // expose as an amd/requirejs module
    define('cytoscape-node-resize', function(){
      return register;
    });
  }

  if( typeof cytoscape !== 'undefined' || typeof jQuery !== "undefined" || typeof oCanvas !== "undefined"){ // expose to global cytoscape (i.e. window.cytoscape)
    register( cytoscape, jQuery, oCanvas );
  }

})();
