!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.cytoscapeNodeEditing=t():e.cytoscapeNodeEditing=t()}(self,(function(){return(()=>{"use strict";var e={265:(e,t,i)=>{var n,o,s,a,r,d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};o=Math.max,s=Date.now||function(){return(new Date).getTime()},a=function(e,t,i){var n,a,r,h,u,p,c,g,f,l=0,m=!1,v=!0;if("function"!=typeof e)throw new TypeError("Expected a function");if(t=t<0?0:+t||0,!0===i){var y=!0;v=!1}else f=void 0===(g=i)?"undefined":d(g),!g||"object"!=f&&"function"!=f||(y=!!i.leading,m="maxWait"in i&&o(+i.maxWait||0,t),v="trailing"in i?!!i.trailing:v);function C(t,i){i&&clearTimeout(i),a=p=c=void 0,t&&(l=s(),r=e.apply(u,n),p||a||(n=u=void 0))}function x(){var e=t-(s()-h);e<=0||e>t?C(c,a):p=setTimeout(x,e)}function b(){C(v,p)}function M(){if(n=arguments,h=s(),u=this,c=v&&(p||!y),!1===m)var i=y&&!p;else{a||y||(l=h);var o=m-(h-l),d=o<=0||o>m;d?(a&&(a=clearTimeout(a)),l=h,r=e.apply(u,n)):a||(a=setTimeout(b,o))}return d&&p?p=clearTimeout(p):p||t===m||(p=setTimeout(x,t)),i&&(d=!0,r=e.apply(u,n)),!d||p||a||(n=u=void 0),r}return M.cancel=function(){p&&clearTimeout(p),a&&clearTimeout(a),l=0,a=p=c=void 0},M},r=function(e,t,i){if(e&&t&&i){var n=0;e("core","nodeEditing",(function(e){var s,r=this;if("get"===e)return o(r,"api");var d,h,u=1.1,p=t.extend(!0,{padding:5,undoable:!0,grappleSize:8,grappleColor:"green",grappleStrokeColor:"black",grappleStrokeWidth:0,grappleCornerRadius:0,inactiveGrappleStroke:"inside 1px blue",boundingRectangleLineDash:[4,8],boundingRectangleLineColor:"red",boundingRectangleLineWidth:1.5,zIndex:999,moveSelectedNodesOnKeyEvents:function(){return!0},minWidth:function(e){return e.data("resizeMinWidth")||15},minHeight:function(e){return e.data("resizeMinHeight")||15},getCompoundMinWidth:function(e){return e.css("min-width")},getCompoundMinHeight:function(e){return e.css("min-height")},getCompoundMinWidthBiasRight:function(e){return e.css("min-width-bias-right")},getCompoundMinWidthBiasLeft:function(e){return e.css("min-width-bias-left")},getCompoundMinHeightBiasTop:function(e){return e.css("min-height-bias-top")},getCompoundMinHeightBiasBottom:function(e){return e.css("min-height-bias-bottom")},setWidth:function(e,t){e.css("width",t)},setHeight:function(e,t){e.css("height",t)},setCompoundMinWidth:function(e,t){e.css("min-width",t)},setCompoundMinHeight:function(e,t){e.css("min-height",t)},setCompoundMinWidthBiasLeft:function(e,t){e.css("min-width-bias-left",t)},setCompoundMinWidthBiasRight:function(e,t){e.css("min-width-bias-right",t)},setCompoundMinHeightBiasTop:function(e,t){e.css("min-height-bias-top",t)},setCompoundMinHeightBiasBottom:function(e,t){e.css("min-height-bias-bottom",t)},isFixedAspectRatioResizeMode:function(e){return e.is(".fixedAspectRatioResizeMode")},isNoResizeMode:function(e){return e.is(".noResizeMode, :parent")},isNoControlsMode:function(e){return e.is(".noControlsMode")},cursors:{default:"default",inactive:"not-allowed",nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize"},resizeToContentCueEnabled:function(e){return!0},resizeToContentFunction:void 0,resizeToContentCuePosition:"bottom-right",resizeToContentCueImage:"/node_modules/cytoscape-node-editing/resizeCue.svg",enableMovementWithArrowKeys:!0,autoRemoveResizeToContentCue:!1},e),c=t(r.container()),g="cy-node-edge-editing-stage"+n;n++;var f,l,m=t('<div id="'+g+'"></div>');c.find("#"+g).length<1&&c.append(m),(f=i.stages.length<n?new i.Stage({id:"node-edge-editing-stage",container:g,width:c.width(),height:c.height()}):i.stages[n-1]).getChildren().length<1?(l=new i.Layer,f.add(l)):l=f.getChildren()[0];var v=a((function(){m.attr("height",c.height()).attr("width",c.width()).css({position:"absolute",top:0,left:0,"z-index":p.zIndex}),setTimeout((function(){var e=m.offset(),t=c.offset();m.css({top:-(e.top-t.top),left:-(e.left-t.left)}),l.getStage().setWidth(c.width()),l.getStage().setHeight(c.height())}),0)}),250);v(),t(window).on("resize",v);var y=function(e){this.parent=e,this.boundingRectangle=new C(e);var t=["topleft","topcenter","topright","centerright","bottomright","bottomcenter","bottomleft","centerleft"];this.grapples=[];for(var i=0;i<t.length;i++){var n=t[i],o=!0;(p.isNoResizeMode(e)||p.isFixedAspectRatioResizeMode(e)&&n.indexOf("center")>=0)&&(o=!1),this.grapples.push(new x(e,this,n,o))}!p.resizeToContentCueEnabled(e)||p.isNoResizeMode(e)||p.autoRemoveResizeToContentCue&&(!p.autoRemoveResizeToContentCue||B(e))||(this.resizeCue=new b(e,this)),l.draw()};y.prototype.update=function(){this.boundingRectangle.update();for(var e=0;e<this.grapples.length;e++)this.grapples[e].update();var t=this.boundingRectangle.parent,i=p.resizeToContentCueEnabled(t)&&!p.isNoResizeMode(t)&&(!p.autoRemoveResizeToContentCue||p.autoRemoveResizeToContentCue&&!B(t));this.resizeCue&&i?this.resizeCue.update():this.resizeCue&&!i?(this.resizeCue.unbindEvents(),this.resizeCue.shape.destroy(),delete this.resizeCue):!this.resizeCue&&i&&(this.resizeCue=new b(t,this)),l.draw()},y.prototype.remove=function(){this.boundingRectangle.shape.destroy(),delete this.boundingRectangle;for(var e=0;e<this.grapples.length;e++)this.grapples[e].unbindAllEvents(),this.grapples[e].shape.destroy();delete this.grapples,this.resizeCue&&(this.resizeCue.unbindEvents(),this.resizeCue.shape.destroy(),delete this.resizeCue),l.draw()};var C=function(e){this.parent=e,this.shape=null;var t=e.renderedPosition(),n=e.renderedOuterWidth()+H(),o=e.renderedOuterHeight()+H(),s={x:t.x-n/2,y:t.y-o/2},a=new i.Rect({x:s.x,y:s.y,width:n,height:o,stroke:p.boundingRectangleLineColor,strokeWidth:p.boundingRectangleLineWidth,dash:p.boundingRectangleLineDash});l.add(a),this.shape=a};C.prototype.update=function(){var e=this.parent.renderedPosition(),t=this.parent.renderedOuterWidth()+H(),i=this.parent.renderedOuterHeight()+H(),n={x:e.x-t/2,y:e.y-i/2};this.shape.x(n.x),this.shape.y(n.y),this.shape.width(t),this.shape.height(i)};var x=function(e,t,n,o){this.parent=e,this.location=n,this.isActive=o,this.resizeControls=t;var s=e.renderedPosition(),a=e.renderedOuterWidth()+H(),r=e.renderedOuterHeight()+H(),d={x:s.x-a/2,y:s.y-r/2},h=R(e);if(this.shape=new i.Rect({width:h,height:h}),this.isActive)this.shape.fill(p.grappleColor),this.shape.stroke(p.grappleStrokeColor),this.shape.strokeWidth(p.grappleStrokeWidth),this.shape.cornerRadius(p.grappleCornerRadius);else{var u=p.inactiveGrappleStroke.split(" "),c=u[2],g=parseInt(u[1].replace(/px/,""));this.shape.stroke(c),this.shape.strokeWidth(g)}this.updateShapePosition(d,a,r,h),l.add(this.shape),this.isActive?this.bindActiveEvents():this.bindInactiveEvents()};x.prototype.bindInactiveEvents=function(){var e=function e(t){r.boxSelectionEnabled(!0),r.panningEnabled(!0),r.autounselectify(!1),r.autoungrabify(!1),l.getStage().off("contentTouchend contentMouseup",e)};this.shape.on("mouseenter",(function(e){e.target.getStage().container().style.cursor=p.cursors.inactive})),this.shape.on("mouseleave",(function(e){null!=e.target.getStage()&&(e.target.getStage().container().style.cursor=p.cursors.default)})),this.shape.on("touchstart mousedown",(function(t){r.boxSelectionEnabled(!1),r.panningEnabled(!1),r.autounselectify(!0),r.autoungrabify(!0),l.getStage().on("contentTouchend contentMouseup",e)}))},x.prototype.bindActiveEvents=function(){var e,t,i,n,o,s,a=this,d=a.parent,h={},u={topleft:"nw",topcenter:"n",topright:"ne",centerright:"e",bottomright:"se",bottomcenter:"s",bottomleft:"sw",centerleft:"w"},c=function e(t){r.style().selector("core").style("active-bg-opacity",o).update(),a.shape.getStage().container().style.cursor=p.cursors.default,r.boxSelectionEnabled(!0),r.panningEnabled(!0),setTimeout((function(){r.autounselectify(!1),r.autoungrabify(!1)}),0),r.trigger("nodeediting.resizeend",[a.location,a.parent]),l.getStage().off("contentTouchend contentMouseup",e),l.getStage().off("contentTouchmove contentMousemove",g),a.shape.on("mouseenter",f),a.shape.on("mouseleave",m)},g=function(o){var u=a.shape.getStage().getPointerPosition(),c=u.x,g=u.y,f=(g-h.y)/r.zoom(),l=(c-h.x)/r.zoom(),m=a.location;r.batch((function(){var o=p.isFixedAspectRatioResizeMode(d);if(!(o&&m.indexOf("center")>=0||p.isNoResizeMode(d))){if(o){var a=n(d)/i(d),r=(Math.min(l,f),"topright"==m||"bottomleft"==m);l>f?f=l*a*(r?-1:1):l=f/a*(r?-1:1)}var h=d.position(),u=h.x,c=h.y,g=!1,v=!1,y=0,C=0,x=0,b=0;if(d.isParent()){var M=i(d)-s.w,z=n(d)-s.h;M>0&&(C=M-(y=M*parseFloat(p.getCompoundMinWidthBiasLeft(d))/(parseFloat(p.getCompoundMinWidthBiasLeft(d))+parseFloat(p.getCompoundMinWidthBiasRight(d))))),z>0&&(b=z-(x=z*parseFloat(p.getCompoundMinHeightBiasTop(d))/(parseFloat(p.getCompoundMinHeightBiasTop(d))+parseFloat(p.getCompoundMinHeightBiasBottom(d)))))}if(m.startsWith("top")){if(n(d)-f>p.minHeight(d)&&(!d.isParent()||x-f>=0))c=h.y+f/2,v=!0,t(d,n(d)-f);else if(o)return}else if(m.startsWith("bottom"))if(n(d)+f>p.minHeight(d)&&(!d.isParent()||b+f>=0))c=h.y+f/2,v=!0,t(d,n(d)+f);else if(o)return;if(m.endsWith("left")&&i(d)-l>p.minWidth(d)&&(!d.isParent()||y-l>=0)?(u=h.x+l/2,g=!0,e(d,i(d)-l)):m.endsWith("right")&&i(d)+l>p.minWidth(d)&&(!d.isParent()||C+l>=0)&&(u=h.x+l/2,g=!0,e(d,i(d)+l)),d.isParent()||!g&&!v||d.position({x:u,y:c}),d.isParent()){if(M=i(d)-s.w,z=n(d)-s.h,g&&M>0){m.endsWith("right")?C=M-y:m.endsWith("left")&&(y=M-C);var w=y/(y+C)*100,B=100-w;if(w<0||B<0)return;p.setCompoundMinWidthBiasLeft(d,w+"%"),p.setCompoundMinWidthBiasRight(d,B+"%")}if(v&&z>0){m.startsWith("top")?x=z-b:m.startsWith("bottom")&&(b=z-x);var R=x/(x+b)*100,W=100-R;if(R<0||W<0)return;p.setCompoundMinHeightBiasTop(d,R+"%"),p.setCompoundMinHeightBiasBottom(d,W+"%")}}}})),h.x=c,h.y=g,a.resizeControls.update(),r.trigger("nodeediting.resizedrag",[m,d])},f=function(e){e.target.getStage().container().style.cursor=p.cursors[u[a.location]]},m=function(e){null!=e.target.getStage()&&(e.target.getStage().container().style.cursor=p.cursors.default)};this.shape.on("mouseenter",f),this.shape.on("mouseleave",m),this.shape.on("touchstart mousedown",(function(v){s=d.children().boundingBox(),e=d.isParent()?p.setCompoundMinWidth:p.setWidth,t=d.isParent()?p.setCompoundMinHeight:p.setHeight,i=function(e){return e.isParent()?Math.max(parseFloat(p.getCompoundMinWidth(e)),s.w):e.width()},n=function(e){return e.isParent()?Math.max(parseFloat(p.getCompoundMinHeight(e)),s.h):e.height()},r.trigger("nodeediting.resizestart",[a.location,a.parent]),r.style()._private.coreStyle["active-bg-opacity"]&&(o=r.style()._private.coreStyle["active-bg-opacity"].value),r.style().selector("core").style("active-bg-opacity",0).update(),v.target.getStage().container().style.cursor=p.cursors[u[a.location]];var y=v.target.getStage().getPointerPosition();h.x=y.x,h.y=y.y,r.boxSelectionEnabled(!1),r.panningEnabled(!1),r.autounselectify(!0),r.autoungrabify(!0),a.shape.off("mouseenter",f),a.shape.off("mouseleave",m),l.getStage().on("contentTouchend contentMouseup",c),l.getStage().on("contentTouchmove contentMousemove",g)}))},x.prototype.update=function(){var e=this.parent.renderedPosition(),t=this.parent.renderedOuterWidth()+H(),i=this.parent.renderedOuterHeight()+H(),n={x:e.x-t/2,y:e.y-i/2},o=R(this.parent);this.shape.width(o),this.shape.height(o),this.updateShapePosition(n,t,i,o)},x.prototype.unbindAllEvents=function(){this.shape.off("mouseenter"),this.shape.off("mouseleave"),this.shape.off("touchstart mousedown")},x.prototype.updateShapePosition=function(e,t,i,n){switch(this.location){case"topleft":this.shape.x(e.x-n/2),this.shape.y(e.y-n/2);break;case"topcenter":this.shape.x(e.x+t/2-n/2),this.shape.y(e.y-n/2);break;case"topright":this.shape.x(e.x+t-n/2),this.shape.y(e.y-n/2);break;case"centerright":this.shape.x(e.x+t-n/2),this.shape.y(e.y+i/2-n/2);break;case"bottomright":this.shape.x(e.x+t-n/2),this.shape.y(e.y+i-n/2);break;case"bottomcenter":this.shape.x(e.x+t/2-n/2),this.shape.y(e.y+i-n/2);break;case"bottomleft":this.shape.x(e.x-n/2),this.shape.y(e.y+i-n/2);break;case"centerleft":this.shape.x(e.x-n/2),this.shape.y(e.y+i/2-n/2)}};var b=function(e,t){this.parent=e,this.resizeControls=t;var n=e.renderedPosition(),o=e.renderedOuterWidth()+H(),s=e.renderedOuterHeight()+H(),a={x:n.x-o/2,y:n.y-s/2},r=W(e),d=T(e),h=new Image;h.src=p.resizeToContentCueImage,this.shape=new i.Image({width:d,height:r,image:h}),h.onload=function(){l.draw()},this.updateShapePosition(a,o,s,d,r),this.bindEvents(),l.add(this.shape)};b.prototype.update=function(){var e=this.parent.renderedPosition(),t=this.parent.renderedOuterWidth()+H(),i=this.parent.renderedOuterHeight()+H(),n={x:e.x-t/2,y:e.y-i/2},o=W(this.parent),s=T(this.parent);this.shape.width(s),this.shape.height(o),this.updateShapePosition(n,t,i,s,o)},b.prototype.updateShapePosition=function(e,t,i,n,o){switch(p.resizeToContentCuePosition){case"top-left":this.shape.x(e.x+.4*n),this.shape.y(e.y+.4*o);break;case"top-right":this.shape.x(e.x+t-1.4*n),this.shape.y(e.y+.4*o);break;case"bottom-left":this.shape.x(e.x+.4*n),this.shape.y(e.y+i-1.4*o);break;default:this.shape.x(e.x+t-1.4*n),this.shape.y(e.y+i-1.4*o)}},b.prototype.bindEvents=function(){var e=this.parent,t=this;this.shape.on("mousedown",(function(e){e.evt.preventDefault(),e.evt.stopPropagation()})),this.shape.on("click",(function(i){i.evt.preventDefault(),"function"==typeof p.resizeToContentFunction?p.resizeToContentFunction([e]):r.undoRedo&&p.undoable?r.trigger("nodeediting.resizetocontent",[t]):S({self:t,firstTime:!0})}))},b.prototype.unbindEvents=function(){this.shape.off("mousedown"),this.shape.off("click")};var M,z=function(e){if(e.isParent())return e.children().boundingBox().h;var t=document.createElement("canvas").getContext("2d"),i=e.style();return t.font=i["font-size"]+" "+i["font-family"],Math.max(1.1*t.measureText("M").width,30)},w=function(e){if(e.isParent())return e.children().boundingBox().w;var t=document.createElement("canvas").getContext("2d"),i=e.style();t.font=i["font-size"]+" "+i["font-family"];var n=i.label.split("\n"),o=0;return n.forEach((function(e){var i=t.measureText(e).width;o<i&&(o=i)})),o},B=function(e){var t=e.width(),i=e.height(),n=z(e),o=w(e);if(0!==o&&"function"==typeof p.isFixedAspectRatioResizeMode&&p.isFixedAspectRatioResizeMode(e)){var s=e.width()/e.height(),a=o<n?o:n*s,r=o<n?o/s:n;a>=o&&r>=n?(o=a,n=r):n=(o=o<n?n*s:o)<n?n:o/s}return t===o*u&&i===n*u},R=function(e){return Math.max(1,r.zoom())*p.grappleSize*Math.min(e.width()/25,e.height()/25,1)},W=function(e){return Math.max(1,r.zoom())*p.grappleSize*1.25*Math.min(e.width()/25,e.height()/25,1)},T=function(e){return Math.max(1,r.zoom())*p.grappleSize*1.25*Math.min(e.width()/25,e.height()/25,1)},H=function(){return p.padding*Math.max(1,r.zoom())},S=function(e){var t=e.self.parent,i=t.isParent()?p.setCompoundMinWidth:p.setWidth,n=t.isParent()?p.setCompoundMinHeight:p.setHeight;if(e.firstTime){e.firstTime=null,e.oldWidth=t.isParent()?p.getCompoundMinWidth(t):t.width(),e.oldHeight=t.isParent()?p.getCompoundMinHeight(t):t.height(),t.isParent()&&(e.oldBiasLeft=p.getCompoundMinWidthBiasLeft(t)||"50%",e.oldBiasRight=p.getCompoundMinWidthBiasRight(t)||"50%",e.oldBiasTop=p.getCompoundMinHeightBiasTop(t)||"50%",e.oldBiasBottom=p.getCompoundMinHeightBiasBottom(t)||"50%");var o=w(t),a=z(t);if(0!==o){if("function"==typeof p.isFixedAspectRatioResizeMode&&p.isFixedAspectRatioResizeMode(t)){var r=t.width()/t.height(),d=o<a?o:a*r,h=o<a?o/r:a;d>=o&&h>=a?(o=d,a=h):a=(o=o<a?a*r:o)<a?a:o/r}i(t,o*u),n(t,a*u),t.isParent()&&(p.setCompoundMinWidthBiasLeft(t,"50%"),p.setCompoundMinWidthBiasRight(t,"50%"),p.setCompoundMinHeightBiasTop(t,"50%"),p.setCompoundMinHeightBiasBottom(t,"50%"))}return s&&s.update(),e}var c=e.oldWidth,g=e.oldHeight;if(e.oldWidth=t.isParent()?p.getCompoundMinWidth(t):t.width(),e.oldHeight=t.isParent()?p.getCompoundMinHeight(t):t.height(),i(t,c),n(t,g),t.isParent()){var f=e.oldBiasLeft||"50%",l=e.oldBiasRight||"50%",m=e.oldBiasTop||"50%",v=e.oldBiasBottom||"50%";e.oldBiasLeft=p.getCompoundMinWidthBiasLeft(t)||"50%",e.oldBiasRight=p.getCompoundMinWidthBiasRight(t)||"50%",e.oldBiasTop=p.getCompoundMinHeightBiasTop(t)||"50%",e.oldBiasBottom=p.getCompoundMinHeightBiasBottom(t)||"50%",p.setCompoundMinWidthBiasLeft(t,f),p.setCompoundMinWidthBiasRight(t,l),p.setCompoundMinHeightBiasTop(t,m),p.setCompoundMinHeightBiasBottom(t,v)}return s&&s.update(),e};function P(e,t){var i=function(e){for(var t={},i=0;i<e.length;i++)t[e[i].id()]=!0;return e.filter((function(e,i){"number"==typeof e&&(e=i);for(var n=e.parent()[0];null!=n;){if(t[n.id()])return!1;n=n.parent()[0]}return!0}))}(t);i.union(i.descendants()).positions((function(t,i){"number"==typeof t&&(t=i);var n=t.position("x"),o=t.position("y");return t.isParent()?{x:n,y:o}:{x:n+e.x,y:o+e.y}}))}var E,k,L=!1,N={37:!1,38:!1,39:!1,40:!1};if(E={x:void 0,y:void 0},k={x:0,y:0},r.on("unselect","node",d=function(e){E={x:void 0,y:void 0},k={x:0,y:0},s&&(s.remove(),s=null);var t=r.nodes(":selected");1==t.size()&&(s=new y(t))}),r.on("select","node",h=function(e){var t=e.target;s&&(s.remove(),s=null);var i=r.nodes(":selected");1!=i.size()||p.isNoControlsMode(t)||(s=new y(i))}),r.on("remove","node",(function(e){e.target.selected()&&d()})),r.on("add","node",(function(e){e.target.selected()&&h(e)})),r.on("position","node",(function(e){s&&(s.parent.position(),e.target.id()==s.parent.id()?s.update():k.x==E.x&&k.y==E.y||(k=s.parent.position(),s.update(),E={x:k.x,y:k.y}))})),r.on("zoom",(function(){s&&s.update()})),r.on("pan",(function(){s&&s.update()})),r.on("afterUndo afterRedo",(function(){s&&(s.update(),E={x:void 0,y:void 0})})),p.enableMovementWithArrowKeys&&(document.addEventListener("keydown",(function(e){if("function"==typeof p.moveSelectedNodesOnKeyEvents?p.moveSelectedNodesOnKeyEvents():p.moveSelectedNodesOnKeyEvents){var t=document.activeElement.tagName;if("TEXTAREA"!=t&&"INPUT"!=t){switch(e.keyCode){case 37:case 39:case 38:case 40:case 32:e.preventDefault()}if(e.keyCode<37||e.keyCode>40)return;N[e.keyCode]=!0,e.preventDefault(),L||(M=r.nodes(":selected"),r.trigger("nodeediting.movestart",[M]),L=!0);var i=3;if(e.altKey&&e.shiftKey)return;e.altKey?i=1:e.shiftKey&&(i=10);var n=0,o=0;n+=N[39]?i:0,n-=N[37]?i:0,o+=N[40]?i:0,P({x:n,y:o-=N[38]?i:0},M)}}}),!0),document.addEventListener("keyup",(function(e){e.keyCode<"37"||e.keyCode>"40"||(e.preventDefault(),N[e.keyCode]=!1,("function"==typeof p.moveSelectedNodesOnKeyEvents?p.moveSelectedNodesOnKeyEvents():p.moveSelectedNodesOnKeyEvents)&&(r.trigger("nodeediting.moveend",[M]),M=void 0,L=!1))}),!0)),r.undoRedo&&p.undoable){var F,O;r.on("nodeediting.resizestart",(function(e,i,n){F={node:n,css:{}},n.isParent()?(F.css.minWidth=parseFloat(p.getCompoundMinWidth(n)),F.css.minHeight=parseFloat(p.getCompoundMinHeight(n)),F.css.biasLeft=p.getCompoundMinWidthBiasLeft(n),F.css.biasRight=p.getCompoundMinWidthBiasRight(n),F.css.biasTop=p.getCompoundMinHeightBiasTop(n),F.css.biasBottom=p.getCompoundMinHeightBiasBottom(n)):(F.css.width=n.width(),F.css.height=n.height(),F.position=t.extend({},n.position()))})),r.on("nodeediting.resizeend",(function(e,t,i){F.firstTime=!0,r.undoRedo().do("resize",F),F=void 0})),r.on("nodeediting.movestart",(function(e,t){null!=t[0]&&(O={firstTime:!0,firstNodePosition:{x:t[0].position("x"),y:t[0].position("y")},nodes:t})})),r.on("nodeediting.moveend",(function(e,t){if(null!=O){var i=O.firstNodePosition;O.positionDiff={x:-t[0].position("x")+i.x,y:-t[0].position("y")+i.y},delete O.firstNodePosition,r.undoRedo().do("nodeediting.move",O),O=void 0}})),r.on("nodeediting.resizetocontent",(function(e,t){var i={self:t,firstTime:!0};r.undoRedo().do("resizeToContent",i)}));var A=function(e){if(e.firstTime)return s&&s.update(),delete e.firstTime,e;var i=e.node,n={node:i,css:{}};return i.isParent()?(n.css.minWidth=parseFloat(p.getCompoundMinWidth(i)),n.css.minHeight=parseFloat(p.getCompoundMinHeight(i)),n.css.biasLeft=p.getCompoundMinWidthBiasLeft(i),n.css.biasRight=p.getCompoundMinWidthBiasRight(i),n.css.biasTop=p.getCompoundMinHeightBiasTop(i),n.css.biasBottom=p.getCompoundMinHeightBiasBottom(i)):(n.css.width=i.width(),n.css.height=i.height(),n.position=t.extend({},i.position())),r.startBatch(),i.isParent()?(p.setCompoundMinWidth(i,e.css.minWidth),p.setCompoundMinHeight(i,e.css.minHeight),p.setCompoundMinWidthBiasLeft(i,e.css.biasLeft),p.setCompoundMinWidthBiasRight(i,e.css.biasRight),p.setCompoundMinHeightBiasTop(i,e.css.biasTop),p.setCompoundMinHeightBiasBottom(i,e.css.biasBottom)):(i.position(e.position),p.setWidth(i,e.css.width),p.setHeight(i,e.css.height)),r.endBatch(),s&&s.update(),n},K=function(e){if(e.firstTime)return delete e.firstTime,e;var t=e.nodes,i=e.positionDiff,n={nodes:t,positionDiff:{x:-i.x,y:-i.y}};return P(i,t),n};r.undoRedo().action("resize",A,A),r.undoRedo().action("nodeediting.move",K,K),r.undoRedo().action("resizeToContent",S,S)}var D,I={refreshGrapples:function(){if(s){var e=s.parent;s.remove(),s=new y(e)}},removeGrapples:function(){s&&(s.remove(),s=null)}};return"api",D=I,o(r).api=D,I}))}function o(e,t){void 0===e.scratch("_cyNodeEditing")&&e.scratch("_cyNodeEditing",{});var i=e.scratch("_cyNodeEditing");return void 0===t?i:i[t]}},e.exports&&(e.exports=r),void 0===(n=function(){return r}.call(t,i,t,e))||(e.exports=n),"undefined"!=typeof cytoscape&&"undefined"!=typeof jQuery&&"undefined"!=typeof Konva&&r(cytoscape,jQuery,Konva)}},t={};return function i(n){var o=t[n];if(void 0!==o)return o.exports;var s=t[n]={exports:{}};return e[n](s,s.exports,i),s.exports}(265)})()}));