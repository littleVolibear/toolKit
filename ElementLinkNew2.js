Ext.Loader.setConfig({
			enabled : true
		});

Ext.Loader.setPath('Ext.common.manage', '../common');
Ext.Loader.setPath('Ext.mtm.WC.manage', '../mtm/WC/manage');
Ext.Loader.setPath('Ext.grid', '../resources/app');

Ext.Loader.setPath("Ext.optsrv.js.attribute", "../optsrv/js/attribute");
Ext.Loader.setPath("Ext.optsrv.advsearch", "../optsrv/advSearch");
Ext.Loader.setPath("Ext.element.js", "../element/js");
Ext.Loader.setPath("Ext.optsrv.js", "../optsrv/js");

Ext.require([ "Ext.mtm.WC.manage.CellEditing",
	"Ext.mtm.WC.manage.EditMTMAttribute",
	"Ext.common.manage.CommonViewTranslation",
	"Ext.common.manage.CommonEditTranslation",
	"Ext.element.js.viewAttributes",
	"Ext.element.js.viewElementTranslation",
	"Ext.element.js.editElementLink",
	"Ext.mtm.WC.manage.ListCountrys", "Ext.element.js.elementsList",
	"Ext.mtm.WC.manage.commonWindow", "Ext.mtm.WC.manage.linkCountrys",
	"Ext.mtm.WC.manage.sbbList","Ext.mtm.WC.manage.svcList", "Ext.mtm.WC.manage.Action",
	"Ext.optsrv.advsearch.optsrv_advS", "Ext.optsrv.js.attribute.edit","Ext.grid.CopyPasteGrid" ]);

function closeWinFun(){
	window.parent.enhanceWinPanel.close();
}

// Set/clear Ocm button end

var transpose = 'original'; //transposed
var allPns = [];

//fieldsValue data is defined as below
/**
 *  fieldsValue = {[pn|PhCode|ocmValue]}
 */
var fieldsValue = [];
var customColumns = [ {text : 'Element ID',flex : 1,id : 'eleId',dataIndex : 'eleId',name : 'eleId'},
		 {text : 'Element Description',flex : 1,id : 'eleName',dataIndex : 'eleName',name : 'eleName'},
		 {text : 'Status', flex : 1,id : 'eleStatus',dataIndex : 'eleStatus',name : 'eleStatus'},
		 {text : 'Type', flex : 1,id : 'eleType',dataIndex : 'eleType',name : 'eleType'}];

var newCustomColumns = [];

var customFields = [ 'eleId', 'eleName', 'eleStatus','eleType'];

var searchResults = [];

var searchCriteria = [];

var idList = [];
var selectingCell = [];
var winSaved = false;
var allCTONumbers = [];
var allCTONumAndDesc = [];

var typeKeys = [];
var exportData = [];
var objType = '';

function processAfterGotResult(){
	console.log('process after got results1:' + searchCriteria);
	console.log('process after got results2:' + searchResults);

	Ext.onReady(Ext.elementViewGrid.init,Ext.elementViewGrid);
}

