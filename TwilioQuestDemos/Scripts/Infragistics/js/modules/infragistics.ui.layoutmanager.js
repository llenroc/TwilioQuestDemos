﻿/*!@license
 * Infragistics.Web.ClientUI Grid 13.1.20131.2143
 *
 * Copyright (c) 2011-2013 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on: 
 *	jquery-1.4.4.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
if(typeof jQuery!=="function"){throw new Error("jQuery is undefined")}(function($){$.widget("ui.igLayoutManager",{css:{item:"ig-layout-item",itemTitle:"ig-layout-item-title",container:"ig-layout",flowItem:"ig-layout-flow-item",flow:"ig-layout-flow",vertical:"ig-layout-vertical",verticalItem:"ig-layout-vertical-item",border:"ig-layout-border",borderItem:"ig-layout-border-item",borderHeader:"ig-layout-border-header",borderFooter:"ig-layout-border-footer",borderLeft:"ig-layout-border-left",borderCenter:"ig-layout-border-center",borderRight:"ig-layout-border-right",borderContainer:"ig-layout-border-container"},options:{layoutMode:"column",itemCount:null,itemSelector:".ig-layout-item",itemWidth:null,itemHeight:null,gridLayout:{cols:null,rows:null,marginLeft:0,marginTop:0,maximizeOnClick:true,itemsRearrangable:false,clickTargetSelector:".ig-layout-item"},borderLayout:{showHeader:true,showFooter:true,showLeft:true,showRight:true,leftWidth:null,rightWidth:null},items:[{rowSpan:1,colSpan:1,colIndex:0,rowIndex:0,width:null,height:null}],width:null,height:null},events:{itemRendering:"itemRendering",itemRendered:"itemRendered",rendered:"rendered"},_createWidget:function(options,element){this.options.items=[];$.Widget.prototype._createWidget.apply(this,arguments)},_create:function(){var $this=this;this.element.addClass(this.css.container);if(this.options.width!==null){this.element.width(this.options.width)}if(this.options.height!==null){this.element.height(this.options.height)}this.element.on("resize",function(e){$this.reflow(e)});$(window).on("resize",function(e){$this.reflow(e)});switch(this.options.layoutMode){case"grid":this._initGridLayout();break;case"border":this._initBorderLayout();break;case"flow":this._initFlowLayout();break;case"column":break;case"vertical":this._initVerticalLayout();break;default:break}},reflow:function(event,args){if(event){var noCancel=this._trigger("beforeinternalresize",event,args);if(noCancel){this._trigger("internalresize",event,args)}}},_initVerticalLayout:function(){var i,length=this.options.itemCount,items=this.options.items,item;this.element.addClass(this.css.vertical);if(length>0){for(i=0;i<length;i++){this._trigger(this.events.itemRendering,null,{index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.verticalItem);this._trigger(this.events.itemRendered,null,{item:item,index:i})}}else if(items&&items.length>0){for(i=0;i<items.length;i++){this._trigger(this.events.itemRendering,null,{itemData:items[i],index:i});item=$("<div></div>").appendTo(this.element).addClass(this.css.verticalItem);if(items[i].width){item.css("width",items[i].width)}if(items[i].height){item.css("height",items[i].height)}this._trigger(this.events.itemRendered,null,{item:item,index:i})}}else{this.element.children().addClass(this.css.verticalItem)}},_initGridLayout:function(){var self=this,w=1,h=1,e=this.element,gl=this.options.gridLayout,ih,iw,col,row,rows=0,cols=0,i,j,items=this.options.items,item,width,height,left=0,top=0,iw_percentage,ih_percentage,usePercentages=true,itemsDom,ml=gl.marginLeft,mt=gl.marginTop,offset=e.offset(),useOffset,colSpan,rowSpan,scrollBarWidth=this._getScrollBarWidth();useOffset=this.element.css("position")==="static"?true:false;rows=gl.rows;cols=gl.cols;w=this._getContainerToWindowWidthRatio(scrollBarWidth);h=this._getContainerToWindowHeightRatio();if(gl.columnWidth){iw=gl.columnWidth}else{iw=Math.floor($(window).width()*w/cols-ml)}if(gl.columnHeight){ih=gl.columnHeight}else{ih=$(window).height()*h/rows-mt}if(gl.columnWidth||gl.columnHeight){usePercentages=false}if(usePercentages){iw_percentage=w*100/cols;ih_percentage=h*100/rows}this._allvisible=true;if(items&&items.length>0){usePercentages=false;for(i=0;i<items.length;i++){colSpan=items[i].colSpan;rowSpan=items[i].rowSpan;width=colSpan*iw+(colSpan-1)*ml;height=rowSpan*ih+(rowSpan-1)*mt;row=items[i].rowIndex;col=items[i].colIndex;if(!items[i].element){item=$("<div></div>").appendTo(this.element).addClass("ig-layout-item").attr("id",this.element.attr("id")+"_item_"+col+"_"+row).attr("data-rowspan",rowSpan).attr("data-colspan",colSpan).attr("data-row",row).attr("data-col",col)}else{item=items[i].element.addClass("ig-layout-item").attr("id",this.element.attr("id")+"_item_"+col+"_"+row).attr("data-rowspan",rowSpan).attr("data-colspan",colSpan).attr("data-row",row).attr("data-col",col)}this._trigger(this.events.itemRendered,null,{item:item,itemData:items[i],index:i});if(!usePercentages){item.addClass("ig-layout-griditem-abs");top=row*ih+(row+1)*mt;left=col*iw+(col+1)*ml}else{top=row*ih_percentage+"%";left=col*iw_percentage+"%";item.addClass("ig-layout-griditem-rel")}if(useOffset){top+=offset.top;left+=offset.left}item.css({top:top,left:left,width:width,height:height})}}else if(this.options.itemSelector&&(itemsDom=e.find(this.options.itemSelector)).length>0){e=this.element}else{if(e.children().length===0){if(gl.columnWidth){iw=gl.columnWidth;usePercentages=false}else{iw=parseInt(100/gl.cols,10)+"%"}if(gl.columnHeight){ih=gl.columnHeight;usePercentages=false}else{ih=parseInt(100/gl.rows,10)+"%"}for(i=0;i<gl.rows;i++){for(j=0;j<gl.cols;j++){item=$("<div></div>").appendTo(this.element).addClass("ig-layout-item").attr("id",this.element.attr("id")+"_item_"+i+"_"+j).attr("data-rowspan",1).attr("data-colspan",1).width(iw).height(ih).attr("data-row",i).attr("data-col",j);this._trigger("itemrendered",null,{item:item});if(usePercentages){top=parseInt(i*parseInt(ih,10),10)+"%";left=parseInt(j*parseInt(iw,10),10)+"%";item.addClass("ig-layout-griditem-rel")}else{item.addClass("ig-layout-griditem-abs");top=i*ih+(i+1)*mt;left=j*iw+(j+1)*ml;left+=j===0?ml:0;item.css({top:top,left:left})}}}}}this._trigger(this.events.rendered,null,{items:items});if(!usePercentages){this.element.bind("iglayoutmanagerinternalresize",function(event,args){var ratio,newDim;if(gl.itemsRearrangable){ratio=Math.floor(e.width()/(gl.columnWidth+ml));if(ratio!==gl.cols){gl.cols=ratio;for(i=0;i<items.length;i++){row=items[i].rowIndex;col=items[i].colIndex;items[i].rowIndex=Math.floor(i/ratio);items[i].colIndex=i%ratio;item=$("#"+e.attr("id")+"_item_"+col+"_"+row);item.attr("id",e.attr("id")+"_item_"+items[i].colIndex+"_"+items[i].rowIndex);newDim={top:items[i].rowIndex*gl.columnHeight+(items[i].rowIndex+1)*mt,left:items[i].colIndex*gl.columnWidth+(items[i].colIndex+1)*ml};if(useOffset){newDim.top+=offset.top;newDim.left+=offset.left}item.animate(newDim,250)}}}else{w=self._getContainerToWindowWidthRatio(scrollBarWidth);h=self._getContainerToWindowHeightRatio();iw=Math.floor($(window).width()*w/cols-ml);ih=Math.floor($(window).height()*h/rows)-mt;if(items){for(i=0;i<items.length;i++){row=items[i].rowIndex;col=items[i].colIndex;item=$("#"+e.attr("id")+"_item_"+col+"_"+row);top=row*ih+(row+1)*mt;left=col*iw+(col+1)*ml;colSpan=items[i].colSpan;rowSpan=items[i].rowSpan;if(colSpan===undefined||colSpan===null){colSpan=1}if(rowSpan===undefined||rowSpan===null){rowSpan=1}width=colSpan*iw+(colSpan-1)*ml;height=rowSpan*ih+(rowSpan-1)*mt;if(useOffset){top+=offset.top;left+=offset.left}item.css({left:left,top:top,width:width,height:height})}}}})}},_initBorderLayout:function(){var items=this.options.items,left,right,center,header,footer,bl=this.options.borderLayout,container,cwidth;this.element.addClass(this.css.border);if(items&&items.length&&items.length>0){this.element.empty()}else{left=this.element.find(".left");header=this.element.find(".header");right=this.element.find(".right");center=this.element.find(".center");footer=this.element.find(".footer");if(left.length===0&&bl.showLeft){this._trigger(this.events.itemRendering,null,{region:"left"});left=$("<div></div>").appendTo(this.element);this._trigger(this.events.itemRendered,null,{region:"left",element:left})}left.addClass(this.css.borderItem).addClass(this.css.borderLeft);if(right.length===0&&bl.showRight){this._trigger(this.events.itemRendering,null,{region:"right"});right=$("<div></div>").appendTo(this.element);this._trigger(this.events.itemRendered,null,{region:"right",element:right})}right.addClass(this.css.borderItem).addClass(this.css.borderRight);if(center.length===0){this._trigger(this.events.itemRendering,null,{region:"center"});center=$("<div></div>").appendTo(this.element);this._trigger(this.events.itemRendered,null,{region:"center",element:center})}center.addClass(this.css.borderItem).addClass(this.css.borderCenter);if(footer.length===0&&bl.showFooter){this._trigger(this.events.itemRendering,null,{region:"footer"});footer=$("<div></div>").appendTo(this.element);this._trigger(this.events.itemRendered,null,{region:"footer",element:footer})}footer.addClass(this.css.borderItem).addClass(this.css.borderFooter);if(header.length===0&&bl.showHeader){this._trigger(this.events.itemRendering,null,{region:"header"});header=$("<div></div>").appendTo(this.element);this._trigger(this.events.itemRendered,null,{region:"header",element:header})}header.addClass(this.css.borderItem).addClass(this.css.borderHeader);container=$("<div></div>").appendTo(this.element).addClass(this.css.borderContainer).append(center).append(left).append(right);this.element.append(footer);if(bl.leftWidth!==null&&bl.showLeft){left.css("width",bl.leftWidth);left.css("right",bl.leftWidth);container.css("padding-left",bl.leftWidth)}else if(bl.showLeft===false||left.length===0){container.css("padding-left",0)}if(bl.rightWidth!==null&&bl.showRight){right.css("width",bl.rightWidth);container.css("padding-right",bl.rightWidth)}else if(bl.showRight===false||right.length===0){container.css("padding-right",0)}if(bl.leftWidth&&bl.leftWidth.indexOf&&bl.leftWidth.indexOf("%")!==-1&&bl.rightWidth&&bl.rightWidth.indexOf&&bl.rightWidth.indexOf("%")!==-1){cwidth=100-parseInt(bl.leftWidth,10)-parseInt(bl.rightWidth,10)+"%";center.css("width",cwidth);left.css("margin-left","-"+cwidth);right.css("margin-right","-"+cwidth);container.css("width","100%")}}},_initFlowLayout:function(){var i,length=this.options.itemCount,items=this.options.items,item;this.element.addClass(this.css.flow);if(length>0){for(i=0;i<length;i++){this._trigger(this.events.itemRendering,null,{index:i});item=$("<li></li>").appendTo(this.element).addClass(this.css.flowItem);this._trigger(this.events.itemRendered,null,{item:item,index:i})}}else if(items&&items.length>0){for(i=0;i<items.length;i++){this._trigger(this.events.itemRendering,null,{itemData:items[i],index:i});item=$("<li></li>").appendTo(this.element).addClass(this.css.flowItem);if(items[i].width){item.css("width",items[i].width)}if(items[i].height){item.css("height",items[i].height)}this._trigger(this.events.itemRendered,null,{item:item,index:i})}}else{this.element.children().addClass(this.css.flowItem)}},_getContainerToWindowWidthRatio:function(scrollBarWidth){var e=this.element,w;scrollBarWidth=typeof scrollBarWidth==="number"?scrollBarWidth:0;if(e.css("width")!==""&&e.css("width")!==null&&e.css("width")!==undefined&&e.css("width")!=="0px"){if(e.css("width").indexOf&&e.css("width").indexOf("%")!==-1){w=(parseInt(e.css("width"),10)-scrollBarWidth)/100}else{w=(e.width()-scrollBarWidth)/$(window).width()}}return w},_getContainerToWindowHeightRatio:function(){var e=this.element,h;if(e.css("height")!==""&&e.css("height")!==null&&e.css("height")!==undefined&&e.css("height")!=="0px"){if(e.css("height").indexOf&&e.css("height").indexOf("%")!==-1){h=parseInt(e.css("height"),10)/100}else{h=parseInt(e.css("height"),10)/$(window).height()}}return h},_getScrollBarWidth:function(){var el=$('<div style="width: 100px; height: 100px; position: absolute; top: -10000px; left: -10000px; overflow: scroll"></div>').appendTo($(document.body)),scrollWidth;scrollWidth=el[0].offsetWidth-el[0].clientWidth;el.remove();return scrollWidth},destroy:function(){$.Widget.prototype.destroy.call(this);return this}});$.extend($.ui.igLayoutManager,{version:"13.1.20131.2143"})})(jQuery);(function($){$(document).ready(function(){var wm=$("#__ig_wm__").length>0?$("#__ig_wm__"):$('<div id="__ig_wm__"></div>').appendTo(document.body);wm.css({position:"fixed",bottom:0,right:0,zIndex:1e3}).addClass("ui-igtrialwatermark")})})(jQuery);