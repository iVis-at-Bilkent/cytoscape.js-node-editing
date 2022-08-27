/* eslint-disable no-unused-vars */
let defaults = {
  padding: 5, // spacing between node and grapples/rectangle
  undoable: true, // and if cy.undoRedo exists

  grappleSize: 8, // size of square dots
  grappleColor: 'green', // color of grapples
  inactiveGrappleStroke: 'inside 1px blue',
  //boundingRectangle: true, // enable/disable bounding rectangle
  boundingRectangleLineDash: [4, 8], // line dash of bounding rectangle
  boundingRectangleLineColor: 'red',
  boundingRectangleLineWidth: 1.5,
  zIndex: 999,

  moveSelectedNodesOnKeyEvents: function () {
    return true;
  },

  minWidth: function (node) {
    var data = node.data('resizeMinWidth');
    return data ? data : 15;
  }, // a function returns min width of node
  minHeight: function (node) {
    var data = node.data('resizeMinHeight');
    return data ? data : 15;
  }, // a function returns min height of node

  // Getters for some style properties the defaults returns ele.css('property-name')
  // you are encouraged to override these getters
  getCompoundMinWidth: function (node) {
    return node.css('min-width');
  },
  getCompoundMinHeight: function (node) {
    return node.css('min-height');
  },
  getCompoundMinWidthBiasRight: function (node) {
    return node.css('min-width-bias-right');
  },
  getCompoundMinWidthBiasLeft: function (node) {
    return node.css('min-width-bias-left');
  },
  getCompoundMinHeightBiasTop: function (node) {
    return node.css('min-height-bias-top');
  },
  getCompoundMinHeightBiasBottom: function (node) {
    return node.css('min-height-bias-bottom');
  },

  // These optional function will be executed to set the width/height of a node in this extension
  // Using node.css() is not a recommended way (http://js.cytoscape.org/#eles.style) to do this. Therefore, overriding these defaults
  // so that a data field or something like that will be used to set node dimentions instead of directly calling node.css()
  // is highly recommended (Of course this will require a proper setting in the stylesheet).
  setWidth: function (node, width) {
    node.css('width', width);
  },
  setHeight: function (node, height) {
    node.css('height', height);
  },
  setCompoundMinWidth: function (node, minWidth) {
    node.css('min-width', minWidth);
  },
  setCompoundMinHeight: function (node, minHeight) {
    node.css('min-height', minHeight);
  },
  setCompoundMinWidthBiasLeft: function (node, minWidthBiasLeft) {
    node.css('min-width-bias-left', minWidthBiasLeft);
  },
  setCompoundMinWidthBiasRight: function (node, minHeightBiasRight) {
    node.css('min-width-bias-right', minHeightBiasRight);
  },
  setCompoundMinHeightBiasTop: function (node, minHeightBiasTop) {
    node.css('min-height-bias-top', minHeightBiasTop);
  },
  setCompoundMinHeightBiasBottom: function (node, minHeightBiasBottom) {
    node.css('min-height-bias-bottom', minHeightBiasBottom);
  },

  isFixedAspectRatioResizeMode: function (node) {
    return node.is('.fixedAspectRatioResizeMode');
  }, // with only 4 active grapples (at corners)
  isNoResizeMode: function (node) {
    return node.is('.noResizeMode, :parent');
  }, // no active grapples
  isNoControlsMode: function (node) {
    return node.is('.noControlsMode');
  }, // no controls - do not draw grapples

  cursors: {
    // See http://www.w3schools.com/cssref/tryit.asp?filename=trycss_cursor
    // May take any "cursor" css property
    default: 'default', // to be set after resizing finished or mouseleave
    inactive: 'not-allowed',
    nw: 'nw-resize',
    n: 'n-resize',
    ne: 'ne-resize',
    e: 'e-resize',
    se: 'se-resize',
    s: 's-resize',
    sw: 'sw-resize',
    w: 'w-resize',
  },

  resizeToContentCueEnabled: function (node) {
    return true;
  },
  resizeToContentFunction: undefined,
  resizeToContentCuePosition: 'bottom-right',
  resizeToContentCueImage: '/node_modules/cytoscape-node-editing/resizeCue.svg',
  enableMovementWithArrowKeys: true,
  autoRemoveResizeToContentCue: false,
};
/* eslint-enable */

module.exports = defaults;
