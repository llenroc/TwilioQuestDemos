﻿/*!@license
 * Infragistics.Web.ClientUI Grid Column Resizing 13.1.20131.2143
 *
 * Copyright (c) 2011-2013 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 *	jquery-1.4.4.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	infragistics.ui.grid.framework.js
 *	infragistics.ui.shared.js
 *	infragistics.dataSource.js
 *	infragistics.util.js
 */
if(typeof jQuery!=="function"){throw new Error("jQuery is undefined")}(function($){$.widget("ui.igGridResizing",{options:{allowDoubleClickToResize:true,deferredResizing:false,columnSettings:[{columnKey:null,columnIndex:null,allowResizing:true,minimumWidth:20,maximumWidth:null}],handleTreshold:5},css:{columnResizeLine:"ui-iggrid-resize-line",resizingHandleCursor:"ui-iggrid-resizing-handle-cursor",resizingHandle:"ui-iggrid-resizing-handle"},events:{columnResizing:"columnResizing",columnResized:"columnResized"},_createWidget:function(options,element){this.options.columnSettings=[];$.Widget.prototype._createWidget.apply(this,arguments)},_create:function(){},_setOption:function(key,value){throw new Error($.ig.Grid.locale.optionChangeNotSupported+" "+key)},destroy:function(){this._clearResizingHandles();this.grid.element.unbind(".resizing");$.Widget.prototype.destroy.call(this);return this},resize:function(column,width){var columnIndex;if(typeof column==="number"){columnIndex=column}else{$.each(this.grid._visibleColumns(),function(index,col){if(col.key===column){columnIndex=index}})}if(width===undefined||width===null){this._autoResize(columnIndex,false,null)}else{this._resizeColumn(columnIndex,width,false,null)}},_dataRendered:function(){},_headerCellRendered:function(event,ui){},_headerRendered:function(event,ui){this._renderResizingHandles()},_columnsCollectionModified:function(){this._renderResizingHandles()},_columnsMoved:function(){this._populateMultiColumnHeadersLevel0()},_renderResizingHandles:function(){var self=this,ths,visibleColumns=this.grid._visibleColumns(),thsMultiHeader;this._clearResizingHandles();if(visibleColumns.length===0){return}if(this.grid._isMultiColumnGrid){thsMultiHeader=this.grid.headersTable().find("> thead > tr th").not("[data-skip=true]").not("[data-isheadercell=true]");this._populateMultiColumnHeadersLevel0();thsMultiHeader.each(function(index){var a,th=$(this);a=self._renderResizingHandle(th);self._bindMultipleResizingHandle(th,a.find("span"))});ths=$(this.grid._headerCells)}else{if(this.grid.options.virtualization===true||this.grid.options.rowVirtualization===true){ths=this.grid.headersTable().find("> thead > tr").eq(0).children("th").not("[data-skip=true]")}else{ths=this.grid.headersTable().find("> thead > tr[data-header-row]").eq(0).children("th").not("[data-skip=true]")}}ths.each(function(index){var a,cs,th=$(this),col=visibleColumns[index];if(col===null||col===undefined){return true}cs=self._findColumnSettingsByKey(col.key);if(cs.allowResizing){a=self._renderResizingHandle(th);self._bindResizingHandle(th,a.find("span"),col)}})},_renderResizingHandle:function(th){var div,a,span;if(!this._resizingHandles){this._resizingHandles=[]}div=$("<div data-resizinghandle='true' />").css("position","relative").css("width","100%").css("height","0px").css("top","0px").css("left","0px").prependTo(th);a=$("<a href='#' />").attr("title","").prependTo(div);if($.ig.util.isIE9){a.addClass(this.css.resizingHandleCursor)}span=$("<span data-nonpaddedindicator='right'></span>").attr("title","").css("position","absolute").css("margin-right",-parseInt(th.css("padding-right"),10)+"px").css("right","0px").css("width",this.options.handleTreshold+"px").addClass(this.css.resizingHandleCursor).addClass(this.css.resizingHandle).appendTo(a);this._resizingHandles.push(div);return a},_populateMultiColumnHeadersLevel0:function(){var i,j,self=this,cols=this.grid._oldCols||[],colsLength=cols.length,ths=$(this.grid._headerCells),level0=[],level0Length,visibleColumns=this.grid._visibleColumns();for(i=0;i<colsLength;i++){if(cols[i].level===0){level0.push(cols[i])}else{for(j=0;j<cols[i].children.length;j++){level0.push(cols[i].children[j])}}}level0Length=level0.length;ths.each(function(index){var th=$(this),col=visibleColumns[index],cs;if(col===null||col===undefined){return true}cs=self._findColumnSettingsByKey(col.key);if(cs.allowResizing){for(i=0;i<level0.length;i++){if(level0[i].key===col.key){break}}if(i<level0Length){level0[i].allowResizing=true;level0[i].visibleIndex=index;level0[i].settings=cs}th.col=level0[i]}})},_bindMultipleResizingHandle:function($th,button){var self=this,id=$th.attr("data-mch-id"),column;column=this.grid._getMultiHeaderColumnById(id);button.mouseWrapper({distance:5,start:function(event){return self._startResizing($th)},drag:function(event){return self._doResizingMultiColumnHeader(event.originalEvent,$th,column)},stop:function(event){return self._stopResizingMiltiColumnHeader(event.originalEvent,$th,column)}}).bind("dblclick.resizing",function(event){self._handleMouseMultiColumnHeaderDbClick(event,$th,column)}).bind("click.resizing",function(event){event.preventDefault();event.stopPropagation()})},_bindResizingHandle:function(th,button,column){var self=this;button.mouseWrapper({distance:5,start:function(event){return self._startResizing(th)},drag:function(event){return self._doResizing(event.originalEvent,th,column)},stop:function(event){return self._stopResizing(event.originalEvent,th,column)}}).bind("dblclick.resizing",function(event){self._handleMouseDbClick(event,th,column)}).bind("click.resizing",function(event){event.preventDefault();event.stopPropagation()})},_clearResizingHandles:function(){var i;if(this._resizingHandles){for(i=0;i<this._resizingHandles.length;i++){this._resizingHandles[i].remove()}this._resizingHandles=[]}},_handleMouseDbClick:function(event,th,column){if(!this.options.allowDoubleClickToResize){return}this._autoResize($.inArray(column,this.grid._visibleColumns()),true,event)},_handleMouseMultiColumnHeaderDbClick:function(event,$th,column){var i,children=column.children,childrenLength=children.length;if(!this.options.allowDoubleClickToResize){return}for(i=0;i<childrenLength;i++){if(children[i].allowResizing===true){this._autoResize(children[i].visibleIndex,true,event)}}},_autoResize:function(columnIndex,fireEvents,event){var rows,cells=[],maxWidth=0,measureDiv,i;rows=this.grid.element.find("> tbody > tr").not("[data-container=true]").not("[data-grouprow=true]");for(i=0;i<rows.length;i++){cells.push(rows.eq(i).children("td").not("[data-skip=true]").not(".ui-iggrid-rowselector-class").not(".ui-iggrid-expandcolumn").eq(columnIndex))}if(cells.length>0){measureDiv=$("<div></div>").css({position:"absolute",visibility:"hidden",height:"auto",width:"auto",left:-1e3,top:-1e3,"font-family":cells[0].css("fontFamily"),"font-size":cells[0].css("fontSize"),"font-size-adjust":cells[0].css("fontSizeAdjust"),"font-stretch":cells[0].css("fontStretch"),"font-style":cells[0].css("fontStyle"),"font-variant":cells[0].css("fontVariant"),"font-weight":cells[0].css("fontWeight")}).appendTo($(document.body));for(i=0;i<cells.length;i++){measureDiv.html(cells[i][0].innerHTML);maxWidth=Math.max(maxWidth,measureDiv[0].offsetWidth)}maxWidth=maxWidth+cells[0].outerWidth()-cells[0].width();if($.ig.util.isIE){maxWidth+=1}measureDiv.remove();return this._resizeColumn(columnIndex,maxWidth,fireEvents,event)}},_cancelHoveringEffects:function(cancel){var topmostGrid=this.grid.element.closest(".ui-iggrid-root").data("igGrid");if(topmostGrid===undefined||topmostGrid===null){topmostGrid=this.grid}topmostGrid._cancelHoveringEffects=cancel},_startResizing:function(th){var body=$(document.body),resizeLineTop,heightOffset;this._resizing=true;this._cancelHoveringEffects(true);$(document.activeElement).blur();body.addClass(this.css.resizingHandleCursor);if(this.grid._isMultiColumnGrid){heightOffset=th.offset().top-this._gridContainerPositioningOffset().top}resizeLineTop=th.offset().top+this._gridContainerPositioningOffset().top;if(this.grid.options.height!==null&&this.grid.options.showHeader===true&&this.grid.options.fixedHeaders===false){resizeLineTop+=this.grid.scrollContainer().scrollTop()}this._resizeLine=$("<div></div>").addClass(this.css.columnResizeLine).data("efh","1").css({height:this._calculateGridResizableHeight(heightOffset),top:resizeLineTop,visibility:"hidden"}).appendTo(this.grid.container());return true},_doResizingMultiColumnHeader:function(event,$th,column){var i,width,resizeCellRange,min,max,resizeResult,range,offsetLeft,offsetHeight,children=column.children,childrenLength=children.length,child=null,cellToResize;width=event.pageX-$th.offset().left;if(width<0){width=0}offsetHeight=$th.offset().top-this.grid.headersTable().offset().top;if(!this.options.deferredResizing){for(i=childrenLength-1;i>=0;i--){if(children[i].allowResizing&&!children[i].hidden){child=children[i];child.resized=!child.resized;if(child.resized){break}}}if(child!==null&&!child.hidden){cellToResize=$("#"+this.grid.element[0].id+"_"+child.key);width=cellToResize[0].offsetWidth-$th[0].offsetWidth+width;resizeResult=this._resizeColumn(child.visibleIndex,width,true,event,child.visibleIndex)}if(!resizeResult){return true}if(!resizeResult.canceled){this._resizeLine.css("height",this._calculateGridResizableHeight(offsetHeight));this._resizeLine.css({left:$th.offset().left+$th.outerWidth()+this._gridContainerPositioningOffset().left,visibility:"visible"})}}else{max=Infinity;min=0;offsetLeft=$th.offset().left;range={min:offsetLeft,max:offsetLeft};for(i=0;i<childrenLength;i++){child=children[i];if(child.hidden){continue}if(child.allowResizing){resizeCellRange=this._getRange(this.options.columnSettings[child.visibleIndex]);range.min+=resizeCellRange.min;if(resizeCellRange.max===Infinity){range.max=Infinity}else if(range.max!==Infinity){range.max+=resizeCellRange.max}}else{range.min+=$("#"+this.grid.element[0].id+"_"+child.key)[0].offsetWidth}}this._resizeLine.css("height",this._calculateGridResizableHeight(offsetHeight));this._resizeLine.css({left:this._coerceRange(range,event.pageX)+this._gridContainerPositioningOffset().left,visibility:"visible"})}return true},_doResizing:function(event,th,column){var width,resizeResult,columnIndex=$.inArray(column,this.grid._visibleColumns()),range,offsetLeft,offsetHeight;if(!this.options.deferredResizing){width=event.pageX-th.offset().left;if(width<0){width=0}if(this.grid._isMultiColumnGrid){offsetHeight=th.offset().top-this.grid.headersTable().offset().top}resizeResult=this._resizeColumn(columnIndex,width,true,event);if(!resizeResult.canceled){this._resizeLine.css("height",this._calculateGridResizableHeight(offsetHeight));this._resizeLine.css({left:th.offset().left+th.outerWidth()+this._gridContainerPositioningOffset().left,visibility:"visible"})}}else{range=this._getRange(this.options.columnSettings[columnIndex]);offsetLeft=th.offset().left;range.min+=offsetLeft;range.max+=offsetLeft;this._resizeLine.css({left:this._coerceRange(range,event.pageX)+this._gridContainerPositioningOffset().left,visibility:"visible"})}return true},_stopResizingMiltiColumnHeader:function(event,th,column){var i,width,cs,columnKey,children,childrenLength,childrenLengthAllowResizing=0,childrenToResize;if(this.options.deferredResizing){width=event.pageX-th.offset().left;children=column.children;childrenLength=children.length;childrenToResize=[];for(i=0;i<childrenLength;i++){columnKey=children[i].key;cs=this._findColumnSettingsByKey(columnKey);if(children[i].allowResizing===false||cs&&cs.allowResizing===false){width-=$("#"+this.grid.element[0].id+"_"+columnKey)[0].offsetWidth;continue}childrenToResize.push(children[i]);childrenLengthAllowResizing++}if(childrenLengthAllowResizing>0){this._resizeMCHDeffered(width,childrenToResize)}}$("body").removeClass(this.css.resizingHandleCursor);this._resizing=false;this._cancelHoveringEffects(false);this._resizeLine.remove();this._resizeLine=undefined;return true},_resizeMCHDeffered:function(width,columns){var i,column,columnIndex,columnsLength=columns.length,visibleColumns=[],gridVC=this.grid._visibleColumns(),resizeInfo,newWidth=width,newColumnsToResize=[],avgWidth;if(columnsLength===0){return}for(i=0;i<columnsLength;i++){columnIndex=$.inArray(columns[i],gridVC);if(columnIndex===-1||this.options.columnSettings[columnIndex].allowResizing===false){continue}visibleColumns.push({column:column,columnIndex:columnIndex})}columnsLength=visibleColumns.length;if(columnsLength>0){avgWidth=parseInt(width/columnsLength,10);for(i=0;i<columnsLength;i++){column=visibleColumns[i].column;columnIndex=visibleColumns[i].columnIndex;resizeInfo=this._resizeColumn(columnIndex,avgWidth,true);if(resizeInfo.newWidth!==avgWidth){newWidth-=resizeInfo.newWidth}else{newColumnsToResize.push(column)}}}if(newWidth>5&&newWidth!==width&&newColumnsToResize.length>0){this._resizeMCHDeffered(newWidth,newColumnsToResize)}},_stopResizing:function(event,th,column){var width,columnIndex=$.inArray(column,this.grid._visibleColumns());if(this.options.deferredResizing){width=event.pageX-th.offset().left;width=this._coerceRange(this._getRange(this.options.columnSettings[columnIndex]),width);this._resizeColumn(columnIndex,width,true,event)}$("body").removeClass(this.css.resizingHandleCursor);this._resizing=false;this._cancelHoveringEffects(false);this._resizeLine.remove();this._resizeLine=undefined;return true},_resizeColumn:function(columnIndex,width,fireEvents,originalEvent,startIndex){var columnKey=this.grid._visibleColumns()[columnIndex].key,headersTable=this.grid.headersTable(),headers,headerWidth,headerColumns,columnSettings=this.options.columnSettings,columnsLength,headerColStyleWidth,hasPercentageWidth,actualColumnStyleWidths=[],actualColumnWidths=[],requiredColumnPercentageWidths=[],newColumnStyleWidths=[],i,widthToDistribute,shrinkColumns,widthDistributed,widthUsed,coercedWidth,widthPerColumn,range,totalWidth,readyColumns,readyColumnsCount,finalPixelWidth,allColumnsHaveWidth,noCancel,containerWidth,isResized=true;if(this.grid._isMultiColumnGrid){headers=$(this.grid._headerCells);headerWidth=$(headers[columnIndex])[0].offsetWidth}else{if(this.grid.options.virtualization===true||this.grid.options.rowVirtualization===true){headers=headersTable.find("> thead > tr").first().children("th").not("[data-skip=true]")}else{headers=headersTable.find("> thead > tr[data-header-row]").first().children("th").not("[data-skip=true]")}headerWidth=headers.get(columnIndex).offsetWidth}headerColumns=headersTable.find("> colgroup > col").not("[data-skip=true]");columnSettings=this.options.columnSettings;columnsLength=headerColumns.length;headerColStyleWidth=headerColumns[columnIndex].style.width;hasPercentageWidth=/%$/.test(headerColStyleWidth);if(fireEvents){noCancel=this._trigger(this.events.columnResizing,originalEvent,{owner:this,columnIndex:columnIndex,columnKey:columnKey,desiredWidth:width});if(!noCancel){return{canceled:true,originalWidth:width,newWidth:width}}}range=this._getRange(columnSettings[columnIndex]);width=this._coerceRange(range,width);width=Math.floor(width);if(width===range.min||width===range.max){isResized=false}if(this.grid._isMultiColumnGrid){if($.ig.util.isWebKit&&hasPercentageWidth){totalWidth=headersTable[0].offsetWidth;for(i=0;i<columnsLength;i++){actualColumnWidths[i]=parseFloat(headerColumns[i].style.width)/100*totalWidth}}else{for(i=0;i<columnsLength;i++){actualColumnStyleWidths[i]=headerColumns[i].style.width;actualColumnWidths[i]=headers[i][0].offsetWidth}}}else{if($.ig.util.isWebKit&&hasPercentageWidth){totalWidth=headersTable[0].offsetWidth;for(i=0;i<columnsLength;i++){actualColumnWidths[i]=parseFloat(headerColumns[i].style.width)/100*totalWidth}}else{for(i=0;i<columnsLength;i++){actualColumnStyleWidths[i]=headerColumns[i].style.width;actualColumnWidths[i]=headers[i].offsetWidth}}}if(hasPercentageWidth){widthToDistribute=headerWidth-width;shrinkColumns=widthToDistribute<0;readyColumns=[];readyColumnsCount=0;widthDistributed=0;if(startIndex===undefined||startIndex===null){startIndex=0}while(readyColumnsCount<columnsLength-1-startIndex&&(shrinkColumns&&widthToDistribute<-.05||!shrinkColumns&&widthToDistribute>.05)){widthPerColumn=widthToDistribute/(columnsLength-1);for(i=startIndex;i<columnsLength;i++){if(i!==columnIndex&&!readyColumns[i]){if(shrinkColumns){widthUsed=Math.max(widthPerColumn,widthToDistribute)}else{widthUsed=Math.min(widthPerColumn,widthToDistribute)}actualColumnWidths[i]+=widthUsed;range=this._getRange(columnSettings[i]);coercedWidth=this._coerceRange(range,actualColumnWidths[i]);if(Math.abs(actualColumnWidths[i]-coercedWidth)>5e-6){widthUsed-=actualColumnWidths[i]-coercedWidth;actualColumnWidths[i]=coercedWidth;readyColumns[i]=true;readyColumnsCount++}widthDistributed+=widthUsed;widthToDistribute-=widthUsed}}}actualColumnWidths[columnIndex]-=widthDistributed;totalWidth=0;for(i=0;i<columnsLength;i++){totalWidth+=actualColumnWidths[i]}for(i=0;i<columnsLength;i++){requiredColumnPercentageWidths[i]=100*actualColumnWidths[i]/totalWidth}for(i=0;i<columnsLength;i++){newColumnStyleWidths[i]=requiredColumnPercentageWidths[i]+"%";this.grid._visibleColumns()[i].width=newColumnStyleWidths[i]}finalPixelWidth=actualColumnWidths[columnIndex];this._applyToEachGridCOL(function(index,col){col.css("width",newColumnStyleWidths[index])})}else{allColumnsHaveWidth=true;for(i=0;i<columnsLength;i++){if(i===columnIndex){newColumnStyleWidths[i]=width+"px";finalPixelWidth=width;this.grid._visibleColumns()[i].width=newColumnStyleWidths[i]}else{newColumnStyleWidths[i]=actualColumnStyleWidths[i];allColumnsHaveWidth=allColumnsHaveWidth&&parseInt(actualColumnStyleWidths[i],10)>0}}this._applyToEachGridCOL(function(index,col){col.css("width",newColumnStyleWidths[index])});containerWidth=this.grid._calculateContainerWidth(false);if(allColumnsHaveWidth){if(this.grid.options.width&&parseInt(this.grid.options.width,10)>0){this.grid._updateGridContentWidth();$("#"+this.grid.element[0].id+"_horizontalScrollContainer").children("div").css("width",containerWidth)}else{this.grid._setContainerWidth(this.grid.element[0].id+"_container");if(this.grid.options.rowVirtualization||this.grid.options.virtualization===true){$("#"+this.grid.element[0].id+"_headers_v").css("width",containerWidth+this.grid._scrollbarWidth()).css("max-width",containerWidth+this.grid._scrollbarWidth());$("#"+this.grid.element[0].id+"_displayContainer").css("width",containerWidth).css("max-width",containerWidth);$("#"+this.grid.element[0].id+"_virtualContainer > colgroup > col").first().attr("width",containerWidth)}}}}if(fireEvents){this._trigger(this.events.columnResized,originalEvent,{owner:this,columnIndex:columnIndex,columnKey:columnKey,originalWidth:headerWidth,newWidth:finalPixelWidth})}return{canceled:false,originalWidth:headerWidth,newWidth:finalPixelWidth,isResized:isResized}},_applyToEachGridCOL:function(appliedFunction){if(this.grid.options.showHeader){this.grid.headersTable().find("> colgroup > col").not("[data-skip=true]").each(function(i){appliedFunction(i,$(this))})}if(this.grid.options.fixedHeaders===true&&this.grid.options.height!==null||this.grid.options.showHeader===false){this.grid.element.find("> colgroup > col").not("[data-skip=true]").each(function(i){appliedFunction(i,$(this))})}if(this.grid.options.fixedFooters===true&&this.grid.options.height!==null){this.grid.footersTable().find("> colgroup > col").not("[data-skip=true]").each(function(i){appliedFunction(i,$(this))})}},_getRange:function(column){var min=column.minimumWidth,max=column.maximumWidth;min=isNaN(min)?0:min;min=Math.max(0,min);max=isNaN(max)?Infinity:max;return{min:min,max:max}},_coerceRange:function(range,value){value=Math.max(range.min,value);value=Math.min(range.max,value);return value},_gridContainerPositioningOffset:function(){var gridContainer=this.grid.container(),gridContainerOffsetParent=gridContainer.offsetParent(),gridContainerPosition=gridContainer.position(),gridContainerOffset=gridContainer.offset(),offsetParentScrollTop,offsetParentScrollLeft;if(gridContainerOffsetParent.is("body")){offsetParentScrollTop=0;offsetParentScrollLeft=0}else{offsetParentScrollTop=gridContainerOffsetParent.scrollTop();offsetParentScrollLeft=gridContainerOffsetParent.scrollLeft()}return{top:offsetParentScrollTop+gridContainerPosition.top-gridContainerOffset.top,left:offsetParentScrollLeft+gridContainerPosition.left-gridContainerOffset.left}},_calculateGridResizableHeight:function(heightOffset){var height,caption,headersTable,footersTable,scrollerContainer,hasVirtualization=this.grid.options.virtualization===true||this.grid.options.rowVirtualization===true||this.grid.options.columnVirtualization===true,hasWidthOrHeight=this.grid.options.height!==null||this.grid.options.width!==null;if(hasVirtualization){height=$("#"+this.grid.element[0].id+"_displayContainer").height()}else if(hasWidthOrHeight){height=this.grid.scrollContainer().height()}else{height=this.grid.element.height()}if(hasVirtualization||hasWidthOrHeight){headersTable=this.grid.headersTable();footersTable=this.grid.footersTable();if(this.grid.options.fixedHeaders===true&&this.grid.options.showHeader===true){if(headersTable.length!==0&&this.grid.element[0].id!==headersTable[0].id){height+=headersTable.height()}caption=headersTable.children("#"+this.grid.element[0].id+"_caption");if(caption.length!==0){if(!$.ig.util.isFF){height-=caption.outerHeight(true)}}}scrollerContainer=$("#"+this.element[0].id+"_hscroller_container");if(scrollerContainer.is(":visible")){height+=scrollerContainer.height()}if(this.grid.options.fixedFooters===true&&this.grid.options.showFooter===true&&footersTable.length!==0&&this.grid.element[0].id!==footersTable[0].id){height+=footersTable.height()}}if(heightOffset){height-=heightOffset}return height},_findColumnSettingsByKey:function(key){var i;for(i=0;i<this.options.columnSettings.length;i++){if(this.options.columnSettings[i].columnKey===key){return this.options.columnSettings[i]}}},_initDefaultSettings:function(){var settings=[],key,cs=this.options.columnSettings,i,j,foundByKey;if(this.grid.options.columns&&this.grid.options.columns.length>0){for(i=0;i<this.grid.options.columns.length;i++){settings[i]={columnIndex:i,columnKey:this.grid.options.columns[i].key,allowResizing:true,minimumWidth:20}}}for(i=0;i<cs.length;i++){foundByKey=false;for(j=0;j<settings.length;j++){if(settings[j].columnKey===cs[i].columnKey||settings[j].columnIndex===cs[i].columnIndex){foundByKey=settings[j].columnKey===cs[i].columnKey;break}}if(j===settings.length){continue}for(key in cs[i]){if(cs[i].hasOwnProperty(key)&&key!=="columnIndex"&&key!=="columnKey"){settings[j][key]=cs[i][key]}}}this.options.columnSettings=settings},_injectGrid:function(gridInstance,isRebind){this.grid=gridInstance;this._initDefaultSettings();this.grid.element.bind("iggridheadercellrendered.resizing",$.proxy(this._headerCellRendered,this));this.grid.element.bind("iggridheaderrendered.resizing",$.proxy(this._headerRendered,this));this.grid.element.bind("iggridcolumnscollectionmodified.resizing",$.proxy(this._columnsCollectionModified,this));this.grid.element.bind("iggrid_columnsmoved.resizing",$.proxy(this._columnsMoved,this))}});$.extend($.ui.igGridResizing,{version:"13.1.20131.2143"})})(jQuery);(function($){$(document).ready(function(){var wm=$("#__ig_wm__").length>0?$("#__ig_wm__"):$('<div id="__ig_wm__"></div>').appendTo(document.body);wm.css({position:"fixed",bottom:0,right:0,zIndex:1e3}).addClass("ui-igtrialwatermark")})})(jQuery);