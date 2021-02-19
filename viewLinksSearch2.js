Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath('Ext.ux.PageSize', '../resources/extjs4/PageSize.js');

Ext.require(['*', 'Ext.ux.PageSize']);

var searchCondition = '';
var advancedSearchFormPanel;
var searchResult = [];
var selectedElements = [];
var selectedSearchResult = [];
var idsForSearch = [];
var objectTypeForSearch;

// add
var typeKeys = [];
var exportData = [];
var objType = '';
var allCTONumbers = [];
var allCTONumAndDesc = [];
var customColumns = [ {text : 'Element ID',flex : 1,id : 'eleId',dataIndex : 'eleId',name : 'eleId'},
	 {text : 'Element Description',flex : 1,id : 'eleName',dataIndex : 'eleName',name : 'eleName'},
	 {text : 'Status', flex : 1,id : 'eleStatus',dataIndex : 'eleStatus',name : 'eleStatus'},
	 {text : 'Type', flex : 1,id : 'eleType',dataIndex : 'eleType',name : 'eleType'}];
var customFields = [ 'eleId', 'eleName', 'eleStatus','eleType'];
var searchResults = [];



Ext.regModel('searchResultWinList', {
    idProperty : 'id',
    fields : ['elementType','elementId', 'elementDesc','elementVersion','elementStatus']
});
var searchResultWinStore = new Ext.data.JsonStore({
	model: 'searchResultWinList',
	pageSize: 500,

	proxy: {
		type: 'ajax',
		url: '../element/elementLink!findElementByCondition.action',
		reader: {
			type: 'json',
			root: 'results',
			totalProperty: 'totalCount'
		}
	}
});


var searchResultWinGridList = new Ext.create('Ext.form.FormPanel',{
    id : 'searchResultWinGridList',
    frame : true,
    border : false,
    bodyPadding : 5,
    width : 650,
    layout : 'anchor',
    fieldDefaults : {
        labelAlign : 'left',
        msgTarget : 'side'
    },
    items : [
    	{
    		xtype : 'gridpanel',
    		id :'searchResultWinGridListGrid',
            store : searchResultWinStore,
            height : 300,
//            title : 'Hierarchy List',
            selModel : Ext.create('Ext.selection.CheckboxModel', {
    			listeners : {
    				selectionchange: function(obj) {
    				}
    			}
            }),

            buttons : [{
        		text : 'Confirm',
        		hidden : false,
        		handler : function() {
        			var selectedColumns = [];
                    var myGrid = Ext.getCmp('searchResultWinGridListGrid');
                    var selections = myGrid.getSelectionModel().getSelection();
                    var parentSearchResults = window.parent.searchResults;
                    console.log("parentSearchResults:=====" + window.parent.searchResults);
                    for(var si = 0; si < selections.length; si ++){
                    	var rec = selections[si].data;
                    	var recId = rec.elementId;
                    	var recDesc = rec.elementDesc;
                    	recDesc = encodeURIComponent(recDesc);
                    	var recStatus = rec.elementStatus;
                    	var recType = rec.elementType
                    	var recVersion = rec.elementVersion
                
                    	var selectedElements = recId + '&-&' + recDesc + '&-&' + recStatus + '&-&' + recType;
                    	                    	
                    	parentSearchResults.push(selectedElements);
                    	

                    }
                    window.parent.searchResults = parentSearchResults;
                	searchResultWinGridList.getForm().reset();
                	searchResultWin.hide();
                	searchResultWinStore.removeAll();
                	
                	window.parent.processAfterGotResult();
                	window.parent.ctoViewLinksSearchPanel.close();
                }
        	},
        	{
        		text : 'Cancel',
        		hidden : false,
        		handler : function doclick() {
        			
        			searchResultWinGridList.getForm().reset();
                	searchResultWin.hide();
                	searchResultWinStore.removeAll();
                	
        			window.parent.ctoViewLinksSearchPanel.close();
                }
        	} ],
//            bbar : paginationBottomBar,
            columns : [{
                id : 'elementType',
                text : 'Type',
                hidden : false,
                flex : .2,
                sortable : true,
                dataIndex : 'elementType',
                filter: {type: 'string'}
            }, {
                id : 'elementId',
                text : 'Element ID',
                hideable : false,
                flex : .2,
                sortable : true,
                dataIndex : 'elementId',
                filter: {type: 'string'}
            }, {
                id : 'elementDesc',
                text : 'Element Desc',
                hideable : false,
                flex : .2,
                sortable : true,
                dataIndex : 'elementDesc',
                filter: {type: 'string'}
            }, {
                id : 'elementVersion',
                text : 'Version',
                hideable : false,
                flex : .2,
                sortable : true,
                dataIndex : 'elementVersion',
                filter: {type: 'string'}
            }, {
                id : 'elementStatus',
                text : 'Status',
                hideable : false,
                flex : .2,
                sortable : true,
                dataIndex : 'elementStatus',
                filter: {type: 'string'}
            }]

    }

    
    ]
});