var customTbar = [
	{
		text : '<b>Search</b>',
		iconCls : 'icon-search',
	    id: 'search_button',
		handler : function(){
			ctoViewLinksSearchPanel = new Ext.Window({
				title : 'Search Critiera',
				width : 900,
				height : 500,
				constrain : true,
				modal : true,
				closable : true,
				html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/viewLinksSearch.html?"> </iframe>'//' + allCTONumbers + '&' + objType + '&' + idList +'
			});
			ctoViewLinksSearchPanel.show();
		}
	},
//	{
//		text : '<b>Update</b>',
//		iconCls : 'icon-edit',
//		handler : function(){
//			editElementLinkWinPanel = new Ext.Window({
//				title : 'Update',
//				width : 900,
//				height : 450,
//				constrain : true,
//				modal : true,
//				closable : true,//'&' + searchResults + 
//				html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/editElementLinkWin.html?"> </iframe>'//' + allCTONumbers + '&' + objType + '&' + idList +'
//
//			});
//			editElementLinkWinPanel.show();
//		}
////		handler : function () {
////			var obj = Ext.createWidget('editElementLink', {
////				ids : idList,
////				objType : objType,
////				searchResults : searchResults
////				
////			});
////			
////		}
//	},
//	{
//		text : '<b>Control Update</b>',
//		iconCls : 'icon-edit',
//		handler : function () {
//			
//			controlEditElementLinkWinPanel = new Ext.Window({
//				title : 'Control Update',
//				width : 900,
//				height : 600,
//				constrain : true,
//				modal : true,
//				closable : true,//'&' + searchResults + 
//				html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/editElementLinkWin.html?"> </iframe>'//' + allCTONumbers + '&' + objType + '&' + idList +'
//
//			});
//			controlEditElementLinkWinPanel.show();
//		}
//	},
	{
		text : '<b>Export</b>',
		iconCls : 'icon-loadsheet',
		handler : function () {

        	var	downloadForm = Ext.create('Ext.form.FormPanel', {
				height :170,
				bodyStyle : 'padding:5px 5px 0',
				items : [{
					layout : 'column',
					border : false,
					labelWidth : 120,
					labelAlign : "left"
				}]
			});
			downloadForm.getForm().standardSubmit = true;
			
			downloadForm.getForm().submit({
				params : {
					idList : idList,
					typeKeys : typeKeys,
					objType : objType,
					needCheckout : '0',
					exportData : exportData
				},
				method : 'post',
				url : '../element/loadSheet!generateElementLinkLoadSheetNew.action',
				success : function(fp, o) {
					Ext.Msg.alert('success','download success');
				},
				failure : function(form, action) {
					Ext.Msg.alert('failed','download failed');
				}
			});
			
		}
	}
//	{
//		text : '<b>Export With Checkout</b>',
//		iconCls : 'icon-loadsheet',
//		handler : function () {
//			
//			Ext.Ajax.request({
//                				url : '../element/elementLink!checkOutObjectsByObjectIdsNew.action',
//                				timeout : 1800000,
//                				params : {
//                					ids : idList,
//                					objectType : objType
//                				},
//                				success : function(response, option) {
//                					var	downloadForm = Ext.create('Ext.form.FormPanel', {
//                					height :170,
//                					bodyStyle : 'padding:5px 5px 0',
//                					items : [{
//                						layout : 'column',
//                						border : false,
//                						labelWidth : 120,
//                						labelAlign : "left"
//                					}]
//                				});
//                				downloadForm.getForm().standardSubmit = true;
//                				
//                				
//                				downloadForm.getForm().submit({
//                					params : {
//                						idList : idList,
//                						typeKeys : typeKeys,
//                						objType : objType,
//                						needCheckout : '1',
//                						exportData : exportData
//                					},
//                					method : 'post',
//                					url : '../element/loadSheet!generateElementLinkLoadSheetNew.action',
//                					success : function(fp, o) {
//                						Ext.Msg.alert('success','download success');
//                					},
//                					failure : function(form, action) {
//                						Ext.Msg.alert('failed','download failed');
//                					}
//                				});
//                				}
//                			});
//
//		}
//	},
//	{
//		text : '<b>Close</b>',
//		iconCls : 'icon-cancel',
//		handler : function() {
//			window.parent.enhanceWinPanel.close();
//			
//		}
//	}
];

