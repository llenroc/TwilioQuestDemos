﻿/*!@license
 * Infragistics.Web.ClientUI Grid Multi Headers 13.1.20131.2143
 *
 * Copyright (c) 2011-2013 Infragistics Inc.
 *
 * http://www.infragistics.com/
 *
 * Depends on:
 * Depends on:
 *	jquery-1.4.4.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	infragistics.ui.grid.framework.js
 *	infragistics.ui.shared.js
 *	infragistics.dataSource.js
 *	infragistics.util.js
 */
if(typeof jQuery!=="function"){throw new Error("jQuery is undefined")}(function($){$.widget("ui.igGridMultiColumnHeaders",{css:{multiHeaderCell:"ui-iggrid-multiheader-cell"},options:{},_createWidget:function(){$.Widget.prototype._createWidget.apply(this,arguments)},_create:function(){},_renderingMultiColumnHeader:function(){this._renderHeaderColumns(this.grid._headerParent);this.grid._trigger(this.grid.events.headerRendered,null,{owner:this.grid,table:this.grid.headersTable()});this.grid._headerRenderCancel=false},_analyzeRowspanRows:function(oldCols,level){var i,col,groups=[],ml=this.grid._maxLevel-level,rowspan;for(i=0;i<oldCols.length;i++){rowspan=1;col=oldCols[i];if($.type(col.rowspan)==="string"){col.rowspan=parseInt(col.rowspan,10)}if(col.rowspan>0){rowspan=col.rowspan}if(col.group!==undefined&&col.group!==null){groups.push({group:col.group,level:level+rowspan})}else{if(col.level===0){if(col.rowspan===null||col.rowspan===undefined||isNaN(col.rowspan)){if(ml+1-col.level>0){col.rowspan=ml+1-col.level}}}}if(this._rows[ml]===undefined||this._rows[ml]===null){this._rows[ml]=[]}this._rows[ml].push(col)}for(i=0;i<groups.length;i++){this._analyzeRowspanRows(groups[i].group,groups[i].level)}},_renderRow:function(headerContainer,row,level){var col,i,$headerCell,$tr=$('<tr data-mch-level="'+level+'"></tr>').appendTo(headerContainer);for(i=0;i<row.length;i++){col=row[i];$headerCell=this._createHeaderColumnMarkup(col.headerText,col.colspan,col.key,col.level,col.identifier,col.rowspan);$headerCell.appendTo($tr)}},_renderHeaderColumns:function($container){var $th,i,j,k,oldCols,parents,key,headersTable,parentCol,mchElement,cols=this.grid.options.columns,mchChildren,isToHide,colsLength=cols.length,initHiddenCols=this.grid._initialHiddenColumns,gridId=this.grid.element[0].id,$thead;this._arrayTargetRowspan=[];this._totalColumnsLength=$container.find("colgroup col").length;$thead=$container.find("thead");if($thead.length>0){$container=$thead.empty()}else{$container=$("<thead></thead>").appendTo($container)}this._tr={};oldCols=this.grid._oldCols;this._rows={};this._analyzeRowspanRows(oldCols,0);for(i=this.grid._maxLevel;i>=0;i--){if(this._rows[i]!==null&&this._rows[i]!==undefined){this._renderRow($container,this._rows[i],i)}}for(i=0;i<colsLength;i++){$th=$("#"+gridId+"_"+cols[i].key).data("columnIndex",i);$th.data("data-mch-order",i);this.grid._headerCells.push($th)}if(initHiddenCols){headersTable=this.grid.headersTable().find("thead");for(i=0;i<initHiddenCols.length;i++){key=initHiddenCols[i].key;$("#"+gridId+"_"+key).css("display","none");parents=this.grid._getParentsMultiHeader(key);for(j=0;j<parents.length;j++){parentCol=parents[j];if(parentCol.level>0){mchElement=this.grid._getMultiHeaderColumnById(parentCol.identifier);if(mchElement&&mchElement.children){mchChildren=mchElement.children;isToHide=true;if(mchElement.hidden!==true){for(k=0;k<mchChildren.length;k++){if(mchChildren[k].level===0){$th=$("#"+gridId+"_"+mchChildren[k].key)}else{$th=headersTable.find("th[data-mch-id="+mchChildren[k].identifier+"]")}if(!$th.is(":visible")){isToHide=false;break}}}if(isToHide){headersTable.find("th[data-mch-id="+parentCol.identifier+"]").css("display","none")}}}}}}},_createHeaderColumnMarkup:function(headerText,colSpan,columnKey,level,identifier,rowspan){var grid=this.grid,id,isMultiColumnHeader=true,headerClass=grid.css.headerClass,$th=$("<th></th>"),$headerCell;$headerCell=$th.append('<span class="'+grid.css.headerTextClass+'">'+headerText+"</span>").attr("role","rowheader").addClass(headerClass);if(colSpan>1){$th.attr("colspan",colSpan)}if(rowspan>1){$headerCell.attr("rowspan",rowspan)}if(columnKey){$headerCell.attr("id",this.grid.element[0].id+"_"+columnKey)}if(level===0){id=columnKey;isMultiColumnHeader=false;$headerCell.attr("data-isheadercell",true)}else{id=identifier;$headerCell.addClass(this.css.multiHeaderCell);$headerCell.attr("data-mch-id",identifier)}grid._trigger(grid.events.headerCellRendered,null,{owner:grid,th:$headerCell,columnKey:id,isMultiColumnHeader:isMultiColumnHeader});return $headerCell},getMultiColumnHeaders:function(){return this.grid._oldCols},destroy:function(){$.Widget.prototype.destroy.call(this);return this},_injectGrid:function(gridInstance,isRebind){this.grid=gridInstance}});$.extend($.ui.igGridMultiHeaders,{version:"13.1.20131.2143"})})(jQuery);(function($){$(document).ready(function(){var wm=$("#__ig_wm__").length>0?$("#__ig_wm__"):$('<div id="__ig_wm__"></div>').appendTo(document.body);wm.css({position:"fixed",bottom:0,right:0,zIndex:1e3}).addClass("ui-igtrialwatermark")})})(jQuery);