var searchResultWinFun = function() {

	searchResultWinStore.totalCount = 0;
	searchResultWinStore.currentPage = 1;
	searchResultWinStore.load({
        params : {start : 0},
        callback: function(records, operation, success) {
        	if (!success) {
        		alert("Results larger than 200!");
        	}
        }
    });
}

searchResultWinStore.on('beforeload', function() {
    var ettc = searchResultWinStore.totalCount;
    if (ettc == undefined) {
        ettc = 0;
    }
    var et = '../element/elementLink!findElementsByCondition.action?searchConditiontmp='
        + searchCondition.searchStr
        + '&totalCount=' + ettc;
    searchResultWinStore.proxy.url = et;
});


var searchResultWin = new Ext.Window({
	
    title : 'Search Result',
    width : 650,
    constrain : true,
    resizable : true,
    height : 550,
    closeAction : 'hide',
    modal : true,
    items : searchResultWinGridList,
    listeners : {
        close : function(p) {
            p.hide();
			searchResultWinGridList.getForm().reset();
//        	searchResultWin.hide();
        	searchResultWinStore.removeAll();
        }
    }
});



function searchResultWinButton() {
	searchResultWinStore.load({
		params : {
			searchCondition : searchCondition.searchStr,
			ids: idsForSearch,
			objectType : objectTypeForSearch
		},
        callback: function(records, operation, success) {
        	if (success) {
        		if(records[0].raw.msg){
        			Ext.Msg.alert('System Info',records[0].raw.msg);
        		}
        		
        	}
        }
	});
	searchResultWin.show();

}


Ext.onReady(function() {
	console.log("search page");
	console.log("search abc");

	Ext.tip.QuickTipManager.init();
	var win, savewin;
	
//	var url = location.search;
//	console.log('url::' + url);
//	url = url.replace('?','');
//	var rule = url.split("&");
//	var allCTONumbers = rule[0];
//	
//	var objType = rule[1];
//	
//	var urlIds = rule[2];
	
	var ids = window.parent.idList;
//	if(urlIds.indexOf(',') > -1){
//		ids = urlIds.split(',');
//	}else{
//		ids.push(urlIds);
//	}
	
	idsForSearch = ids;
	objectTypeForSearch =window.parent.objType;
	
//	var ids = window.parent.selectedIds;
//	console.log("ids:====" + ids);
	
	var ctoNums = window.parent.allCTONumbers;
//	if(allCTONumbers.indexOf(',') > -1){
//		ctoNums = allCTONumbers.split(',');
//	}else{
//		ctoNums.push(allCTONumbers);
//	}

	
/**-----------------basic search start-----------------**/
	
	var basicSearchForm = Ext.widget('form', {
		id : 'basicSearchForm',
		autoScroll : true,
		frame : false,
		border:false,
		items : [{
			xtype : 'fieldset',
			collapsible : true,
			title : 'Basic Search',
			id : 'basicSearchFormType',
			collapsed : false,
			layout : 'anchor',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				anchor : '85%',
				defaultType : 'textfield',
				defaults : {
					padding : '0 0 10 0'
				},
				items : [{
					fieldLabel : 'Element Name',
					labelWidth : 185,
					flex : 4.74,
					id : "elementNames"
				}
				]
			},{
				xtype : 'container',
				layout : 'hbox',
				anchor : '85%',
				defaultType : 'textfield',
				items : [
					Ext.create('Ext.form.field.File', {
						buttonConfig : {
							width : 100
						},
						flex : 7,
						fieldLabel : 'Select File',
						labelWidth : 185,
						buttonText : 'Browse',
						buttonAlign : '10',
						id : 'LinksSearchUploadFile',
						name : 'LinksSearchUploadFile',
						hideLabel : false
					}), {
						xtype : 'container',
						width : 3
					}, Ext.create('Ext.button.Button', {
						text : 'Template',
						width : 100,
	                    handler: function() {
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
								method : 'post',
								url : '../element/elementinstance!downloadViewLinksSearchTemplate.action',
								success : function(fp, o) {
									Ext.Msg.alert('success','download success');
								},
								failure : function(form, action) {
									Ext.Msg.alert('failed','download failed');
								}
							});
	                    }

					}), {
						xtype : 'container',
						width : 3
					},
					Ext.create('Ext.button.Button', {
						text : 'Upload',
						width : 100,
						handler : function() {
							if (Ext.getCmp('LinksSearchUploadFile').getValue() == "" || Ext.getCmp('LinksSearchUploadFile').getValue() == null) {
								Ext.Msg.alert('System Info', 'Please select the file you want to import!');
							} else {
								
//								Ext.Ajax.request({
//									url : '../element/elementinstance!importSearchElementNumbers.action',
//									isUpload : true,
//									form : "upload",
//									
//									success : function(response) {
//										var jsonObj = Ext.JSON.decode(response.responseText);
//										if (0 == jsonObj.result)
//											alert("上传成功");
//										else
//											alert("上传失败");
//									}
//								});
								
								Ext.getCmp('basicSearchForm').getForm().submit({
									enctype : 'multipart/form-data',
									method : 'get',
									clientValidation : false,
									url : '../element/elementinstance!uploadSearchFile.action',//importSearchElementNumbers
									params:{"fileName":Ext.getCmp('LinksSearchUploadFile').getValue()},
									waitMsg : 'Parsing...',
									success : function(form, action) {
										var result = action.result;
										var fileCondition = result.pns;
										console.log("getting response:::" + fileCondition);
										Ext.getCmp('elementNames').setValue(fileCondition);

										Ext.Msg.alert('Success', '"Uploaded Success!"');
									}
								});
								
							}
						}
					})
				]}
			]
		}]
	});