Ext.elementViewGrid = function elementViewFn(){
	return{
		init:function(){
		
			var url = location.search;
//			var rule = url.split("&");
//			var idResults = rule[0];
//			var typeResults = rule[1];
//			var rule1 = idResults.split("=");
			var rule2 = url.split("=");
			
//			var results = rule1[1];
			var type = rule2[1];
			objType = type;
				
			var ids = window.parent.selectedIds;
			console.log('object size:' + ids.length);
			var needToAddId = true;
			for(var i = 0; i < ids.length; i++ ) {
				var tmpId = ids[i];
				for(var idListInt in idList){
					var existedId = idList[idListInt];
					if(existedId == tmpId){
						needToAddId = false;
					}
				}
				if(needToAddId){
					 idList.push(tmpId);
				}
			}
			
			objType = type;

			Ext.Ajax.timeout = 900000;// set time out

			Ext.Ajax.request({
				url : '../element/elementLink!findOfferingsByIds.action',
				timeout : 1800000,
				params : {
					ids : idList,
					objectType : type
				},
				success : function(response, option) {

					var resp = Ext.JSON.decode(response.responseText);
					var resultsList = resp.results;
					console.log("resultsList:" + resultsList);
					for(var singleInt in resultsList){
						var newSingleObjectNumber = resultsList[singleInt].objectNumber;
						var newSingleObjectName = resultsList[singleInt].objectName;
						console.log("adding:" + newSingleObjectNumber);
						console.log("adding:" + newSingleObjectName);
						
						var isAppendCTO = true;
						for(var tmpInt in allCTONumbers){
							var tmpCto = allCTONumbers[tmpInt];
							if(newSingleObjectNumber == tmpCto){
								isAppendCTO = false;
							}
						}
						if(isAppendCTO){
							allCTONumbers.push(newSingleObjectNumber);
							allCTONumAndDesc.push(newSingleObjectNumber+'['+newSingleObjectName+']');
						}
						/*console.log("newSingleObjectNumber:================" + newSingleObjectNumber);
						console.log("newSingleObjectName:==================" + newSingleObjectName);*/
//						customColumns.push({text : newSingleObjectNumber+'['+newSingleObjectName+']',flex : 1,id : newSingleObjectNumber,dataIndex : newSingleObjectNumber,name : newSingleObjectNumber});
//						customFields.push(newSingleObjectNumber);
					}
					
					console.log("customColumns:" + customColumns);
					console.log("customFields:" + customFields);
					

					var store;
					var grid;
					var searchstore;// 页面只展示search查找的新元素(confirm) --element列表

					Ext.regModel('elelinkui',
							{
								fields: customFields
							});
					/*store = new Ext.data.JsonStore({
						model: 'elelinkui',
						pageSize: 100,
						proxy: {
							type: 'ajax',
							url: '../element/elementLink!findElementsByObjectIdsNew.action',
							timeout : 1800000,
							actionMethods: {
			                    read: 'POST' 
			                },
							reader: {
								type: 'json',
								root: 'results',
								totalProperty: 'totalCount'
							}
						}
					});
					
					
					Ext.apply(store.proxy.extraParams,
							{ ids: idList,customFields : customFields, searchResults : searchResults,objectType : type});
					store.load({ 
						params: 
							{ 
							ids: idList,
							customFields : customFields, 
							searchResults : searchResults,
							objectType : type
							} 
					});
					
					
					var jsonDataEncode = "";  
					store.load({
						scope : this,
						callback: function(records, operation, success) {
							store.each(function(record) {
								typeKeys.push(record.get('eleType'));
								//alert(record.get('eleName'));
								exportData.push(record.get('eleId'));
								console.log("eleType:===" + record.get('eleType'));
								console.log("eleId:===" + record.get('eleId'));
								
							});
						}
						});*/
					console.log("typekeys:===" + typeKeys);
					console.log("exportData:===" + exportData);
					// add 页面只展示search查找的新元素(confirm) --element列表
					searchstore = new Ext.data.JsonStore({
						model: 'elelinkui',
						pageSize: 100,

						proxy: {
							type: 'ajax',
							url: '../element/elementLink!findElementsByObjectIdsNew2.action',
							actionMethods: {
			                    read: 'POST' 
			                },
							reader: {
								type: 'json',
								root: 'results',
								totalProperty: 'totalCount'
							}
						}
					});
					Ext.apply(searchstore.proxy.extraParams,
							{ ids: idList,customFields : customFields, searchResults : searchResults,objectType : type});
					searchstore.load({ 
						params: 
							{ 
							ids: idList,
							customFields : customFields, 
							searchResults : searchResults,
							objectType : type
							} 
					});
					searchstore.load({
						scope : this,
						callback: function(records, operation, success) {
							searchstore.each(function(record) {
								typeKeys.push(record.get('eleType'));
								exportData.push(record.get('eleId'));
								console.log("eleType:===" + record.get('eleType'));
								console.log("eleId:===" + record.get('eleId'));
								
							});
						}
						});
					// end
					
					grid = new Ext.grid.GridPanel({
						autoHeight: true,
						store: searchstore,// 只展示查找的element element太多，解决element太多，页面渲染异常问题
						columnLines: true,
						columns: customColumns,
						
						tbar: customTbar,
						bbar: Ext.create('App.PagingToolbar', {
							pageSize: 20,
							store: searchstore,// 只展示查找的element element太多，解决element太多，页面渲染异常问题
							displayInfo: true
						})
					});
				

					Ext.QuickTips.init();
					var viewport = new Ext.Viewport({
						layout: 'fit',
						items: [grid]
					});
//					console.log("reload:" + fieldsValue)

				}
			});
//			console.log("in onready:" + fieldsValue);
		}
	}
}();


Ext.onReady(Ext.elementViewGrid.init,Ext.elementViewGrid);

