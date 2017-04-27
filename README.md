cytoscape-node-resize
================================================================================


## Description
A Cytoscape.js extension to provide grapples to resize nodes, distributed under [The MIT License](https://opensource.org/licenses/MIT).

![Image of extension](img.png)

## API

Only consists of initilization & default options.

```js
            cy.nodeResize({
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
             });
```


## Dependencies

 * Cytoscape.js ^2.7.0
 * jquery ^1.7.0 || ^2.0.0 || ^3.0.0
 * oCanvas ^2.8.0 // It is not commonjs nor AMD compatible just include it in your html file
 * cytoscape-undo-redo ^1.0.10 (optional)


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-node-resize`,
 * via bower: `bower install cytoscape-node-resize`, or
 * via direct download in the repository (probably from a tag).

`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var nodeResize = require('cytoscape-node-resize');

nodeResize( cytoscape, jQuery ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-node-resize', "jquery"], function( cytoscape, nodeResize, jQuery ){
  nodeResize( cytoscape, jQuery ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed.


## Emitted Events
`cy.on("noderesize.resizestart", function(e, type, node){ })`

`cy.on("noderesize.resizeend", function(e, type, node){ })`

`cy.on("noderesize.resizedrag", function(e, type, node){ })`


`type` param can be `topleft`, `topcenter`, `topright`, `centerright`, 
`bottomright`, `bottomcenter`, `bottomleft`, `centerleft`

`node` param corresponds to currently resizing node.

## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Set the version number environment variable: `export VERSION=1.2.3`
1. Publish: `gulp publish`
1. If publishing to bower for the first time, you'll need to run `bower register cytoscape-node-resize https://github.com/iVis-at-Bilkent/cytoscape.js-node-resize.git`

## Team

  * [Selim Firat Yilmaz](https://github.com/mrsfy), [Ugur Dogrusoz](https://github.com/ugurdogrusoz) of [i-Vis at Bilkent University](http://www.cs.bilkent.edu.tr/~ivis)
