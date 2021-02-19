Ext.Loader.setConfig({
			enabled : true
		});
Ext.Loader.setPath('Ext.element.js', '../element/js');
Ext.Loader.setPath('Ext.optsrv.js.attribute', '../optsrv/js/attribute');
Ext.Loader.setPath('Ext.common.manage', '../common');
Ext.require([
	'Ext.common.manage.CommonViewTranslation',
	'Ext.common.manage.CommonEditTranslation',
        'Ext.sbb.manage.edit_sbbattr',
        'Ext.element.js.elementsList',
		'Ext.optsrv.js.attribute.edit']);

Ext.define('Ext.sbb.manage.model', {
			extend : 'Ext.data.Model',
			fields : ['id', 'number', 'name', 'baseName', 'locationCode',
					'status', 'unspscCode', 'sbbVersion', 'mktDescription',
					'countryRelevance', 'weight', 'weightUnit', 'updatedTime',
					'updatedUserName', 'createdTime', 'createdUserName',
					'checkOutUserName']
		});
var selectedIds = '';
Ext.define('Ext.sbb.manage.SBBManagement', {

	extend : 'Ext.container.Container',
	// extend: 'Ext.panel.Panel',

	alias : 'widget.SBB-management',

	search : '0',

	fileCondition : '',

	projectName : '',

	ctoNumber : '',

	mktDescription : '',

	status : '',

	baseName : '',

	realFileName : '',

	sbbNumber : '',
	
	sbbName : '',

	sbbId : '-1',// sbbId => this.sbbId

	s_id : '',// s_id => this.s_id

	elementsStr : '',

	elementTypesStr : '',

	objectsStr : '',

	objectType : '',

	queryParams : {},

	initComponent : function() {

		var me = this;

		this.createStore();
		this.createUpdateLinksStore();
		this.createElementStore();
		this.createSbbElementStore();
		Ext.override(Ext.grid.GridPanel, {
			getExcelXml : function(includeHidden) {
				var worksheet = this.createWorksheet(includeHidden);
				// var totalWidth =
				// Ext.grid.column.Column.prototype.getFullWidth(includeHidden);
				return '<xml version="1.0" encoding="utf-8">'
						+ '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">'
						+ '<o:DocumentProperties><o:Title>'
						+ 'sbb lois data'
						+ '</o:Title></o:DocumentProperties>'
						+ '<ss:ExcelWorkbook>'
						+ '<ss:WindowHeight>'
						+ worksheet.height
						+ '</ss:WindowHeight>'
						+ '<ss:WindowWidth>'
						+ worksheet.width
						+ '</ss:WindowWidth>'
						+ '<ss:ProtectStructure>True</ss:ProtectStructure>'
						+ '<ss:ProtectWindows>True</ss:ProtectWindows>'
						+ '</ss:ExcelWorkbook>'
						+ '<ss:Styles>'
						+ '<ss:Style ss:ID="Default">'
						+ '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />'
						+ '<ss:Font ss:FontName="arial" ss:Size="10" />'
						+ '<ss:Borders>'
						+ '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />'
						+ '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />'
						+ '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />'
						+ '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />'
						+ '</ss:Borders>'
						+ '<ss:Interior />'
						+ '<ss:NumberFormat />'
						+ '<ss:Protection />'
						+ '</ss:Style>'
						+ '<ss:Style ss:ID="title">'
						+ '<ss:Borders />'
						+ '<ss:Font />'
						+ '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />'
						+ '<ss:NumberFormat ss:Format="@" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:ID="headercell">'
						+ '<ss:Font ss:Bold="1" ss:Size="10" />'
						+ '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />'
						+ '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:ID="even">'
						+ '<ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:Parent="even" ss:ID="evendate">'
						+ '<ss:NumberFormat ss:Format="mm/dd/yyyy" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:Parent="even" ss:ID="evenint">'
						+ '<ss:NumberFormat ss:Format="0" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:Parent="even" ss:ID="evenfloat">'
						+ '<ss:NumberFormat ss:Format="0.00" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:ID="odd">'
						+ '<ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:Parent="odd" ss:ID="odddate">'
						+ '<ss:NumberFormat ss:Format="mm/dd/yyyy" />'
						+ '</ss:Style>'
						+ '<ss:Style ss:Parent="odd" ss:ID="oddint">'
						+ '<ss:NumberFormat ss:Format="0" />' + '</ss:Style>'
						+ '<ss:Style ss:Parent="odd" ss:ID="oddfloat">'
						+ '<ss:NumberFormat ss:Format="0.00" />'
						+ '</ss:Style>' + '</ss:Styles>' + worksheet.xml
						+ '</ss:Workbook>';
			},

			createWorksheet : function(includeHidden) {
				// debugger;
				// Calculate cell data types and extra class names which affect
				// formatting
				var cellType = [];
				var cellTypeClass = [];
				// var cm = Ext.grid.column.Column.prototype;
				var totalWidthInPixels = 0;
				var colXml = '';
				var headerXml = '';
				var visibleColumnCountReduction = 0;
				// var colCount = cm.getColumnCount();
				for (var i = 1; i < me.grid.columns.length; i++) {
					if ((me.grid.columns[i].text != '')
							&& (includeHidden || !me.grid.columns[i].isHidden())) {
						var w = me.grid.columns[i].getWidth()
						totalWidthInPixels += w;
						if (me.grid.columns[i].text == '') {
							cellType.push("None");
							cellTypeClass.push("");
							++visibleColumnCountReduction;
						} else {
							colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="'
									+ w + '" />';
							headerXml += '<ss:Cell ss:StyleID="headercell">'
									+ '<ss:Data ss:Type="String">'
									+ me.grid.columns[i].text
									+ '</ss:Data>'
									+ '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
							cellType.push("String");
							cellTypeClass.push("");

						}
					}
				}
				var visibleColumnCount = cellType.length
						- visibleColumnCountReduction;

				var result = {
					height : 9000,
					width : Math.floor(totalWidthInPixels * 30) + 50
				};

				// Generate worksheet header details.
				var t = '<ss:Worksheet ss:Name="'
						+ 'sbb data'
						+ '">'
						+ '<ss:Names>'
						+ '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\''
						+ 'sbb data'
						+ '\'!R1:R2" />'
						+ '</ss:Names>'
						+ '<ss:Table x:FullRows="1" x:FullColumns="1"'
						+ ' ss:ExpandedColumnCount="'
						+ (visibleColumnCount + 2)
						+ '" ss:ExpandedRowCount="'
						+ (me.store.getCount() + 2)
						+ '">'
						+ colXml
						+ '<ss:Row ss:Height="38">'
						+ '<ss:Cell ss:StyleID="title" ss:MergeAcross="'
						+ (visibleColumnCount - 1)
						+ '">'
						+ '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">'
						+ '<html:B >Generated by Lenovo Lois System</html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />'
						+ '</ss:Cell>' + '</ss:Row>'
						+ '<ss:Row ss:AutoFitHeight="1">' + headerXml
						+ '</ss:Row>';

				// Generate the data rows from the data in the Store
				for (var i = 0, it = me.store.data.items, l = it.length; i < l; i++) {
					t += '<ss:Row>';
					var cellClass = (i & 1) ? 'odd' : 'even';
					r = it[i].data;
					var k = 0;
					for (var j = 1; j < me.grid.columns.length; j++) {
						if ((me.grid.columns[j].text != '')
								&& (includeHidden || !me.grid.columns[j]
										.isHidden())) {
							var v = r[me.grid.columns[j].dataIndex];
							if (cellType[k] !== "None") {
								t += '<ss:Cell ss:StyleID="' + cellClass
										+ cellTypeClass[k]
										+ '"><ss:Data ss:Type="' + cellType[k]
										+ '">';
								if (v != null) {
									t += v;
								} else if (v == null) {
									t += '';
								}
								t += '</ss:Data></ss:Cell>';
							}
							k++;
						}
					}
					t += '</ss:Row>';
				}

				result.xml = t
						+ '</ss:Table>'
						+ '<x:WorksheetOptions>'
						+ '<x:PageSetup>'
						+ '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />'
						+ '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />'
						+ '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />'
						+ '</x:PageSetup>' + '<x:FitToPage />' + '<x:Print>'
						+ '<x:PrintErrors>Blank</x:PrintErrors>'
						+ '<x:FitWidth>1</x:FitWidth>'
						+ '<x:FitHeight>32767</x:FitHeight>'
						+ '<x:ValidPrinterInfo />'
						+ '<x:VerticalResolution>600</x:VerticalResolution>'
						+ '</x:Print>' + '<x:Selected />'
						+ '<x:DoNotDisplayGridlines />'
						+ '<x:ProtectObjects>True</x:ProtectObjects>'
						+ '<x:ProtectScenarios>True</x:ProtectScenarios>'
						+ '</x:WorksheetOptions>' + '</ss:Worksheet>';
				// debugger;
				return result;
			}
		});
		// context menu
		var contextMenu = Ext.create('Ext.menu.Menu', {
					items : [{
								text : 'Copy',
								iconCls : 'icon-copy',
								width : 90,
								handler : function() {
									/*
									 * //debugger
									 * if(me.grid.getSelectionModel().hasSelection()){
									 * var records =
									 * me.grid.getSelectionModel().getSelection();
									 * //pass id that is current selected ,then
									 * I can pass this id to a action and form
									 * 
									 * var ids = []; Ext.Array.each(records,
									 * function(record,i,all) {
									 * ids.push(record.get('id')); });
									 * 
									 * var grid2 =
									 * Ext.createWidget('WC-elementsList',{height:
									 * 300,width:500,isShowTbar :
									 * true,s_id:ids[0], objectType:'WC'});
									 * grid2.ids = ids;
									 * grid2.store.getProxy().extraParams.ids =
									 * ids; grid2.store.load(); var win =
									 * Ext.createWidget('WC-commonWindow',{item:grid2,title:'MTM
									 * Save As'}); win.show(); }//end if
									 */
								}
							}]
				});

		var paginationBottomBar = Ext.create('App.PagingToolbar', {
					store : this.store,
					displayInfo : true
				});

		var elementPaginationBar = Ext.create('App.PagingToolbar', {
					store : me.elementStore,
					displayInfo : true
				});

		this.grid = new Ext.grid.GridPanel({
			// autoHeight: true,
			store : this.store,
			autoScroll : true,
			selModel : Ext.create('Ext.selection.CheckboxModel', {
				listeners : {
					selectionchange : function(obj, selecteds) {
						Ext.LOIS.setEnableByTypeAndStatus(Ext.LOIS.TYPE.SBB,
								selecteds);
					},
					select : function(obj, record, index) {
						if (obj.getSelection().length == obj.store.data.length) {
							Ext.LOIS.setEnableByTypeAndStatus(
									Ext.LOIS.TYPE.SBB, obj.getSelection());
						}
					}
				}
			}),
			tbar : me.createToolbar(),
			bbar : paginationBottomBar,
			columns : [/* new Ext.grid.RowNumberer(), */{
						dataIndex : "id",
						hidden : true
					}, {
						text : 'Check Out By',
						// flex : 1,
						dataIndex : 'checkOutUserName',
						align : "left",
						width :156,
						sortable : false,
						renderer : function(v) {
							if (v != '' && v != 'undefined' && v != undefined) {
								return "<font color='red'>" + v + "</font>";
							}
						}
					}, {
						text : 'SBB Number',
						// flex: 1,
						dataIndex : 'number',
						name : 'number',
						width :124,
						align : "left"
					}, {
						text : 'SBB Name',
						// flex: 1,
						dataIndex : 'name',
						width :156,
						name : 'name',
						align : "left"
					}, {
						text : 'Basic Name',
						// flex: 1,
						dataIndex : 'baseName',
						name : 'baseName',
						width :100,
						align : "left"
					}, {
						text : 'Status',
						// flex: 1,
						dataIndex : 'status',
						width :100,
						name : 'status',
						align : "left"
					}, {
						text : 'Version',
						// flex: 1,
						dataIndex : 'sbbVersion',
						name : 'sbbVersion',
						width :100,
						sortable : true,
						align : "left"
					}, {
						text : 'Unspsc Code',
						// flex: 1,
						width :100,
						dataIndex : 'unspscCode',
						name : 'unspscCode',
						align : "left"
					},  {
						text : 'Marketing Description',
						// flex: 1,
						dataIndex : 'mktDescription',
						name : 'mktDescription',
						width :228,
						align : "left"
					}, {
						text : 'Weight',
						// flex: 1,
						dataIndex : 'weight',
						name : 'weight',
						width :100,
						align : "left",
						renderer : function(v) {
							if (v == 0)
								v = "";
							return v;
						}
					}, {
						text : 'Weight Unit',
						// flex: 1,
						dataIndex : 'weightUnit',
						name : 'weightUnit',
						width :100,
						align : "left"
					},{
						text : 'Country Relevance',
						// flex: 1,
						dataIndex : 'countryRelevance',
						name : 'countryRelevance',
						width :124,
						align : "left"
					}, {
						text : 'Location Code',
						// flex: 1,
						dataIndex : 'locationCode',
						width :100,
						name : 'locationCode',
						align : "left"}, {
							text : 'Last Modify',
							// flex: 1,
							dataIndex : 'updatedTime',
							width :88,
							name : 'updatedTime',
							align : "left",
							renderer : Ext.util.Format.dateRenderer('m/d/Y')
						}, {
							text : 'Last Modify By',
							// flex: 1,
							dataIndex : 'updatedUserName',
							width :156,
							name : 'updatedBy',
							sortable : false,
							align : "left"
						},{
						text : 'Create On',
						// flex: 1,
						dataIndex : 'createdTime',
						width :100,
						name : 'createdTime',
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					}, {
						text : 'Created By',
						// flex: 1,
						dataIndex : 'createdUserName',
						width :100,
						name : 'createdUserName',
						sortable : false,
						align : "left"
					}]
		});

		this.elementsList = Ext.createWidget('elementsList', {
					isShowTbar : false,
					objectType : 'SBB',
					qtyHidden : true
				});

		// init and apply all object
		Ext.apply(this, {
					layout : {
						type : 'vbox',
						align : 'stretch',
						pack : 'start'
					},

					items : [{
						// title: 'MTM Grid',
						// xtype: 'searchGrid',
						items : [this.grid],
						// split: true,
						layout : 'fit',
						flex : 1,
						border : false,
						animCollapse : false,
						collapsible : true
							// height: 100
						}, {
						// title: 'MTM Grid',
						// xtype: 'searchGrid',
						items : [this.elementsList],
						// split: true,
						layout : 'fit',
						flex : 1,
						border : false,
						animCollapse : false,
						// collapsed : true,
						collapsible : true
							// height: 100
						}]

				});

		this.callParent(arguments);

		this.store.on('beforeload', this.onBeforeloadEvent, this);
		this.updateLinksStore.on('beforeload',
				this.onUpdateLinksBeforeloadEvent, this);
		this.elementStore.on('beforeload', this.onElementBeforeloadEvent, this);

		this.store.on('load', this.onStoreLoadEvent, this);
		this.grid.on('itemdblclick', this.onItemdblclick, this);
	},

	recordIds : [],

	// load form query params
	onBeforeloadEvent : function(store) {
		var me = this;
		// post some params to action
		var store = me.store;
		var search = me.search;
		if (search == '0') {
			me.setRecordIds();

			store.proxy.extraParams.projectName = me.projectName;
			store.proxy.extraParams.ctoNumber = me.ctoNumber;
			store.proxy.extraParams.mktDescription = me.mktDescription;
			store.proxy.extraParams.status = me.status;
			store.proxy.extraParams.sbbNumber = me.sbbNumber;
			store.proxy.extraParams.sbbName = me.sbbName;
			store.proxy.extraParams.baseName = me.baseName;
			store.proxy.extraParams.fileCondition = me.fileCondition;
		} else if (search == '1') {
			me.search = '0';
		}

	},
	onUpdateLinksBeforeloadEvent : function(store) {
		this.updateLinksStore.proxy.extraParams.sbbIds = this.recordIds;
	},

	onElementBeforeloadEvent : function(store) {
		var me = this;
		if (me.grid.getSelectionModel().selected.items.length != 1) {
			// Ext.Msg.alert("error","you should select one record!");
			return false;
		}
		me.elementStore.proxy.extraParams.sbbId = this.sbbId;

	},

	// select records after grid store loaded
	onStoreLoadEvent : function(store, records2, isSuccessful, operation) {
		// debugger
		var me = this;
		var store = me.store;
		var grid = me.grid;
		var recordIds = me.recordIds;

		var records = new Array();
		store.each(function(record) {
					if (Ext.Array.contains(recordIds, record.get('id'))) {
						records.push(record);
					}

				});
		grid.getSelectionModel().select(records, true, false);
	},

	onItemdblclick : function(me, record, item, index, e) {
		var sbbId = this.sbbId;
		var elementStore = this.elementsList.store;
		sbbId = this.grid.getSelectionModel().selected.items[0].get('id');
		this.elementsList.sbbId = sbbId;
		elementStore.on('beforeload', function() {
					var et = '../sbb/sbb!findElementsBySbbId.action';
					elementStore.proxy.url = et;
				});
		elementStore.load({
					params : {
						sbbId : sbbId
					}
				});
		sbbId = this.grid.getSelectionModel().selected.items[0].get('id');
		elementStore.on('beforeload', function() {
					var et = '../sbb/sbb!findElementsBySbbId.action';
					elementStore.proxy.url = et;
				});
		elementStore.load({
					params : {
						sbbId : sbbId
					}
				});
	},

	// 创建一个store
	createStore : function() {

		this.store = new Ext.data.JsonStore({
					model : 'Ext.sbb.manage.model',
					remoteSort : true,
					pageSize : Ext.LOIS.Config.pageSize,
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!findSbbsByCondition.action',
						reader : {
							type : 'json',
							root : 'results',
							totalProperty : 'totalCount'
						},
						simpleSortMode : true
					}
				});

		return this.store;

	},

	createUpdateLinksStore : function() {
		var me = this;

		this.updateLinksStore = new Ext.data.JsonStore({
					model : 'Ext.cto.manage.model',
					remoteSort : true,
					pageSize : 20,
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!findSbbsByCondition.action?sbbIds='
								+ me.recordIds,
						reader : {
							type : 'json',
							root : 'results',
							totalProperty : 'totalCount'
						},
						  actionMethods: {  
          		            create : 'POST',  
          		            read   : 'POST', // by default GET  
          		            update : 'POST',  
          		            destroy: 'POST'  
          		        } ,
						simpleSortMode : true
					}
				});

		return this.updateLinksStore;
	},

	createElementStore : function() {
		var grid = this.grid;
		this.elementStore = new Ext.data.JsonStore({
					fields : ['id', 'name', 'status', 'elementVersion',
							'updatedTime', 'updatedUserName', 'createdTime'],
					pageSize : 20,
					remoteSort : true,
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!findElementsBySbbId.action',
						reader : {
							type : 'json',
							root : 'results',
							totalProperty : 'totalCount'
						}
						// simpleSortMode: true
					}

				});

		return this.elementStore;
	},

	createSbbElementStore : function() {
		this.sbbElementStore = Ext.create('Ext.data.Store', {
					fields : ['id', 'name', 'status', 'elementVersion',
							'updatedTime', 'updatedUserName', 'createdTime'],
					pageSize : Ext.LOIS.Config.pageSize,
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!findElementsBySbb.action',
						reader : {
							type : 'json',
							root : 'results',
							totalProperty : 'totalCount'
						}
					}
				});

		return this.sbbElementStore;
	},

	loadLinksWin : function() {
		var msgStore = new Ext.data.JsonStore({
					fields : [{
								name : 'name'
							}, {
								name : 'number'
							}, {
								name : 'detail'
							}],
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!listAllResults.action',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});

		var grid4 = new Ext.grid.GridPanel({
					height : 200,
					store : msgStore,
					autoScroll : true,
					columns : [/* new Ext.grid.RowNumberer(), */
					{
								text : 'Name',
								flex : 1,
								dataIndex : 'name'
							}, {
								text : 'Number',
								flex : 1,
								dataIndex : 'number'
							}, {
								text : 'Detail',
								flex : 1,
								dataIndex : 'detail'
							}]

				});

		var loadLinksForm = Ext.create('Ext.form.FormPanel', {
			bodyStyle : 'padding:5px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				labelWidth : 220,
				labelAlign : "left",
				items : [{
					columnWidth : 1,
					layout : 'anchor',
					baseCls : 'x-plain',
					border : false,
					defaultType : 'textfield',
					defaults : {
						anchor : '80%'
					},
					items : [{
								xtype : 'radiofield',
								name : 'version',
								id : 'majorVersion',
								inputValue : '1',
								fieldLabel : 'Version Type',
								boxLabel : 'majorVersion'
							}, {
								xtype : 'radiofield',
								name : 'version',
								id : 'minorVersion',
								inputValue : '0',
								fieldLabel : 'Version Type',
								boxLabel : 'minorVersion'
							}, {
								xtype : "hidden",
								name : "fileName"
							}, {
								fieldLabel : "Upload File",
								xtype : 'filefield',
								emptyText : 'Select a file ...',
								name : 'uploadFile',
								buttonText : 'Browser',
								listeners : {
									'change' : function(fb, v) {
										loadLinksForm.getForm()
												.findField("fileName")
												.setValue(v);
									}
								}
							}]
				}]
			}],
			buttons : [{
				text : "upload",
				hidden : false,
				name : "upload",
				id : "upload",
				handler : function() {
					msgStore.removeAll();
					var minorVersion = Ext.getCmp('minorVersion').getValue();
					var majorVersion = Ext.getCmp('majorVersion').getValue();
					if (minorVersion == true) {
						versionType = '0';
					}
					if (majorVersion == true) {
						versionType = '1';
					}
					if (versionType.length == 0) {
						Ext.Msg.alert("empty", "Please select version type.");
						return;
					}

					Ext.getCmp("continue").hide();
					Ext.getCmp("upload").show();
					var file = loadLinksForm.getForm().findField("fileName")
							.getValue();
					if (file == '') {
						Ext.Msg.alert("empty", "file is invalid.");
						return;
					}
					var form = loadLinksForm.getForm();
					form.submit({
						url : '../sbb/sbbUpLinks!validateLinksFromExcel.action',
						params : {
							status : versionType
						},
						waitMsg : 'Validate file...',
						success : function(response, option) {
							var fileName = option.result.fileName;
							var status = option.result.status;
							if (fileName != undefined) {
								Ext.Msg.alert("error", "file is invalid.");
							}
							if (status == 'no') {
								linkId = option.result.linkId;
								Ext.Msg.alert("message", "click continue!");
								Ext.getCmp("continue").show();
								Ext.getCmp("upload").hide();
							}
							if (status == 'yes') {
								var grid = Ext.ComponentQuery
										.query('SBB-management')[0];
								grid.store.load();
								message = option.result.message;
								msgStore.on('beforeload', function() {
									var et = '../sbb/sbb!listAllResult.action?message='
											+ message;
									msgStore.proxy.url = et;
								});
								msgStore.load();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("error", "sorry,load failed!");
						}
					});
				}
			}, {
				text : "continue",
				hidden : true,
				name : "continue",
				id : "continue",
				handler : function() {
					Ext.getCmp("continue").hide();
					Ext.getCmp("upload").show();
					var minorVersion = Ext.getCmp('minorVersion').getValue();
					var majorVersion = Ext.getCmp('majorVersion').getValue();
					if (minorVersion == true) {
						versionType = '0';
					}
					if (majorVersion == true) {
						versionType = '1';
					}
					if (versionType.length == 0) {
						Ext.Msg.alert("empty", "Please select version type.");
						return;
					}

					if (linkId != '' && linkId != 'undefined') {

						var checkOut = '';
						var form = loadLinksForm.getForm();
						form.submit({
							url : '../sbb/sbbUpLinks!updateLinksFromExcel.action',
							params : {
								linkId : linkId,
								status : versionType
							},
							success : function(response, option) {
								var grid = Ext.ComponentQuery
										.query('SBB-management')[0];
								grid.store.load();
								var status = option.result.status;
								var fileName = option.result.fileName;
								if (fileName != 'undefined') {
									if (fileName == 'null') {
										Ext.Msg.alert("error",
												"File is invalid.");
									}
								}
								if (status == 'warn') {
									message = option.result.message;
									msgStore.on('beforeload', function() {
										var et = '../sbb/sbb!listAllResult.action?message='
												+ message;
										msgStore.proxy.url = et;
									});
									msgStore.load();
									Ext.Msg.alert('message',
											'Update success.But ignored some.');
								} else {
									Ext.Msg.alert('message', 'Update success.');
									loadLinksWin.close();
								}
							},
							failure : function() {
								Ext.Msg.alert("error", "error");
								loadLinksWin.close();
							}
						});
					}
				}
			}]
		});

		var loadLinksWin = new Ext.Window({
					width : 400,
					title : 'load update links',
					height : 300,
					closable : true,
					closeAction : 'destroy',
					constrain : true,
					items : [{
								border : false,
								items : [{
											region : 'center',
											items : [loadLinksForm]
										}, {
											region : 'south',
											height : 200,
											// collapsible: true,
											items : [grid4]
										}]
							}]
				});

		return loadLinksWin;
	},

	excelWin : function() {
		var msgStore2 = new Ext.data.JsonStore({
					fields : [{
								name : 'name'
							}, {
								name : 'number'
							}, {
								name : 'detail'
							}],
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!listAllResults.action',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});

		var grid5 = new Ext.grid.GridPanel({
					height : 200,
					store : msgStore2,
					autoScroll : true,
					columns : [/* new Ext.grid.RowNumberer(), */
					{
								text : 'Name',
								flex : 1,
								dataIndex : 'name'
							}, {
								text : 'Number',
								flex : 1,
								dataIndex : 'number'
							}, {
								text : 'Detail',
								flex : 1,
								dataIndex : 'detail'
							}]

				});

		var excelForm = Ext.create('Ext.form.FormPanel', {
			// height :170,
			bodyStyle : 'padding:5px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				labelWidth : 220,
				labelAlign : "left",
				items : [{
					columnWidth : 1,
					layout : 'anchor',
					baseCls : 'x-plain',
					border : false,
					defaultType : 'textfield',
					defaults : {
						anchor : '80%'
					},
					items : [{
								xtype : "hidden",
								name : "fileName"
							}, {
								fieldLabel : "Upload File",
								xtype : 'filefield',
								emptyText : 'Select a file ...',
								name : 'uploadFile',
								buttonText : 'Browser',
								listeners : {
									'change' : function(fb, v) {
										excelForm.getForm()
												.findField("fileName")
												.setValue(v);
										// findForm.findField("fileName").setValue(v);
									}
								}
							}]
				}]
			}],
			buttons : [{
				text : "upload",
				hidden : false,
				name : "upload1",
				id : "upload1",
				handler : function() {
					msgStore2.removeAll();
					Ext.getCmp("continue1").hide();
					Ext.getCmp("upload1").show();
					var file = excelForm.getForm().findField("fileName")
							.getValue();
					if (file == '') {
						Ext.Msg.alert("empty", "File is invalid.");
						return;
					}
					var form = excelForm.getForm();
					form.submit({
						url : '../sbb/sbbUpAttri!validateAttributesFromExcel.action',
						waitMsg : 'Validate file...',
						success : function(response, option) {
							var grid = Ext.ComponentQuery
									.query('SBB-management')[0];
							grid.store.load();
							var status = option.result.status;
							if (status == 'undefined') {
								Ext.Msg.alert("error", "File is invalid.");
							}
							if (status == 'continue') {
								linkId = option.result.linkId;
								Ext.Msg.alert("message", "click continue!");
								Ext.getCmp("continue1").show();
								Ext.getCmp("upload1").hide();
							}
							message = option.result.message;
							if (message != undefined) {
								msgStore2.on('beforeload', function() {
									var et = '../sbb/sbb!listAllResult.action?message='
											+ message;
									msgStore2.proxy.url = et;
								});
								msgStore2.load();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("error", "sorry,load failed!");
						}
					});
				}
			}, {
				text : "continue",
				hidden : true,
				name : "continue1",
				id : "continue1",
				handler : function() {
					Ext.getCmp("continue1").hide();
					Ext.getCmp("upload1").show();
					if (linkId != '' && linkId != 'undefined') {
						var form = excelForm.getForm();
						form.submit({
							url : '../sbb/sbbUpAttri!saveAttributesFromExcel.action',
							params : {
								linkId : linkId,
								status : 0
							},
							success : function(response, opt) {
								var grid = Ext.ComponentQuery
										.query('SBB-management')[0];
								grid.store.load();
								if (status == 'warn') {
									Ext.Msg.alert('message',
											'Update success.But ignored some.');
								} else {
									Ext.Msg.alert('message', 'Update success.');
									loadLinksWin.close();
								}
							},
							failure : function() {
								Ext.Msg.alert("error", "error");
								loadLinksWin.close();
							}
						});

					}
				}
			}]
		});

		var excelWin = new Ext.Window({
					width : 400,
					title : 'please input',
					height : 300,
					closable : true,
					closeAction : 'destroy',
					constrain : true,
					items : [{
								border : false,
								items : [{
											region : 'center',
											items : [excelForm]
										}, {
											region : 'south',
											height : 200,
											// collapsible: true,
											items : [grid5]
										}]
							}]
				});

		return excelWin;

	},

	setRecordIds : function() {
		var me = this;
		var recordIds = me.recordIds;
		var grid = me.grid;
		this.store.each(function(record) {
					if (grid.getSelectionModel().isSelected(record)) {
						if (!Ext.Array.contains(recordIds, record.get('id'))) {
							recordIds.push(record.get('id'));
						}
					} else {
						if (Ext.Array.contains(recordIds, record.get('id'))) {
							Ext.Array.remove(recordIds, record.get('id'));
						}
					}
				});
	},

	saveAsWin : function() {
		var me = this;
		var sbbElementStore = me.sbbElementStore;

		var sbbElementGrid = new Ext.grid.GridPanel({
			autoScroll : true,
			layout : 'fit',
			store : sbbElementStore,
			columns : [{
						hidden : true,
						dataIndex : 'id',
						flex : 1
					}, {
						text : 'Element Name',
						dataIndex : 'name',
						flex : 1,
						sortable : true,
						name : "name"
					}, {
						text : 'Status',
						dataIndex : 'status',
						flex : 1,
						sortable : true,
						name : 'status'
					}, {
						text : 'Version',
						dataIndex : 'elementVersion',
						flex : 1,
						sortable : false,
						name : 'version'
					}, {
						text : 'Last Modify',
						dataIndex : 'updatedTime',
						renderer : Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
						flex : 1,
						sortable : true,
						name : 'lastmodify'
					}, {
						text : 'Last Modify By',
						dataIndex : 'updatedUserName',
						flex : 1,
						sortable : false,
						name : 'lastmodifyby'
					}, {
						text : 'Create On',
						dataIndex : 'createdTime',
						renderer : Ext.util.Format.dateRenderer('m/d/Y H:i:s'),
						flex : 1,
						sortable : true,
						name : 'createon'
					}],
			columnLines : true,
			viewConfig : {
				stripeRows : true
			},
			tbar : [{
						xtype : 'tbtext',
						text : 'Sbb Number:'
					}, {
						xtype : 'textfield',
						id : "tf_sbb_number",
						hideLabel : true,
						allowBlank : false,
						value : '',
						width : 200
					},

					{
						text : 'Submit',
						iconCls : 'icon-checkin',
						disabled : false,
						id : 'btn_country_submit',
						handler : function() {
							var tf_field = Ext.getCmp("tf_sbb_number");
							// alert(s_id);
							if (Ext.getCmp("tf_sbb_number").getValue() == s_number) {
								Ext.MessageBox.show({
											title : 'Error',
											msg : 'can not input same number!',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-info'
										});
								return false;
							}

							if (tf_field.isValid())
								Ext.Ajax.request({
									url : '../sbb/sbb!saveAs.action',
									method : 'POST',
									params : {
										s_id : s_id,
										number : tf_field.getValue()
									},
									success : function(response, config) {

										var res = Ext.JSON
												.decode(response.responseText);
										if (res.msg && res.msg != "") {
											Ext.MessageBox.show({
														title : 'Message',
														msg : res.msg,
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-info'
													});
											saveAsWin.hide();
											return;
										}
										if (res.success) {
											Ext.MessageBox.show({
														title : 'Message',
														msg : 'Submit successful!',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-info'
													});
											saveAsWin.hide();
											return;
										} else {
											Ext.MessageBox.show({
														title : 'Message',
														msg : 'Submit Failed!',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-info'
													});
											saveAsWin.close();
										}

									},
									failure : function() {
										Ext.MessageBox.show({
													title : 'Message',
													msg : 'Submit Error!',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
										saveAsWin.close();
									}

								});

						}
					}, {
						text : 'Cancel',
						iconCls : 'icon-cancel',
						handler : function() {
							saveAsWin.hide();
						}
					}],
			bbar : Ext.create('App.PagingToolbar', {
						store : sbbElementStore,
						displayInfo : true
					}),
			viewConfig : {
				stripeRows : true
			}
		});

		var saveAsWin = new Ext.Window({
					layout : 'fit',
					width : 700,
					title : 'save as',
					height : 300,
					closable : true,
					closeAction : 'destroy',
					items : [sbbElementGrid]
				});

		return saveAsWin;

	},

	commonCheckOut : function(ids) {
		var me = this;
		var flag = '';
		Ext.Ajax.request({
					url : '../sbb/checkOut!commonCheckOut.action',
					method : 'POST',
					async : false,
					params : {
						ids : ids
					},
					success : function(res, req) {
						if (res.responseText == null
								|| res.responseText == undefined
								|| res.responseText == "undefined"
								|| res.responseText == "") {
							flag = false;
						} else {
							var resText = Ext.JSON.decode(res.responseText);
							flag = resText.success;
						}
					},
					failure : function() {
						Ext.MessageBox.show({
									title : 'Message',
									msg : 'Checkout Error!',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
					}
				});
		if (flag == false) {
			return false;
		} else if (flag == true) {
			return true;
		}
	},

	updateLinksWin : function() {
		var me = this;
		var updateLinksForm = Ext.create('Ext.form.FormPanel', {
			// height :170,
			autoHeight : true,
			bodyStyle : 'padding:0px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				labelWidth : 120,
				labelAlign : "left",
				items : [{
					columnWidth : 0.7,
					layout : 'anchor',

					baseCls : 'x-plain',
					border : false,
					defaultType : 'textfield',
					defaults : {
						anchor : '80%'
					},
					items : [{
								xtype : "hidden",
								name : "fileName"
							}, {
								fieldLabel : "Element Name",
								name : "elementName",
								id : "elementName"
							}, {
								fieldLabel : "Upload File",
								xtype : 'filefield',
								emptyText : 'Select a file ...',
								name : 'uploadFile',
								id : "uploadFile",
								buttonText : 'Browser',
								listeners : {
									'change' : function(fb, v) {
										updateLinksForm.getForm()
												.findField("fileName")
												.setValue(v);
									}
								}
							}]
				}]
			}],
			buttons : [{
				text : "ExportExcel",
				handler : function() {
					var elementName = updateLinksForm.getForm()
							.findField("elementName").getValue();
					var fileName = updateLinksForm.getForm()
							.findField("fileName").getValue();
					if (elementName.length == 0 && fileName.length == 0) {
						Ext.Msg.alert('empty', 'please input element.');
					} else {
						var form = updateLinksForm.getForm();
						form.standardSubmit = true;
						form.submit({
							url : '../sbb/sbbDownLinks!downLinksToExcel.action?sbbIds='
									+ me.recordIds,
							method : 'POST',
							success : function(form, action) {
								this.store.sync();
								this.up('window').close();
							},
							failure : function() {
								Ext.Msg.alert("error", "sorry,error message!");
							}
						});
					}
				}
			}]
		});

		var updateLinksGrid = new Ext.grid.GridPanel({
					height : 276,
					// autoHeight: true,
					store : me.updateLinksStore,
					autoScroll : true,
					bbar : Ext.create('App.PagingToolbar', {
								store : me.updateLinksStore,
								displayInfo : true
							}),
					columns : [/* new Ext.grid.RowNumberer(), */{
								dataIndex : "id",
								hidden : true
							}, {
								text : 'SBB Number',
								align : "center",
								dataIndex : 'number',
								name : 'number'
							}, {
								text : 'SBB Name',
								align : "center",
								dataIndex : 'name',
								name : 'name'
							}, {
								text : 'Status',
								align : "center",
								dataIndex : 'status',
								name : 'status'
							}, {
								text : 'Version',
								align : "center",
								dataIndex : 'sbbVersion',
								name : 'sbbVersion'
							}, {
								text : 'Last Modify',
								align : "center",
								dataIndex : 'updatedTime',
								name : 'updatedTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y')

							}, {
								text : 'Last Modify By',
								align : "center",
								dataIndex : 'updatedUserName',
								name : 'updatedBy'
							}, {
								text : 'Create On',
								align : "center",
								dataIndex : 'createdTime',
								name : 'createdTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y')
							}],
					listeners : {
						itemdblclick : function() {
						}
					}
				});

		var updateLinksWin = new Ext.Window({
					layout : {
						type : 'vbox',
						align : 'stretch'
						// pack : 'start'
					},
					width : 600,
					height : 450,
					closeAction : 'destroy',
					constrain : true,
					items : [{
								// height: 200,
								flex : 1,
								layout : 'fit',
								border : false,
								// margin: '2 2 0 2',
								items : [updateLinksForm]
							}, {
								// height: 200,
								flex : 2,
								layout : 'fit',
								border : false,
								// margin: '0 2 2 2',
								items : [updateLinksGrid]
							}]
				});

		return updateLinksWin;
	},
	// 创建toolbar
	createToolbar : function() {

		var me = this;
		var store = me.store;
		// var grid = me.grid;
		// var recordIds = me.recordIds;

		var store2 = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						url : '../sbb/sbb!listAllStatus.action',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
/*
	 * add by liujh 
	 * adhoc report attr
	 * 2012-11-09  start
	 */
	var adhc_project = '';
	var adhc_mtname = '';
	var adhc_name = '';
	var adhc_endDate = '';
	var adhc_startDate = '';
	var adhc_number = '';
	var adhc_adhoc = '';
	var adhc_status = '';
	/*
	 * end
	 */
		var toolbar = Ext.create('widget.toolbar', {
			layout : {
				overflowHandler : 'Menu'
			},
			items : [{
				text : '<b>Search</b>',
				iconCls : 'icon-search',
				// add Access Control
				id : 'sbb_search',
				disabled : Ext.LOIS.isEnable('sbb_search'),
				handler : function() {
					findForm = Ext.create('Ext.form.FormPanel', {
						// height :170,
						bodyStyle : 'padding:5px 5px 0',
						frame : true,
						fieldDefaults : {
							labelAlign : 'right',
							labelWidth : 150,
							msgTarget : 'qtip', // 错误信息提示
							width : 260
							// default width
						},
						layout : 'anchor',
						defaults : {
							anchor : '100%' // padding to 100%
						},
						items : [{
									xtype : "hidden",
									name : "fileName"
								}, {
									xtype : 'container',
									layout : 'hbox',
									items : [{
												fieldLabel : "Project Name",
												name : "projectName",
												xtype : 'textfield',
												flex : 1,// 剩余的填充满
												id : "projectName"
											}, {
												fieldLabel : "CTO Number",
												name : "ctoNumber",
												xtype : 'textfield',
												flex : 1,// 剩余的填充满
												id : "ctoNumber"
											}]
								}, {
									xtype : 'container',
									layout : 'hbox',
									items : [{
												fieldLabel : "SBB Number",
												name : "sbbNumber",
												xtype : 'textfield',
												flex : 1,// 剩余的填充满
												id : "sbbNumber"
											}, {
												fieldLabel : "SBB Name",
												name : "sbbName",
												xtype : 'textfield',
												flex : 1,// 剩余的填充满
												id : "sbbName"
											}]
								}, {
									xtype : 'container',
									layout : 'hbox',
									items : [{
										fieldLabel : "SBB MKT Description",
										name : "mktDescription",
										xtype : 'textfield',
										flex : 1,// 剩余的填充满
										id : "mktDescription"
									},{
										fieldLabel : "Status",
										xtype : "combo",
										name : 'status',
										id : 'status',
										store : new Ext.data.SimpleStore({
													fields : ['value', 'text'],
													data : [
															['Change', 'Change'],
															['Draft', 'Draft'],
															['Final', 'Final'],
															['Initiated',
																	'Initiated'],
															['RFR', 'RFR']]
												}),
										editable : false,
										emptyText : 'Status',
										flex : 1,// 剩余的填充满
										// allowBlank : false,
										displayField : 'text',
										valueField : 'value',
										mode : 'local'
									}]
								}, {
									xtype : 'container',
									layout : 'hbox',
									items : [{
										fieldLabel : "SBB Basic Name",
										name : "baseName",
										flex : 1,// 剩余的填充满
										xtype : 'textfield',
										id : "baseName"
									},{
										fieldLabel : "Upload File",
										xtype : 'filefield',
										flex : 1,// 剩余的填充满
										emptyText : 'Select a file ...',
										name : 'uploadFile',
										buttonText : 'Browser',
										listeners : {
											'change' : function(fb, v) {
												findForm.getForm()
														.findField("fileName")
														.setValue(v);
												// findForm.findField("fileName").setValue(v);
											}
										}
									}]
								}],
						buttons : [{
							text : "Search",
							iconCls : 'icon-search',
							handler : function() {
								me.elementStore.removeAll();
								me.recordIds = [];
								me.updateSbbIds = '';
								me.search = '1';
								var form = findForm.getForm();
								adhoc_adhoc = "";
								form.submit({
									// timeout : 150000,
									url : '../sbb/sbb!uploadFileAndAcceptForm.action',
									success : function(fp, o) {
										var result = o.result;
										me.projectName = result.projectName;
										me.sbbNumber = result.sbbNumber;
										me.status = result.status;
										me.mktDescription = result.mktDescription;
										var fileName = result.fileName;
										me.realFileName = result.fileName;
										me.baseName = result.baseName;
										me.ctoNumber = result.ctoNumber;
										me.fileCondition = result.fileCondition;
										me.sbbName = result.sbbName;
										var et = '../sbb/sbb!findSbbsByCondition.action';
										store.proxy.url = et;
										store.currentPage = 1;
										store.proxy.actionMethods.read="POST";
										store.load({
											params : {
												projectName : me.projectName,
												ctoNumber : me.ctoNumber,
												sbbNumber : me.sbbNumber,
												sbbName : me.sbbName,
												status : me.status,
												mktDescription : me.mktDescription,
												fileName : fileName,
												baseName : me.baseName,
												fileCondition : me.fileCondition,
												targetPageNo : 1,
												currentPageNo : 1,
												paginationAction : 'first',
												currentPage : 1,
												page : 1,
												start : 0,
												limit : 20
											}
										});
										win.close();
									},
									failure : function() {
										Ext.Msg.alert("error",
												"sorry,error message!");
									}
								});
							}
						}, {
							text : 'Cancel',
							iconCls : 'icon-cancel',
							handler : function() {
								win.close();
							}
						}]
					});
					var win = new Ext.Window({
								layout : 'fit',
								width : 700,
								modal : true,
								title : 'SBB Search Criteria',
								// height : 250,
								closeAction : 'destroy',
								constrain : true,
								items : [findForm]
							});
					win.show();
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>Edit</b>',
				iconCls : 'icon-edit',
				menu : {
					items : [{
						text : 'Edit Attribute (UI)',
						iconCls : 'icon-menu-node',
						// add Access Control
						id : 'sbb_update_attribute',
						disabled : Ext.LOIS.isEnable('sbb_update_attribute'),
						handler : function() {
							// debugger
							me.setRecordIds();
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							var res = me.commonCheckOut(me.recordIds);
							if (res == false) {
								Ext.MessageBox.show({
									title : 'Message',
									msg : 'Checkout Error!Some sbbs is being check out by other people.',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
								return false;
							} else if (res == true) {
								var win = Ext.createWidget('attributeEdit', {
											ids : me.recordIds,
											type : 'SBB'
										});
								win.show();
								// var editWin = Ext.create(
								// 'Ext.sbb.manage.edit_sbbattr', {
								// ids : me.recordIds
								// });
								// editWin.show();
							}
						}
					}, {
						text : 'Edit Attribute (Loadsheet)',
						iconCls : 'icon-menu-node',
						// add Access Control
						id : 'sbb_attribute_exloadsheet',
						disabled : Ext.LOIS
								.isEnable('sbb_attribute_exloadsheet'),
						handler : function() {
							me.setRecordIds();

							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								var editForm = Ext.create('Ext.form.FormPanel',
										{
											height : 170,
											bodyStyle : 'padding:5px 5px 0',
											items : [{
														layout : 'column',
														border : false,
														labelWidth : 120,
														labelAlign : "left"
													}]
										});
								Ext.Ajax.request({
									url : '../sbb/sbbDownAttri!checkEditAttributes.action?sbbIds='
											+ me.recordIds,
									method : 'get',
									isUpload : true,
									success : function(response, option) {
										var jsonMessage = Ext
												.decode(response.responseText);
										flag = jsonMessage.status;
										if (flag == 'F') {
											Ext.Msg
													.alert('Information',
															'Is being check out by other people.');
										} else {
											var form = editForm.getForm();
											form.standardSubmit = true;
											form.submit({
												url : '../sbb/sbbDownAttri!editAttributes.action?sbbIds='
														+ me.recordIds,
												method : 'POST',
												success : function(form, action) {
												}
											});
										}
									},
									failure : function() {
										Ext.MessageBox.show({
													title : 'Message',
													msg : 'Error!',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
									}
								});
								// var grid =
								// Ext.ComponentQuery.query('SBB-management')[0];
								// me.search='0';
								// grid.store.load();

							}
						}
					}]
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>View Links</b>',
				iconCls : 'icon-element-link',
				menu : {
					items : [{
						text : 'View Links',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('sbb_elementlink_revise'),
						id : 'sbb_elementlink_revise',
						handler : function() {
							me.setRecordIds();
							if (me.recordIds == "") {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								selectedIds = me.recordIds;
								enhanceWinPanel = new Ext.Window({
									title : 'Edit Element Link',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew.html?objectType=sbb"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
							}
						}
					}, {
						text : 'Download Element Links',
						iconCls : 'icon-menu-node',
						/*disabled : Ext.LOIS
								.isEnable('sbb_view_inloadsheet'),*/
						id : 'sbb_view_inloadsheet',
						handler : function(){
							me.setRecordIds();
							if (me.recordIds == "") {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								selectedIds = me.recordIds;
								ctoViewLinksSearchPanel = new Ext.Window({
									title : 'Search Critiera',
									width : 900,
									height : 500,
									constrain : true,
									modal : true,
									closable : true,
									html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/viewLinksSearch2.html?"> </iframe>'//' + allCTONumbers + '&' + objType + '&' + idList +'
								});
								ctoViewLinksSearchPanel.show();
							}
						}
					}
//					{
//						text : 'View Links',
//						iconCls : 'icon-menu-node',
//						// add Access Control
//						id : 'sbb_elementlink_revise',
//						disabled : Ext.LOIS.isEnable('sbb_elementlink_revise'),
//						handler : function() {
//							me.setRecordIds();
//							if (me.recordIds == '') {
//								Ext.Msg.alert('empty',
//										'please select some items.');
//							} else {
//								Ext.Ajax.request({
//									url : '../element/elementLink!findElementsByObjectIds.action',
//									method : 'POST',
//									params : {
//										objectIds : me.recordIds,
//										objectType : 'sbb'
//									},
//									success : function(response, option) {
//										var result = Ext.JSON
//												.decode(response.responseText);
//										this.objectsStr = result.objectsStr;
//										this.elementTypesStr = result.elementTypesStr;
//										this.elementsStr = result.elementsStr;
//										this.objectType = 'sbb';
//										enhanceWinPanel = new Ext.Window({
//											title : 'Edit Element Link',
//											width : 950,
//											height : 550,
//											constrain : true,
//											modal : true,
//											closable : false,
//											items : [],
//											html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLink/ElementLink.html"> </iframe>'
//										});
//										enhanceWinPanel.show();
//									},
//									failure : function() {
//										Ext.MessageBox.show({
//													title : 'Message',
//													msg : 'Error!',
//													buttons : Ext.MessageBox.OK,
//													icon : 'ext-mb-error'
//												});
//									}
//								});
//							}
//						}
//					}
					]
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>Loadsheet Upload</b>',
				iconCls : 'icon-loadsheet',
				menu : {
					items : [{
						text : 'Attribute Loadsheet',
						iconCls : 'icon-menu-node',
						// add Access Control
						id : 'sbb_attribute_inloadsheet',
						disabled : Ext.LOIS
								.isEnable('sbb_attribute_inloadsheet'),
						handler : function() {
							var userId = '';
							Ext.Ajax.request({
								url : '../element/getCurrentUser!findCurrentUserId.action',
								method : 'POST',
								async : false,
								success : function(response, option) {
									var result = Ext.JSON
											.decode(response.responseText);
									userId = result.userId;
								},
								failure : function() {
								}
							});
							enhanceWinPanel = new Ext.Window({
								title : 'Edit Attribute',
								width : 750,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=sbbattribute&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
							// var win = me.excelWin();
							// win.show();
						}
					}, {
						text : 'Element Link Loadsheet',
						iconCls : 'icon-menu-node',
						// add Access Control
						id : 'sbb_elementlink_inloadsheet',
						disabled : Ext.LOIS
								.isEnable('sbb_elementlink_inloadsheet'),
						handler : function() {
							var userId = '';
							Ext.Ajax.request({
								url : '../element/getCurrentUser!findCurrentUserId.action',
								method : 'POST',
								async : false,
								success : function(response, option) {
									var result = Ext.JSON
											.decode(response.responseText);
									userId = result.userId;
								},
								failure : function() {
								}
							});
							enhanceWinPanel = new Ext.Window({
								title : 'load update links',
								width : 750,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=sbbelement&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
							// var win = me.loadLinksWin();
							// win.show();
						}
					}]
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>More</b>',
				iconCls : 'icon-more-actions',
				menu : {
					items : [{
						/*
						 * text: '<b>Save As</b>', iconCls:'icon-loadsheet',
						 * menu: { items: [{
						 */
						text : 'Save As',
						iconCls : 'icon-menu-node',
						// add Access Control
						id : 'sbb_saveas',
						disabled : Ext.LOIS.isEnable('sbb_saveas'),
						handler : function() {
							var grid = me.grid;
							var win = me.saveAsWin();
							var sbbElementStore = me.sbbElementStore;
							if (grid.getSelectionModel().selected.items.length != 1) {
								Ext.Msg.alert("error",
										"please select one record!");
								return false;
							} else {
								s_id = grid.getSelectionModel().selected.items[0]
										.get('id');
								s_number = grid.getSelectionModel().selected.items[0]
										.get('number');
								sbbElementStore.on('beforeload', function() {
									sbbElementStore.getProxy().extraParams.ids1 = s_id;
								});
								sbbElementStore.load();
							}
							win.show();

						}

					},{
						/*
						 * text: '<b>Save As</b>', iconCls:'icon-loadsheet',
						 * menu: { items: [{
						 */
						text : 'Promote',
						iconCls : 'icon-menu-node',
						id : 'sbb_promote',
						disabled : Ext.LOIS.isEnable('sbb_promote'),
						handler:function(){						
						    me.setRecordIds();
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							//alert(me.recordIds);
							var center = Ext.getCmp('center-tabs');
				     	    var url = '../sbb/PromoteSbb.html?sbbIds='+me.recordIds;
				     	    var urlMap=window.parent.urlMap;
							var sbbId = urlMap.get('../sbb/PromoteSbb.html');
				     	    var tab_n = center.getActiveTab(sbbId);
							var tt=   Ext.getCmp(sbbId);
							Ext.Msg.confirm("Promote Searching",
											"The SBBs listing on SBB Promote page will be refreshed by the selected SBBs,do you want to go on?",
								function(btn){ 
									if (btn == 'yes'){
										if(tt==undefined){
					        	tab_n =  center.add({		 
								 title:'SBB Promote',
								 iconCls: 'tabs',
								 id:sbbId,
								 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
								 closable: true
								 });
								 center.setActiveTab(tab_n);
					        }else{
					           center.remove(tt);					
					           tt=center.add({		 
								 title:'SBB Promote',
								 iconCls: 'tabs',
								 id:sbbId,
								 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
								 closable: true
					           });
					           center.setActiveTab(tt);
					        }
									}else{ 
										 return false; 
										}});
						}
					}, {
						text : 'SBB Adhoc Report',
						iconCls : 'icon-menu-node',
						handler : function() {
							var grid = me.grid;
							if (grid.getStore().getCount() == 0) {
								Ext.MessageBox.alert("Message",
										"there is no data");
								return false;
							}
							// var vExportContent = grid.getExcelXml(0);//
							// parameter

							// fileNameArr = window.location.href.split('/');
							// var fileName = 'SBB' + '_' + new
							// Date().getTime();
							if(typeof(adhoc_mtname) == 'undefined')
							{
								adhoc_mtname = '';
							}
							if(typeof(adhoc_number) == 'undefined')
							{
								adhoc_number = '';
							}
							if(typeof(adhoc_status) == 'undefined')
							{
								adhoc_status = '';
							}
							if(typeof(adhoc_name) == 'undefined')
							{
								adhoc_name = '';
							}
							if(typeof(adhoc_project) == 'undefined')
							{
								adhoc_project = '';
							}
							if(typeof(adhoc_startDate) == 'undefined')
							{
								adhoc_startDate = '';
							}
							if(typeof(adhoc_endDate) == 'undefined')
							{
								adhoc_endDate = '';
							}
							if(typeof(adhoc_adhoc) == 'undefined')
							{
								adhoc_adhoc = '';
							}
							if(typeof(adhoc_offeringId) == 'undefined')
							{
								adhoc_offeringId = '';
							}
							Ext.Ajax.request({

								url : '../sbb/sbbUpLinks!checkSbbAdhocReportCount.action',
								async : false,
								params : {
									/**
									 * add by liujh adhoc report  start
									 */
									mtname:adhoc_mtname,
								    number:adhoc_number,
								    status:adhoc_status,
								    name:adhoc_name,
								    project:adhoc_project,
								    startDate:adhoc_startDate,
								    endDate:adhoc_endDate,
								    adhoc:adhoc_adhoc,
								    offeringId: adhoc_offeringId,
									/**
									 * end
									 */
									projectName : me.projectName,
									ctoNumber : me.ctoNumber,
									sbbNumber : me.sbbNumber,
									sbbName : me.sbbName,
									status : me.status,
									mktDescription : me.mktDescription,
									fileName : me.realFileName,
									baseName : me.baseName,
									fileCondition : me.fileCondition,
									currentPageNo : 1,
									sort : 'name',
									dir : 'asc',
									pageSize : 20
								},
								success : function(response, option) {
									var jsonMessage = Ext
											.decode(response.responseText);
									var message = jsonMessage.msg;
									var adhocCount = jsonMessage.adhocCount;
									if (message == 'F') {
										if (!Ext.fly('SBBAdhocReport')) {
											var frm = document
													.createElement('form');
											frm.id = 'SBBAdhocReport';
											frm.name = id;
											frm.className = 'x-hidden';
											document.body.appendChild(frm);
										}

										Ext.Ajax.request({
											url : '../sbb/sbbUpLinks!makeAdhocReportForSBB.action',
											method : 'POST',
											form : Ext.fly('SBBAdhocReport'),
											isUpload : true,
											params : {
												/**
									 * add by liujh adhoc report  start
									 */
									mtname:adhoc_mtname,
								    number:adhoc_number,
								    status:adhoc_status,
								    name:adhoc_name,
								    project:adhoc_project,
								    startDate:adhoc_startDate,
								    endDate:adhoc_endDate,
								    adhoc:adhoc_adhoc,
								    offeringId: adhoc_offeringId,
									/**
									 * end
									 */
												projectName : me.projectName,
												ctoNumber : me.ctoNumber,
												sbbNumber : me.sbbNumber,
												sbbName : me.sbbName,
												status : me.status,
												mktDescription : me.mktDescription,
												fileName : me.realFileName,
												baseName : me.baseName,
												fileCondition : me.fileCondition,
												currentPageNo : 1,
												sort : 'name',
												dir : 'asc',
												pageSize : adhocCount
											}
										})

									} else if (message == 'T') {
										Ext.Msg
												.confirm(
														'infomation',
														'there are more than '
																+ adhocCount
																+ ' records, the lois system can only export top '
																+ adhocCount
																+ ' records of the data,are you sure?',
														function(btn) {
															if (btn == 'yes') {
																if (!Ext
																		.fly('SBBAdhocReport')) {
																	var frm = document
																			.createElement('form');
																	frm.id = 'SBBAdhocReport';
																	frm.name = id;
																	frm.className = 'x-hidden';
																	document.body
																			.appendChild(frm);
																}
																Ext.Ajax
																		.request(
																				{
																					url : '../sbb/sbbUpLinks!makeAdhocReportForSBB.action',
																					method : 'POST',
																					form : Ext
																							.fly('SBBAdhocReport'),
																					isUpload : true,
																					params : {
																						/**
									 * add by liujh adhoc report  start
									 */
									mtname:adhoc_mtname,
								    number:adhoc_number,
								    status:adhoc_status,
								    name:adhoc_name,
								    project:adhoc_project,
								    startDate:adhoc_startDate,
								    endDate:adhoc_endDate,
								    adhoc:adhoc_adhoc,
								    offeringId: adhoc_offeringId,
									/**
									 * end
									 */
																						projectName : me.projectName,
																						ctoNumber : me.ctoNumber,
																						sbbNumber : me.sbbNumber,
																						status : me.status,
																						sbbName : me.sbbName,
																						mktDescription : me.mktDescription,
																						fileName : me.realFileName,
																						baseName : me.baseName,
																						fileCondition : me.fileCondition,
																						currentPageNo : 1,
																						sort : 'name',
																						dir : 'asc',
																						pageSize : adhocCount
																					}
																				})
															}
														});
									}
								},
								failure : function() {
									Ext.Msg.alert("Information",
											"Export sbb adhoc report failed!");
								}
							});

						}
					}, 
					 {
                    	text : 'View Translation',
    					iconCls : 'icon-menu-node',		
    					//disabled : Ext.LOIS.isEnable('view_cto_translation'),
    					id : 's_management_viewTranslation_ui',
    					handler : function() {

							me.setRecordIds(me.grid);
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}

							var ids = [];
							var grid = me.grid;
							for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
								ids
										.push(grid.getSelectionModel().selected.items[i]
												.get('id'));
							}
							var res =me.commonCheckOut(ids);
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some SBBs is being check out by other people.',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
													return false;
									} else if (res == true) {
										enhanceWinPanel = new Ext.Window({
											title : 'View Translation',
											width : 1000,
											height : 700,
											constrain : true,
											modal : true,
											closable : true,
											items : [],
											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=SBB&viewOrEdit=view&recordIds=' + ids +'"> </iframe>',
											buttons : []
										});
										enhanceWinPanel.show();
										//obj.hide();
							}
    						
    					}
                    	
                    },
                    {
                        text : 'Edit Translation Value',
                        iconCls : 'icon-menu-node',
                        id : 'sbb_management_manuallyTranslation_ui',
                        disabled : window.parent.Ext.LOIS.isEnable('sbb_management_manuallyTranslation_ui'),
						handler : function() {
							me.setRecordIds(me.grid);
									if (me.recordIds == "") {
										Ext.Msg
												.alert(
														"empty",
														"please select some items.");
														return false;
									} 
									var ids = [];
									var grid = me.grid;
									for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
										ids.push(grid.getSelectionModel().selected.items[i]
													.get('id'));
									}
									var res =me.commonCheckOut(ids);
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some SBBs is being check out by other people.',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
													return false;
									} else {
										enhanceWinPanel = new Ext.Window({
											title : 'Edit Translation(* The values edit here will be reported and flattened to downstream instead of vendor translated value!)',
											width : 1000,
											height : 700,
											constrain : true,
											modal : true,
											closable : true,
											items : [],
											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=SBB&viewOrEdit=edit&recordIds=' + ids +'"> </iframe>',
											buttons : []
										});
										enhanceWinPanel.show();
									}
									
								}
                    }
//					,{
//						text : 'View Translation old',
//						iconCls : 'icon-menu-node',
//						// disabled : Ext.LOIS
//						// .isEnable('cto_management_updateLink_ui'),
//						id : 's_management_viewTranslation_ui',
//						handler : function() {
//							me.setRecordIds();
//							if (me.recordIds == '') {
//								Ext.Msg.alert('empty',
//										'please select some items.');
//							} else {
//								Ext.Ajax.request({
//									url : '../offering/viewTranslation!initViewFlex.action',
//									method : 'POST',
//									success : function(response, option) {
//										var result = Ext.JSON
//												.decode(response.responseText);
//										this.objectsStr = result.languageStrForXml;
//										this.elementsStr = me.recordIds;
//										this.objectType = 'SBB';
//										enhanceWinPanel = new Ext.Window({
//											title : 'View Translation',
//											width : 1000,
//											height : 600,
//											// autoScroll : true,
//											constrain : true,
//											modal : true,
//											closable : true,
//											items : [],
//											html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../basic/TranslationViewer/SuperTranslationViewApp.html"> </iframe>'
//										});
//										enhanceWinPanel.show();
//									},
//									failure : function() {
//										Ext.MessageBox.show({
//													title : 'Error',
//													msg : 'System Error!',
//													buttons : Ext.MessageBox.OK,
//													icon : 'ext-mb-error'
//												});
//									}
//								});
//							}
//						}
//					}
//					,{
//                        text : 'Edit Translation Value Old',
//                        iconCls : 'icon-menu-node',
//                        id : 'sbb_management_manuallyTranslation_ui',
//                        disabled : window.parent.Ext.LOIS.isEnable('sbb_management_manuallyTranslation_ui'),
//                        handler : function() {
//                            me.setRecordIds(me.grid);
//                            if (me.recordIds == '') {
//                                Ext.Msg.alert('empty',
//                                        'please select some items.');
//                            } else {
//                                Ext.Ajax.request({
//                                    url : '../offering/editTranslation!initEditTranslation.action',
//                                    method : 'POST',
//                                    success : function(response, option) {
//                                        var result = Ext.JSON
//                                                .decode(response.responseText);
//                                        this.objectsStrForEditTrans = result.languageStrForXml;
//                                        this.elementsStrForEditTrans = me.recordIds;
//                                        this.objectTypeForEditTrans = 'SBB';
//                                        editWinPanel = new Ext.Window({
//                                            title : 'Edit Translation(* The values edit here will be reported and flattened to downstream instead of vendor translated value!)',
//                                            width : 1000,
//                                            height : 600,
//                                            // autoScroll : true,
//                                            constrain : true,
//                                            modal : true,
//                                            closable : true,
//                                            items : [],
//                                            html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../basic/EditTranslationApp/EditTranslationApp.html"> </iframe>'
//                                         //   html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../basic/TranslationViewer/EditTranslationApp.html"> </iframe>'
//                                        });
//                                        editWinPanel.show();
//                                    },
//                                    failure : function() {
//                                        Ext.MessageBox.show({
//                                            title : 'Error',
//                                            msg : 'System Error!',
//                                            buttons : Ext.MessageBox.OK,
//                                            icon : 'ext-mb-error'
//                                        });
//                                    }
//                                });
//                            }
//                        }
//                    }
					]
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>Undo</b>',
				iconCls : 'icon-edit',
				disabled : Ext.LOIS.isEnable('sbb_offering_attribute_undo'),
				id : 'sbb_offering_attribute_undo',
				handler : function() {
					var records = me.grid.getSelectionModel().getSelection();
					var ids = [];
					Ext.Array.each(records, function(record, i, all) {
								var checkOut = record.get('checkOutUserName');
								if (checkOut != null) {
									ids.push(record.get('id'));
								}
							});
					if (ids == '') {
						Ext.Msg.alert('no can undo items',
								'please select some items.');
						return false;
					}
					Ext.Ajax.request({
						url : '../offering/checkOut!undoObjectsByObjectIds.action',
						method : 'get',
						async : false,
						params : {
							ids : ids,
							type : 'SBB'
						},
						success : function(res, req) {
							me.store.load();
						},
						failure : function() {
							Ext.MessageBox.show({
										title : 'Message',
										msg : 'Undo Error!',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
						}
					});
				}
			}]
		});

		return toolbar;

	},

	onDestroy : function() {
		Ext.destroyMembers(this, this.store, this.updateLinksStore,
				this.elementStore, this.sbbElementStore, this.form, this.grid,
				this.contextMenu);
		this.callParent();
	}

});