/**-----------------basic search end-----------------**/
	
	
	
	
/**-----------------Advance search start-----------------**/

	/**define the Element type drop down list START**/
	Ext.regModel('elementTypes', {
		idProperty : 'elementTypes',
		fields : [ 'name', 'value' ]
	});
	var eleTypeStoreDataJsonInfo = new Ext.data.JsonStore({
		autoLoad : true,
		model : 'elementTypes',
		remoteSort : true,
		remoteFilter : true,
		proxy : {
			type : 'ajax',
			actionMethods: {
                read: 'POST' 
            },
			url : '../element/elementinstance!initEleTypeStoreNew.action',
			reader : {
				type : 'json',
				root : 'results'
			},
			simpleSortMode : true
		},
		sorters : [ {
			property : 'id',
			direction : 'ASC'
		} ]
	});
	/**define the Element type drop down list END**/
	
	var moreForm = Ext.widget('form', {
		title : '',
		id : 'moreForm',
		autoScroll : true,
		frame : false,
		border:false,
		items : [{
			items : [{		
			}]
		}]
	});
	
	var mainMenu = Ext.create('Ext.menu.Menu', {
	    id: 'mainMenu',
	    border:false,
	    style: {
	        overflow: 'visible'
	    },
        listeners : {
				beforeshow : function(object, eOpts){//重点,当调用 show 方法组件显示前触发  
					moreMenuHandler();
				}  
        },
	    items: [{
			text: 'Element ID',
			id : 'menu_elementId',
			handler  : function(item, eOpts){
				addTextfieldHandler("elementId",item.text);
			}
		},{
			text: 'Element DESC',
			id : 'menu_elementDesc',
			handler  : function(item, eOpts){
				addTextfieldHandler("elementDesc",item.text);
			}
		},{
			text: 'Version',
			id : 'menu_version',
			handler  : function(item, eOpts){
				addTextfieldHandler("version",item.text);
			}
		},{
			text: 'Status',
			id : 'menu_status',
			handler  : function(item, eOpts){
				addTextfieldHandler("status",item.text);
			}
		},
		'-',{
            text: 'More',
            id : 'moreId',
            menu: {}
		}]
	});
	
	var menuPanel = Ext.create('Ext.panel.Panel', {
		tbar: [{text:"Add",menu: mainMenu}],
		width: 50,
		border:false
	});
	

	
	var advanceSearchForm = Ext.widget('form', {
		
		id : 'advanceSearchForm',
		autoScroll : true,
		frame : false,
		border:false,
		items : [
			{
				xtype : 'fieldset',
				collapsible : true,
				title : 'Advance Search',
				id : 'advanceSearchFormType',
				collapsed : false,
				border : false,
				layout : 'anchor',
				items : [
				    {items: [{
						xtype : 'container',
						layout : 'hbox',
						anchor : '20%',
						defaultType : 'textfield',
						border : false,
						items : [{
								xtype : 'combo',
								fieldLabel : 'Element Type',
								id : 'elementTypeSearchId',
								displayField : 'name',
								editable : false,
								valueField : 'value',
								queryMode : 'local',
								name : 'elementtype',
								store : eleTypeStoreDataJsonInfo,
								listeners : {
									'focus' : function(object, eOpts){ 
										eleTypeStoreDataJsonInfo.load({ 
											params: 
											{ 
												ids: idsForSearch,
												objectType : objectTypeForSearch
											} 
										});
									}
								} 
									 

							}, {
									xtype : 'box',
									flex : 1,
									html : "<img style='cursor: pointer;margin-top:5px;margin-left:5px;' title='In Advance Search, please specify the value of Element Desc.' src='../resources/images/info.png' />"
								}]
					}]},
					menuPanel,moreForm
				]

			}
		],
		buttons : [{
			text : 'Search',
			id : 'SearchButton',
			handler : function() {
				search();
			}
		}, {
			text : 'Reset',
			id : 'ResetButton',
			handler : function() {
				Ext.getCmp('allSearchForm').getForm().reset();
				removeAllItems();
			}
		},{
			text : 'DownloadElementLinks',
			id : 'DownloadElementLinksButton',
			handler : function() {
				var ids = window.parent.selectedIds;
				console.log('ids size:' + ids.length);
				console.log('ids size1234:' + ids);
				console.log("downloading.....");
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
				
				
				
				
				
				/*downloadForm.getForm().submit({
					params : {
						idList : ids,
						typeKeys : typeKeys,
						objType : ''
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
				});*/
				
				console.log("typeKeys:=====" + typeKeys);
				console.log("exportData:=====" + exportData);
				downloadForm.getForm().submit({
					params : {
						idList : ids,
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
		}]
	});
	
	
	//search result grid begin
	
	var allSearchForm = Ext.widget('form', {
		id : 'allSearchForm',
		autoScroll : true,
		frame : false,
		defaultType : 'textfield',
		border:false,
		listeners : {
			afterRender : function(thisForm, options) {
				this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
					enter : function() {
						Ext.getCmp('SearchButton').handler.call();
					},
					scope : this
				});
			}
		},
		items : [basicSearchForm,advanceSearchForm],//,searchResultGridNew
		listeners : {
			'beforeshow' : function() {
			}
		}
	});
	
	allSearchFormPanel = Ext.create('Ext.panel.Panel', {
		id : 'allSearchFormPanel',
		region : 'center',
		xtype : 'form',
		bodyPadding : 10,
		height : (document.documentElement.clientHeight - 90) || (document.body.clientHeight - 90),
		layout : 'anchor',
		defaults : {
			labelAlign : 'right'
		},
		border:false,
		autoScroll : true,
		fieldDefaults : {
			labelWidth : 110,
			labelStyle : 'color:green;padding-left:4px'
		},
		items : [allSearchForm]
	});

	var _oldKey="-1";
	function moreMenuHandler(){
		
		if(Ext.getCmp('elementTypeSearchId') == undefined){
			return;
		}
		
		if(Ext.getCmp('elementTypeSearchId').displayTplData == undefined){
			return;
		}
		
		var objectType = Ext.getCmp('elementTypeSearchId').displayTplData[0].value;
		
		if(objectType == _oldKey){
			return;
		}
		
		if (Ext.getCmp('elementTypeSearchId').getValue() == "") {
			Ext.Msg.alert('error', 'please input element type!');
			return false;
		}


		Ext.Ajax.request({
			url : '../element/elementinstance!findAttributeByType.action',
			params : {
				'eleTypeId' : Ext.getCmp('elementTypeSearchId').displayTplData[0].value,
				'eleTypeName' : Ext.getCmp('elementTypeSearchId').displayTplData[0].name
			},success : function(response, option) {
				var res = Ext.JSON.decode(response.responseText);
				var menu =Ext.create('Ext.menu.Menu',{});
                menu.removeAll();
				for(var i=0;i<res.length;i++){
					var internalName = res[i].internalName;
					var displayName = res[i].displayName;
				    menu.add({
		               id: internalName,
		               text:displayName,
		               listeners : {
		               		"click":function(item, e, eOpts){
		               			var id = item.id;
		               			if(id.indexOf('.')>=0){
		               				id= id.substring(0,id.length-1);
		               			}
		               			if(id.indexOf('Date')>=0){
		               				addTimeTypeHandler(id,item.text);
								}else{
			               			addTextfieldHandler(id,item.text);
								}
		               		}
		               }
				    });
				}
				Ext.getCmp("moreId").menu.removeAll();
				Ext.getCmp("moreId").menu = menu;
				Ext.getCmp("moreId").menu.doLayout();
			}

		});
		_oldKey = objectType;
	}
	
	var equalStore = Ext.create('Ext.data.Store', {
	    fields: ['display', 'value'],
	    data : [{
				"display" : " = ",
				"value" : "es_equals"
			}]
	});
	
	function addTextfieldHandler(id, attrName ){
		if(Ext.getCmp('id_' + id)){
			return;
		}
		
		var equalsSelection = Ext.create('Ext.form.field.ComboBox', {
			multiSelect : false,
			editable : false,
			hidden : false,
			id : 'id_' + id,
			fieldLabel : attrName,
			labelWidth : 185,
			width: 270,
			store : equalStore,
		    displayField: 'display',
		    valueField: 'value',
		    value: 'No filter',
			queryMode : 'local',
			listeners : {
				afterRender: function(combo) {
					combo.setValue('es_equals');
					Ext.getCmp('value_' + id).show();
				}
			}
		});
			
		var items = new Array();
		var item = [
		{
			fieldLabel : attrName,
			text: attrName,
			width:600,
			labelWidth : 200,
			id : 'id_' + id
		},
		{	id:'value_' + id,
			labelWidth : 200,
			width:600,
			hidden:true
			//fieldLabel : attrName
		},{
			xtype:"button",
			id : id+'icon',
			hidden : true,
			icon : "../resources/images/icons/delete.png",
			style: {
				background : '#ffffff'
			},
			listeners : {
				"click":function(item, e, eOpts){
					removeItem(id);
				}
			}
		}];
            
        var tt = {
			id:'container_'+id,
			xtype : 'container',
			layout : 'hbox',
			anchor : '80%',
			layout: {
                type: 'hbox',
                padding:'5',
                align:'middle'
            },
			//width : 650,
			defaultType : 'textfield',
			listeners : {
				render : function(p) {
					p.getEl().on('mouseover', function(p){
						Ext.getCmp(id+'icon').show();
					});
					p.getEl().on('mouseout', function(p){
						Ext.getCmp(id+'icon').hide();
					});
				}
			},
			items : item
		}
		moreForm.add(tt);
		layoutCriteriaForm();
	}
	
	
/**-----------------Advance search END-----------------**/	
	


	function layoutCriteriaForm(){
		moreForm.doLayout();
		allSearchForm.doLayout();
		allSearchFormPanel.doLayout();
	}

	function removeAllItems(){
		var items = moreForm.items;
		var removeArr = [];
		if(items.length > 1){
			for(var i=1;i<items.length;i++){
				var item = items.items[i];
					removeArr.push(item);
			}
			for(var i=0; i<removeArr.length; i++){
				moreForm.remove(removeArr[i]);
			}
			layoutCriteriaForm();
		}
	}

	
	function removeItem(objectType){
		var items = moreForm.items;
		var removeArr = [];//需要删除的组件集合
		if(items.length > 1){
			//增加单个item的删除，如果是公共的查询条件则不删除
			for(var i=1;i<items.length;i++){
				var item = items.items[i];
				if(!(item.id.indexOf(objectType) ==-1)){
					moreForm.remove(item);
					break;
				}
			}
			layoutCriteriaForm();
		}
	}
	

	
	var gridTitle;
	function getQueryCondition(){
		var _titleJson=''
		var searchStr='';
		
		var elementNameValues = Ext.getCmp('elementNames').getValue();
		if(elementNameValues != null && elementNameValues != ""){
			//basic search
			var nameArr = elementNameValues.split("&-&");
			elementNameValues = new Array();
			for(var i = 0;i<nameArr.length;i++){
				elementNameValues.push(nameArr[i].trim());
			}
			elementNameValues = elementNameValues.join('&-&');
			searchStr+="elementName:"+elementNameValues;
		}else{
			if(Ext.getCmp('elementTypeSearchId') != undefined){
				if(Ext.getCmp('elementTypeSearchId').displayTplData != undefined){
					var elementTypeName = Ext.getCmp('elementTypeSearchId').displayTplData[0].value;
					if(elementTypeName != undefined && '' != elementTypeName){
						searchStr+="elementTypeID:"+elementTypeName;
						//id_xxx,es_equal
						//value_xxxx,es_equal
						var fields = Ext.getCmp("moreForm").getForm().getFields();
						var items = fields.items;
						var attachColumn = new Array();
						var allResultsMap = new Map();
						for (var i = 0; i < items.length; i++) {
							var id = items[i].id;
							id = id.replace('id_','');
							id = id.replace('value_','');
							var value = items[i].getValue();
							if(value != undefined){
								if('' != value && 'es_equals' != value){
									allResultsMap.set(id,value);
								}
							}

						}

							
							if(allResultsMap.size > 0){
								for (var [key, value] of allResultsMap) {
									searchStr += '&-&' + key + '&:&' + value;

								}
							}
						
					}
				}
			}
			
		}
	
		if(searchStr == ''){
			Ext.Msg.alert('System Info', 'Please specify search criteria or enter a valid keyword!');
			return false;
		}
		
		if(searchStr.indexOf('elementTypeID') > -1){
			if(searchStr.indexOf('elementDesc') == -1){
				Ext.Msg.alert('System Info', 'In Advance Search, please specify the value of Element Desc.');
				return false;
			}
		}
		searchStr = encodeURIComponent(searchStr);
		var params = {
			searchStr : searchStr
		};
		
		return params;
	}
	
//	Ext.regModel('HierarchyList', {
//	    idProperty : 'id',
//	    fields : ['elementType','elementId', 'elementDesc']
//	});
//	
    var searchStore = new Ext.data.JsonStore({
        model : 'searchStore',
        pageSize : 20,
        remoteSort : true,
        remoteFilter : true,
        proxy : {
            type : 'ajax',
            url : '../optsrv/ocmUI!phCodesStrContentNewVersion.action',
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'totalCount'
            },
            simpleSortMode : true
        },
        sorters : [{
            property : 'hierarchyCode',
            direction : 'ASC'
        }]
    });
	
	function search(){
		var url = "";
		var isSuccess;
		var condition = getQueryCondition();
		if(!condition){
			return;
		}
		searchCondition = condition;
		var parentSearchCriteria = window.parent.searchCriteria;
		console.log('parent query condition:' + parentSearchCriteria);
		parentSearchCriteria = [];
		parentSearchCriteria.push(condition.searchStr);
		handler :searchResultWinButton();
	}
	Ext.QuickTips.init();
	var viewport = new Ext.Viewport({
		layout: 'fit',
		items: [allSearchFormPanel]
	});
	
	var ids = window.parent.selectedIds;
	console.log('object size:' + ids.length);
	var idList = ids;
	/*var needToAddId = true;
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
	}*/
	
//	objType = type;
	objType = 'sbb';
	type = 'sbb';

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
				customColumns.push({text : newSingleObjectNumber+'['+newSingleObjectName+']',flex : 1,id : newSingleObjectNumber,dataIndex : newSingleObjectNumber,name : newSingleObjectNumber});
				customFields.push(newSingleObjectNumber);
			}
			
			console.log("customColumns:" + customColumns);
			console.log("customFields:" + customFields);
			console.log("allCTONumbers:" + allCTONumbers);
			console.log("allCTONumAndDesc:" + allCTONumAndDesc);
			

			var store;
			var grid;

			Ext.regModel('elelinkui',
					{
						fields: customFields
					});
			store = new Ext.data.JsonStore({
				model: 'elelinkui',
				pageSize: 100,

				proxy: {
					type: 'ajax',
					url: '../element/elementLink!findElementsByObjectIdsNew.action',
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
			
			
			console.log("store:===" + store);
//			console.log(JSON.stringify(store))
//			var description = ""; 
//			 for(var i in store){ 
//			 var property=store[i]; 
//			 description+=i+" = "+property+"\n"; 
//			 } 
//			 console.log("ccc" + description);

			
			
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
					});
				}
				});
			
			console.log("typeKeys ready:=====" + typeKeys);
			console.log("exportData ready:=====" + exportData);
			
			grid = new Ext.grid.GridPanel({
				autoHeight: true,
				store: store,
				columnLines: true,
				columns: customColumns,
				
				/*tbar: customTbar,*/
				bbar: Ext.create('App.PagingToolbar', {
					pageSize: 20,
					store: store,
					displayInfo: true
				})
			});
		

			Ext.QuickTips.init();
			/*var viewport = new Ext.Viewport({
				layout: 'fit',
				items: [grid]
			});*/
			/*console.log("reload:" + fieldsValue)*/

		}
	});
	
	
	
	
	
});
