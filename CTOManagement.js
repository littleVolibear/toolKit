Ext.Loader.setConfig({
			enabled : true
		});
Ext.Loader.setPath('Ext.optsrv.advsearch', '../optsrv/advSearch');
Ext.Loader.setPath('Ext.element.js', '../element/js');
Ext.Loader.setPath('Ext.optsrv.js.js.element', '../optsrv/js/js.element');
//Ext.Loader.setPath('Ext.element.js', '../resources/app');
Ext.Loader.setPath('Ext.optsrv.js.attribute', '../optsrv/js/attribute');
Ext.Loader.setPath('Ext.common.manage', '../common');
Ext.require(['Ext.cto.manage.ListCountrys', 'Ext.cto.manage.edit_ctoattr',
		'Ext.optsrv.advsearch.optsrv_advS', 
		'Ext.common.manage.CommonViewTranslation',
		"Ext.common.manage.CommonEditTranslation",
		'Ext.optsrv.js.js.element.element_link_grid',
		'Ext.element.js.elementsList',
		'Ext.optsrv.js.attribute.edit','App']);
var selectedIds = '';
Ext.define('Ext.cto.manage.model', {
			extend : 'Ext.data.Model',
			fields : ['id', 'number', 'name', 'status', 'offeringVersion',
					'updatedTime', 'updatedUserName', 'createdTime',
					'createdUserName', 'checkOutUserName', 'wwLink',
					'unspscCode', 'productHierarchy', 'locationCode',
					'ecNumber', 'ialNumber', 'audience', 'announceDate',
					'withdrawalDate', 'earlyOrderWindowDate',
					'generalAvailabilityDate', 'marketingDescription',
					'invoiceDescription'// ,'modelName'
			]
		});

Ext.define('Ext.cto.manage.CTOManagement', {

	extend : 'Ext.container.Container',
	// extend: 'Ext.panel.Panel',

	alias : 'widget.CTO-management',

	// ---- flex attr start
	elementsStr : '',

	elementTypesStr : '',

	objectsStr : '',

	objectType : '',
	// ----- flex attr end
	
	// ---- flex UI, edit translation start
	elementsStrForEditTrans : '',

	elementTypesStrForEditTrans : '',

	objectsStrForEditTrans : '',

	objectTypeForEditTrans : '',
	// ----- flex UI, edit translation start

	initComponent : function() {

		var me = this;
		var attribute1ID = '0';
	    var attribute2ID = '0';
	    var attribute3ID = '0';
		Ext.apply(Ext.form.field.VTypes, {
			daterange : function(e, d) {
				var c = d.parseDate(e);
				if (!c) {
					return false
				}
				if (d.startDateField
						&& (!this.dateRangeMax || (c.getTime() != this.dateRangeMax
								.getTime()))) {
					var f = d.up("form").down("#" + d.startDateField);
					f.setMaxValue(c);
					f.validate();
					this.dateRangeMax = c
				} else {
					if (d.endDateField
							&& (!this.dateRangeMin || (c.getTime() != this.dateRangeMin
									.getTime()))) {
						var b = d.up("form").down("#" + d.endDateField);
						b.setMinValue(c);
						b.validate();
						this.dateRangeMin = c
					}
				}
				return true
			},
			daterangeText : "Start date must be less than end date"
		});
		this.createAttributeValueStore();
		this.createAttributeNameStore();
		this.createStore();
		this.createUpdateLinksStore();
		this.createElementStore();
		this.createCtoElementStore();
		Ext.override(Ext.grid.GridPanel, {
			getExcelXml : function(includeHidden) {
				var worksheet = this.createWorksheet(includeHidden);
				// var totalWidth =
				// Ext.grid.column.Column.prototype.getFullWidth(includeHidden);
				return '<xml version="1.0" encoding="utf-8">'
						+ '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">'
						+ '<o:DocumentProperties><o:Title>'
						+ 'cto lois data'
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
				for (var i = 3; i < me.grid.columns.length; i++) {
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
						+ 'cto data'
						+ '">'
						+ '<ss:Names>'
						+ '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\''
						+ 'cto data'
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
					for (var j = 3; j < me.grid.columns.length; j++) {
						if ((me.grid.columns[j].text != '')
								&& (includeHidden || !me.grid.columns[j]
										.isHidden())) {
							var v = r[me.grid.columns[j].dataIndex];
							if (cellType[k] !== "None") {
								t += '<ss:Cell ss:StyleID="' + cellClass
										+ cellTypeClass[k]
										+ '"><ss:Data ss:Type="' + cellType[k]
										+ '">';
								if(v!=null)
								{
									t += v;
								}
								else if(v==null)
								{
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
				//debugger;
				return result;
			}
		});
		var paginationBottomBar = Ext.create('App.PagingToolbar', {
					// var paginationBottomBar = Ext.create('Ext.PagingToolbar',
					// {
			       
					store : this.store,
					displayInfo : true
				});

		var elementPaginationBar = Ext.create('App.PagingToolbar', {
					store : me.elementStore,
					displayInfo : true
				});
//		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
//	        clicksToEdit: 1
//	    });
		this.grid = Ext.create('Ext.grid.Panel', {
			// autoHeight: true,
			autoScroll : true,
			frame : true,
			store : this.store,
			viewConfig: {
            stripeRows: true
	        },
//	        plugins: [cellEditing],
			// selModel: Ext.create('Ext.selection.CheckboxModel') ,
			selModel : Ext.create('Ext.selection.CheckboxModel', {
						listeners : {
							selectionchange : function(obj, selecteds) {
								Ext.LOIS.setEnableByTypeAndStatus(
										Ext.LOIS.TYPE.CTO, selecteds);
							},
							select : function(obj, record, index) {
								if (obj.getSelection().length == obj.store.data.length) {
									Ext.LOIS.setEnableByTypeAndStatus(
                                        Ext.LOIS.TYPE.CTO, obj.getSelection());
								}
							}
						}
					}),
			tbar : this.createToolbar(),
			bbar : paginationBottomBar,
			columns : [/* new Ext.grid.RowNumberer(), */{
						dataIndex : "id",
						hidden : true,
						name : "id"
					}, {
						xtype : 'actioncolumntext',
						header : 'Operation',
						//width: 158,
						align : 'left',
						items : [{
							// icon :
							// '../resources/images/icons/table_relationship.png',
							// // Use a URL in the icon config
							icon : 'Country Link',
							tooltip : 'Country Link Info',
							handler : function(grid, rowIndex, colIndex) {
								var rec = grid.store.getAt(rowIndex);
								if (Ext.LOIS.getEnableByTypeAndStatus(
										Ext.LOIS.TYPE.CTO, rec.get('status'),
										'cto_management_country_link')) {
									var ids = [];
									ids.push(rec.get('id'));

									Ext.Ajax.request({
										url : '../offering/updateCountryLink!findAllRegionsAndLinkCountrys.action',
										method : 'GET',
										params : {
											objectType : 'CTO',
											ids : ids
										},
										success : function(response, config) {
											// debugger
											var res = Ext.JSON
													.decode(response.responseText);
											if (res.msg) {
												Ext.MessageBox.show({
													title : 'Message',
													msg : res.msg,
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-info'
												});
												return;
											} else {
												var win = Ext.createWidget(
														'WC-linkCountrys', {
															ids : ids,
															regions : res.regions,
															countrys2 : res.countrys2,
															objectType : 'CTO',
															partnumber : rec.get('number')
														});
												win.submit_url = '../offering/updateCountryLink!updateLinkCountrys.action';
												win.cancel_url = '../offering/updateCountryLink!undo.action';
												win.show();
											}

										},
										failure : function() {
											return;
										}
									});
								} else {
									alert("no permission!");
								}
							}
						}]
					}, {
						text : 'Check out By',
						dataIndex : 'checkOutUserName',
						sortable : false,
						name : 'checkOutBy',
						width : 156,
						align : "left",
						renderer : function(v) {
							if (v != '' && v != 'undefined' && v != undefined) {
								return "<font color='red'>" + v + "</font>";
							}
						}
					}

					, {
						text : 'CTO Number',
						dataIndex : 'number',
						width : 116,
						name : 'number',
						align : "left"
					}, {
						text : 'CTO Name',
						dataIndex : 'name',
						width : 156,
						name : 'name',
						align : "left"
					}, {
						text : 'Status',
						dataIndex : 'status',
						width : 100,
						name : 'status',
						align : "left"
					}, {
						text : 'Version',
						width : 88,
						dataIndex : 'offeringVersion',
						name : 'offeringVersion',
						align : "left"
					}, {
						text : "EC Number",
						dataIndex : "ecNumber",
						width : 124,
						name : "ecNumber",
						align : "left"
					}, {
						text : "ProductHierarchy",
						dataIndex : "productHierarchy",
						width : 156,
						name : "productHierarchy",
						align : "left"
					}, {
						text : "Early Order Window",
						dataIndex : "earlyOrderWindowDate",
						width : 100,
						name : "earlyOrderWindowDate",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					}, {
						text : "Announce Date",
						dataIndex : "announceDate",
						width : 100,
						name : "announceDate",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					},{
						text : "General Availability",
						dataIndex : "generalAvailabilityDate",
						width : 100,
						name : "generalAvailabilityDate",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					}, {
						text : "Withdrawal Date",
						dataIndex : "withdrawalDate",
						width : 100,
						name : "withdrawalDate",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					},  {
						text : "Marketing Description",
						dataIndex : "marketingDescription",
						width : 228,
						name : "marketingDescription",
						align : "left"
					}, {
						text : "Invoice Description",
						dataIndex : "invoiceDescription",
						width : 156,
						name : "invoiceDescription",
						align : "left"
					}, {
						text : "Audience",
						dataIndex : "audience",
						width : 156,
						name : "audience",
						align : "left"
					}, {
						text : "LocationCode",
						dataIndex : "locationCode",
						width : 100,
						name : "locationCode",
						align : "left"
					}, {
						text : "WW Link",
						dataIndex : "wwLink",
						name : "wwLink",
						width : 100,
						align : "left"
					},{
						text : "UnspscCode",
						dataIndex : "unspscCode",
						width : 100,
						name : "unspscCode",
						align : "left"
					}, {
						text : "IAL Number",
						dataIndex : "ialNumber",
						width : 100,
						name : "ialNumber",
						align : "left"
					}, 
					// {text: "Model Name", dataIndex: "modelName",name:
					// "modelName", align: "center"},
					{
						text : "Last Modify",
						dataIndex : "updatedTime",
						width : 100,
						name : "updatedTime",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					}, {
						text : "Last Modify By",
						sortable : false,
						dataIndex : "updatedUserName",
						width : 156,
						name : "updatedByUser",
						align : "left"
					}, {
						text : "Create On",
						dataIndex : "createdTime",
						width : 100,
						name : "createdTime",
						align : "left",
						renderer : Ext.util.Format.dateRenderer('m/d/Y')
					}, {
						text : "Create By",
						sortable : false,
						dataIndex : "createdUserName",
						name : "createdByUser",
						width : 156,
						align : "left"
					}],
			viewConfig : {
				stripeRows : true
			}

		});
		
		var detailGrid = new Ext.grid.GridPanel({
					// autoHeight: true,
					// height :170,
					autoScroll : true,
					viewConfig : {
						stripeRows : true
					},
					columnLines : true,
					store : me.elementStore,
					bbar : elementPaginationBar,
					columns : [{
								text : 'Element Name',
								flex : 1,
								dataIndex : 'name'
							}, {
								text : 'Status',
								flex : 1,
								dataIndex : 'status'
							}, {
								text : 'Version',
								flex : 1,
								dataIndex : 'elementVersion'
							}, {
								text : 'Last Modify',
								flex : 1,
								dataIndex : 'updatedTime',
								name : 'updatedTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y H:i:s')

							}, {
								text : 'Last Modify By',
								flex : 1,
								dataIndex : 'updatedUserName',
								name : 'updatedBy'
							}, {
								text : 'Created On',
								flex : 1,
								dataIndex : 'createdTime',
								name : 'createdTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y H:i:s')
							}]

				});
		
		// init and apply all object
		var element_link_grid = Ext.createWidget('element_link_grid');
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
						items : [element_link_grid],
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

	SearchFlag : false,
    fromPH : '0',
	recordIds : [],
	createViewField : function(record,index){
			var vFlag = record.displayTplData[0].valueFlag;
			var fieldType = record.displayTplData[0].columnCode;
			if(index=='1'){
				attribute1ID = record.displayTplData[0].id;
				Ext.getCmp("valueFlag1").setValue(vFlag);
			}
			else if(index=='2'){
				attribute2ID = record.displayTplData[0].id;
				Ext.getCmp("valueFlag2").setValue(vFlag);
			}
			else if(index=='3'){
				attribute3ID = record.displayTplData[0].id;
				Ext.getCmp("valueFlag3").setValue(vFlag);
			}
			var valueCField = 'value'+index+'C';
			var valueTField = 'value'+index+'T';
			var valueDField = 'value'+index+'D';
			if(vFlag==3){
				if(fieldType.indexOf('Date') > -1 || fieldType.indexOf('updatedTime') > -1){
					Ext.getCmp(valueCField).hide();
				    Ext.getCmp(valueTField).hide();
				    Ext.getCmp(valueDField).show();
				}else{
					Ext.getCmp(valueCField).hide();
					Ext.getCmp(valueDField).hide();
				    Ext.getCmp(valueTField).show();
				}
			}
			else{												
				Ext.getCmp(valueTField).hide();
				Ext.getCmp(valueDField).hide();
				Ext.getCmp(valueCField).show();
			}
	},
	// load form query params
	onBeforeloadEvent : function(store) {
		// debugger
		var me = this;
		var store = me.store;
		if(me.fromPH=='0'){
			store.proxy.extraParams='';
			if (!me.SearchFlag) {
				me.setRecordIds(me.grid);
				var k = findForm.getValues();
				store.proxy.extraParams=k;
			} else {
				me.SearchFlag = false;
			}
		}
	},
	onUpdateLinksBeforeloadEvent : function(store) {
		this.updateLinksStore.proxy.extraParams.ctoIds = this.recordIds;
	},

	onElementBeforeloadEvent : function(store) {
		var offeringId = this.grid.getSelectionModel().selected.items[0]
				.get('id');
		this.elementStore.proxy.extraParams.offeringId = offeringId;
	},

	// select records after grid store loaded
	onStoreLoadEvent : function(store, records2, isSuccessful, operation) {
		// debugger
		var me = this;

		// if select the last record,It will appear "scrollerRight is null"
		// error
		// grid.body.unmask();
		Ext.Array.each(records2, function(record, i, all) {

					Ext.Array.each(me.recordIds, function(nid, i, all) {
								if (nid == record.get('id')) {
									me.grid.getSelectionModel().select(record,
											true, false);
									return false;
								}
							});

				});

	},

	onItemdblclick : function(me, record, item, index, e) {
		var grid = this.grid;
		var elementStore = this.elementStore;
		var ctoId = grid.getSelectionModel().selected.items[0].get('id');
		/*elementStore.on('beforeload', function() {
			var et = '../offering/searchElesByOfferId!findElementsByOfferingId.action';
			elementStore.proxy.url = et;
		});
		elementStore.load({
					params : {
						offeringId : ctoId
					}
				});*/
		//var link_grid =  Ext.ComponentQuery.query('element_link_grid')[0];
		var link_grid=this.items.items[1].items.items[0];
		link_grid.offeringId = record.data.id;
		link_grid.executeQuery();
	},

	// 创建一个store
	createStore : function() {

		this.store = new Ext.data.JsonStore({
					model : 'Ext.cto.manage.model',
					remoteSort : true,
					pageSize : 100,
					proxy : {
						type : 'ajax',
						url : '../cto/cto!findCtosByCondition.action',
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
	createAttributeValueStore : function() {
    this.attributeValueStore = new Ext.data.JsonStore({
					fields : ['value'],
					proxy : {
						type : 'ajax',
						url: '../offering/attribute!initAttriValueForUI.action',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
		});
	return this.attributeValueStore;
	},
	createAttributeNameStore : function() {
		this.attributeNameStore = new Ext.data.JsonStore({
					fields : ['id','showName', 'columnCode','valueFlag'],
					proxy : {
						type : 'ajax',
						url: '../offering/attribute!initAttributeForUI.action?objectType=CTO',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
		});
		return this.attributeNameStore;
	},
	createUpdateLinksStore : function() {
		var me = this;

		this.updateLinksStore = new Ext.data.JsonStore({
					model : 'Ext.cto.manage.model',
					remoteSort : true,
					pageSize : 100,
					proxy : {
						type : 'ajax',
						url : '../cto/cto!findCtosByCondition.action?ctoIds='
								+ me.recordIds,
						reader : {
							type : 'json',
							root : 'results',
							totalProperty : 'totalCount'
						},
						simpleSortMode : true
					}
				});

		return this.updateLinksStore;
	},

	createElementStore : function() {
		var grid = this.grid;
		this.elementStore = new Ext.data.JsonStore({
			fields : ['id', 'name', 'status', 'elementVersion', 'updatedTime',
					'updatedUserName', 'createdTime'],
			pageSize : 100,
			remoteSort : true,
			proxy : {
				type : 'ajax',
				url : '../offering/searchElesByOfferId!findElementsByOfferingId.action',
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

	createCtoElementStore : function() {
		this.ctoElementStore = Ext.create('Ext.data.Store', {
			fields : ['id', 'name', 'status', 'elementVersion', 'updatedTime',
					'updatedUserName', 'createdTime'],
			pageSize : 100,
			proxy : {
				type : 'ajax',
				url : '../offering/searchElesByOfferId!findElementsByOfferingId.action',
				reader : {
					type : 'json',
					root : 'results',
					totalProperty : 'totalCount'
				}
			}
		});

		return this.ctoElementStore;
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
						url : '../cto/cto!listAllResults.action',
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
						url : '../offering/updateLinks!validateLinksByExcel.action',
						params : {
							status : versionType
						},
						waitMsg : 'Validate file...',
						success : function(response, option) {
							var fileName = option.result.fileName;
							var status = option.result.status;
							if (fileName == 'null') {
								Ext.Msg.alert("error", "file is invalid.");
							}
							if (status == 'no') {
								linkId = option.result.linkId;
								msgStore.removeAll();
								Ext.Msg.alert("message", "click continue!");
								Ext.getCmp("continue").show();
								Ext.getCmp("upload").hide();
							}
							if (status == 'yes') {
								message = option.result.message;
								msgStore.on('beforeload', function() {
									var et = '../cto/cto!listAllResult.action?message='
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
					var versionType;
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
							// Ext.Ajax.request({
							url : '../offering/updateLinks!validateCheckOutStatus.action',
							params : {
								linkId : linkId,
								status : versionType
							},
							success : function(response, option) {
								var status = option.result.status;
								var fileName = option.result.fileName;
								
								var grid = Ext.ComponentQuery.query('CTO-management')[0];
								grid.store.load();
								if (fileName != 'undefined') {
									if (fileName == 'null') {
										Ext.Msg.alert("error",
												"File is invalid.");
									}
								}
								if (status == 'warn') {
									message = option.result.message;
									msgStore.on('beforeload', function() {
										var et = '../offering/updateLinks!listAllResult.action?message='
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
						url : '../cto/cto!listAllResults.action',
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
						Ext.Msg.alert("empty", "file is invalid.");
						return;
					}
					var form = excelForm.getForm();
					form.submit({
						// recordIds=new Array();
						url : '../cto/ctoLink!validateAttributesFromExcel.action',
						waitMsg : 'Validate file...',
						timeout : 120000,
						success : function(response, option) {
							var status = option.result.status;
							if (status == 'no') {
								linkId = option.result.linkId;
								Ext.Msg.alert("message", "click continue!");
								Ext.getCmp("continue1").show();
								Ext.getCmp("upload1").hide();
							}
							message = option.result.message;
							if (message != undefined) {
								msgStore2.on('beforeload', function() {
									var et = '../cto/cto!listAllResult.action?message='
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
							url : '../cto/ctoLink!saveAttributesFromExcel.action',
							params : {
								linkId : linkId,
								status : 0
							},
							success : function(response, opt) {
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

	setRecordIds : function(grid) {
		// debugger
		var recordIds = this.recordIds;

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

		var ctoElementGrid = new Ext.grid.GridPanel({
			autoScroll : true,
			layout : 'fit',
			store : me.ctoElementStore,
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
						text : 'Cto Number:'
					}, {
						xtype : 'textfield',
						id : "tf_cto_number",
						hideLabel : true,
						allowBlank : false,
						width : 200
					}, {
						text : 'Submit',
						iconCls : 'icon-checkin',
						disabled : false,
						id : 'btn_country_submit',
						handler : function() {
							var tf_field = Ext.getCmp("tf_cto_number");
							if (Ext.getCmp("tf_cto_number").getValue() == s_number) {
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
									url : '../cto/cto!saveAs.action',
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
											saveAsWin.hide();
										}

									},
									failure : function() {
										Ext.MessageBox.show({
													title : 'Message',
													msg : 'Submit Error!',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});

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
				        pageSize:100,
						store : me.ctoElementStore,
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
					items : [ctoElementGrid]
				});

		return saveAsWin;

	},

	commonCheckOut : function(ids) {
		Ext.Ajax.request({
					url : '../cto/cto!commonCheckOut.action',
					method : 'POST',
					params : {
						ids : ids
					},
					success : function(response, config) {

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
	},

	updateLinksWin : function() {
		var me = this;
		var updateLinksForm = Ext.create('Ext.form.FormPanel', {
			height : 170,
			// autoHeight: true,
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
								name : "fileName",
								id : "fileName"
							}, {
								fieldLabel : "Element Name",
								name : "elementName",
								id : "elementName"
							}, {
								fieldLabel : "Upload File",
								xtype : 'filefield',
								emptyText : 'Select a file ...',
								name : 'uploadFile',
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
			buttons : [

			{
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
						elementName = elementName.replace('"', '&#34;');
						// form.standardSubmit = true;
						form.submit({
							url : '../offering/updateLinksSearch!downLinksToExcel.action?offeringType=CTO&offeringIds='
									+ me.recordIds
									+ '&elementName1='
									+ elementName,
							method : 'POST',
							success : function(form, action) {
								updateLinksWin.close();
							},
							failure : function() {
								Ext.Msg.alert("error", "sorry,error message!");
							}
						});
					}
				}
			}]
		});
		
		var updateLinksBottomBar = Ext.create('App.PagingToolbar', {
			        pageSize:100,
					store : me.updateLinksStore,
					displayInfo : true
				});
		// adhoc param
		var adhocCtoNumber;
		var adhocProjectName;
		/*
		 * add by liujh 2012-08-13  bugid: 568    start
		 */
		var adhocAttribute1Name;
		var adhocAttribute1Value;
		var adhocValueD1From;
		var adhocValueD1To;
		var adhocValueFlag1;
		var adhocAttribute2Name;
		var adhocAttribute2Value;
		var adhocValueD2From;
		var adhocValueD2To;
		var adhocValueFlag2;
		var adhocAttribute3Name;
		var adhocAttribute3Value;
		var adhocValueD3From;
		var adhocValueD3To;
		var adhocValueFlag3;
		/*
		 * bugid: 568 end
		 */
		var updateLinksGrid = new Ext.grid.GridPanel({
					height : 300,
					// autoHeight: true,
					layout : 'fit',
					store : me.updateLinksStore,
					autoScroll : true,
					// bbar: updateLinksBottomBar,
					columns : [/* new Ext.grid.RowNumberer(), */{
								dataIndex : "id",
								hidden : true
							}, {
								text : 'CTO Number',
								flex : 1,
								dataIndex : 'number',
								name : 'number'
							}, {
								text : 'CTO Name',
								flex : 1,
								dataIndex : 'name',
								name : 'name'
							}, {
								text : 'Status',
								flex : 1,
								dataIndex : 'status',
								name : 'status'
							}, {
								text : 'Version',
								flex : 1,
								dataIndex : 'offeringVersion',
								name : 'offeringVersion'
							}, {
								text : 'Last Modify',
								flex : 1,
								dataIndex : 'updatedTime',
								name : 'updatedTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y H:i:s')

							}, {
								text : 'Last Modify By',
								flex : 1,
								dataIndex : 'updatedUserName',
								name : 'updatedBy'
							}, {
								text : 'Created On',
								flex : 1,
								dataIndex : 'createdTime',
								name : 'createdTime',
								renderer : Ext.util.Format
										.dateRenderer('m/d/Y H:i:s')
							}]
				});
		
		var elementsList = Ext.createWidget('elementsList', {
					isShowTbar : false,
					objectType : 'CTO'
				});

		var updateLinksWin = new Ext.Window({
					layout : 'border',
					width : 600,
					height : 300,
					closable : true,
					closeAction : 'destroy',
					items : [{
								region : 'center',
								layout : 'border',
								border : false,
								constrain : true,
								items : [

								{
											region : 'center',
											layout : "fit",
											// split : true,
											items : [updateLinksForm]
										}, {
											region : 'south',
											height : 300,
											// split : true,
											collapsible : true,
											items : [updateLinksGrid]
										}]
							}]
				});

		return updateLinksWin;
	},
	checkCheckOutStatus : function(ids) {
		var me = this;
		var flag = '';
		Ext.Ajax.request({
					url : '../offering/checkOut!checkCheckOutStatus.action',
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
	createToolbar : function() {
		var me = this;
	
		var toolbar = Ext.create('widget.toolbar', {
			layout : {
				overflowHandler : 'Menu'
			},
			items : [{
				text : '<b>Search</b>',
				iconCls : 'icon-search',
				disabled : Ext.LOIS.isEnable('cto_management_search'),
				id : 'cto_management_search',
				handler : function() {
					// debugger
					me.recordIds = [];
					Ext.Array.clean(me.recordIds);
					var obj = Ext.ComponentQuery.query('CTO-management')[0];
					obj.recordIds = [];
					Ext.Array.clean(obj.recordIds);
					me.SearchFlag = true;

					findForm = Ext.create('Ext.form.FormPanel', {
						frame : true,
						border : false,
						bodyPadding : 5,
						autoRender:true,
						autoShow:true,
						defaults : {
							anchor : '100%',
							allowBlank : false,
							msgTarget : 'side',
							labelWidth : 160
						},
						fieldDefaults : {
							labelAlign : 'right',
							labelWidth : 120
						},
						layout : 'anchor',
							defaults : {
								border : false,
								anchor : '100%'
							},
						items : [{
									xtype : 'container',
									layout : 'hbox',
									items : [{
												fieldLabel : "Project Name",
												name : "projectName",
												id : "projectName",
												xtype : "textfield"
											}, {
												fieldLabel : "CTO Number",
												name : "ctoNumber",
												id : "ctoNumber",
												xtype : "textfield"
											}] 
								},
							    {
									xtype : 'container',
									layout : 'hbox',
									items : [{
												fieldLabel : "Attribute1Name",
												xtype : 'combobox',
												name : "attribute1Name",
												id : "attribute1Name",
												allowBlank : true,
												store : me.attributeNameStore,
											    valueField : 'columnCode',
												displayField : 'showName',
												emptyText : 'Select a attribute...',
												selectOnFocus:true,
												autoDestroy: true,
												editable:true,
												listeners : {
																'select' : function(record, v, index) {
																	me.createViewField(record,'1');
																}
												}
											}, {
											xtype : 'container',
											items : [{
															xtype : "hidden",
															name : "attribute1Value",
															id:"attribute1Value"
														  },{
												fieldLabel : "Attribute1Value",
												name : "value1C",
												id : "value1C",
												xtype : 'combobox',
												allowBlank : true,
												store : me.attributeValueStore,
												valueField : 'value',
												displayField : 'value',
												emptyText : 'Select a value...',
												selectOnFocus:true,
												editable:true,
												hidden:true,
												//autoLoad: true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute1Value").setValue(v);												
																},'expand': function(fb, v) {
																	if(attribute1ID!='0'){
																	  me.attributeValueStore.load({
																								params : {
																									attributeID : attribute1ID
																								}
																							});
																	}
																},'focus':function(e){
																	e.expand();
																}
															}
											    },
											    {
												fieldLabel : "Attribute1Value",
												name : "value1T",
												id : "value1T",
												xtype : 'textfield',
												hidden:false,
												allowBlank : true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute1Value").setValue(v);												
																}
															}
											    }
											    ]
											}]
									},
									{
									xtype : "container",
									layout : "hbox",
									defaultType : "datefield",
									name : "value1D",
								    id : "value1D",
								    hidden:true,
									items : [{
												fieldLabel : "From",
												name : "valueD1From",
												id : "valueD1From",
												vtype : "daterange",
												format : "Y-m-d",
												endDateField : "valueD1To",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute1Value").setValue('DATEVALUE');												
																}
															}
											}, {
												fieldLabel : "To",
												name : "valueD1To",
												id : "valueD1To",
												vtype : "daterange",
												format : "Y-m-d",
												startDateField : "valueD1From",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute1Value").setValue('DATEVALUE');												
																}
															}
											}]
								}
								, {
									xtype : 'container',
									layout : 'hbox',
									items : [{
												fieldLabel : "Attribute2Name",
												xtype : 'combobox',
												name : "attribute2Name",
												id : "attribute2Name",
												allowBlank : true,
												store : me.attributeNameStore,
											    valueField : 'columnCode',
												displayField : 'showName',
												emptyText : 'Select a attribute...',
												selectOnFocus:true,
												editable:true,
												listeners : {
																'select' : function(record, v, index) {
																	me.createViewField(record,'2');
																}
												}
											}, {
											xtype : 'container',
											items : [{
															xtype : "hidden",
															name : "attribute2Value",
															id:"attribute2Value"
														  },{
												fieldLabel : "Attribute2Value",
												name : "value2C",
												id : "value2C",
												xtype : 'combobox',
												allowBlank : true,
												store : me.attributeValueStore,
												valueField : 'value',
												displayField : 'value',
												emptyText : 'Select a value...',
												selectOnFocus:true,
												editable:true,
												hidden:true,
												//autoLoad: true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute2Value").setValue(v);
																},'expand': function(fb, v) {
																	if(attribute2ID!='0'){
																	  me.attributeValueStore.load({
																								params : {
																									attributeID : attribute2ID
																								}
																							});
																	}
																},'focus':function(e){
																	e.expand();
																	}
															}
											    },
											    {
												fieldLabel : "Attribute2Value",
												name : "value2T",
												id : "value2T",
												xtype : 'textfield',
												hidden:false,
												allowBlank : true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute2Value").setValue(v);												
																}
															}
											    }]
											}]
								},
								{
									xtype : "container",
									layout : "hbox",
									defaultType : "datefield",
									name : "value2D",
								    id : "value2D",
								    hidden:true,
									items : [{
												fieldLabel : "From",
												name : "valueD2From",
												id : "valueD2From",
												vtype : "daterange",
												format : "Y-m-d",
												endDateField : "valueD2To",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute2Value").setValue('DATEVALUE');												
																}
															}
											}, {
												fieldLabel : "To",
												name : "valueD2To",
												id : "valueD2To",
												vtype : "daterange",
												format : "Y-m-d",
												startDateField : "valueD2From",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute2Value").setValue('DATEVALUE');												
																}
															}
											}]
								}
								, {
									xtype : 'container',
									layout : 'hbox',
									items : [{							
												fieldLabel : "Attribute3Name",
												xtype : 'combobox',
												name : "attribute3Name",
												id : "attribute3Name",
												allowBlank : true,
												store : me.attributeNameStore,
											    valueField : 'columnCode',
												displayField : 'showName',
												emptyText : 'Select a attribute...',
												selectOnFocus:true,
												editable:true,
												listeners : {
																'select' : function(record, v, index) {
																	me.createViewField(record,'3');
																}
												}
											}, {
											xtype : 'container',
											items : [{
															xtype : "hidden",
															name : "attribute3Value",
															id:"attribute3Value"
														  },{
												fieldLabel : "Attribute3Value",
												name : "value3C",
												id : "value3C",
												xtype : 'combobox',
												allowBlank : true,
												store : me.attributeValueStore,
												valueField : 'value',
												displayField : 'value',
												emptyText : 'Select a value...',
												selectOnFocus:true,
												editable:true,
												hidden:true,
												//autoLoad: true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute3Value").setValue(v);
																},'expand': function(fb, v) {
																	if(attribute3ID!='0'){
																	  me.attributeValueStore.load({
																								params : {
																									attributeID : attribute3ID
																								}
																							});
																	}
																},'focus':function(e){
																	e.expand();
																}
															}
											    },
											    {
												fieldLabel : "Attribute3Value",
												name : "value3T",
												id : "value3T",
												xtype : 'textfield',
												hidden:false,
												allowBlank : true,
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute3Value").setValue(v);												
																}
															}
											    }]
											}]
								},
								{
									xtype : "container",
									layout : "hbox",
									defaultType : "datefield",
									name : "value3D",
								    id : "value3D",
								    hidden:true,
									items : [{
												fieldLabel : "From",
												name : "valueD3From",
												id : "valueD3From",
												vtype : "daterange",
												format : "Y-m-d",
												endDateField : "valueD3To",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute3Value").setValue('DATEVALUE');												
																}
															}
											}, {
												fieldLabel : "To",
												name : "valueD3To",
												id : "valueD3To",
												vtype : "daterange",
												format : "Y-m-d",
												startDateField : "valueD3From",
												listeners : {
																'change' : function(fb, v) {
																	Ext.getCmp("attribute3Value").setValue('DATEVALUE');												
																}
															}
											}]
								},{
									xtype : 'container',
									layout : 'hbox',
									items : [{
												name : "valueFlag1",
												id : "valueFlag1",
												xtype : "hidden"
											}, {
												name : "valueFlag2",
												id : "valueFlag2",
												xtype : "hidden"
											},{
												name : "valueFlag3",
												id : "valueFlag3",
												xtype : "hidden"
											}] 
								}],
						buttons : [{
							text : "Search",
							iconCls : 'icon-search',
							handler : function() {
								adhocProjectName = '';
								adhocProductHierarchy = '';
								me.fromPH='0';
								var elementStore = me.elementStore;
								elementStore.removeAll();
								var projectName = Ext.getCmp('projectName')
										.getValue();
								adhocProjectName = projectName;
								var ctoNumber = Ext.getCmp('ctoNumber')
										.getValue();
								adhocCtoNumber = ctoNumber;
								/*
								 * add by liujh 2012-08-13 bugid: 568 start
								 */
								adhocAttribute1Name = Ext.getCmp('attribute1Name').getValue();
								adhocAttribute1Value = Ext.getCmp('attribute1Value').getValue();
								adhocValueD1From = Ext.getCmp('valueD1From').getValue();
								adhocValueD1To = Ext.getCmp('valueD1To').getValue();
								adhocValueFlag1 = Ext.getCmp('valueFlag1').getValue();
								adhocAttribute2Name = Ext.getCmp('attribute2Name').getValue();
								adhocAttribute2Value = Ext.getCmp('attribute2Value').getValue();
								adhocValueD2From = Ext.getCmp('valueD2From').getValue();
								adhocValueD2To = Ext.getCmp('valueD2To').getValue();
								adhocValueFlag2 = Ext.getCmp('valueFlag2').getValue();
								adhocAttribute3Name = Ext.getCmp('attribute3Name').getValue(); 
								adhocAttribute3Value = Ext.getCmp('attribute3Value').getValue();
								adhocValueD3From = Ext.getCmp('valueD3From').getValue();
								adhocValueD3To = Ext.getCmp('valueD3To').getValue();
								adhocValueFlag3 = Ext.getCmp('valueFlag3').getValue();
								/*
								 * bug 568 end
								 */
								var k = findForm.getValues();
								var et = '../cto/cto!findCtosByCondition.action';
								me.store.proxy.url = et;
								me.store.currentPage = 1;
								me.store.load({
												params: k,
												targetPageNo : 1,
												currentPageNo : 1,
												paginationAction : "first",
												currentPage : 1,
												page : 1,
												start : 0,
												limit : 20
										});
								win.hide();
							}
						}, {
							text : 'Cancel',
							iconCls : 'icon-cancel',
							handler : function() {
								win.hide();
							}
						}]
					});
					var win = new Ext.Window({
								layout : 'fit',
								width : 600,
								title : 'CTO Search Criteria',
								height : 300,
								//closable : true,
								closeAction : 'destroy',
								constrain : true,
								modal : true,
								autoRender : true,
								items : [findForm]
							});
					win.show();
					/*
					 * var win = new Ext.Window({ layout : 'fit', width : 600,
					 * title : 'please input', height : 450, closeAction :
					 * 'hide', constrain:true, items : [findForm] });
					 * win.show();
					 */
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
						disabled : Ext.LOIS
								.isEnable('cto_management_attribute_ui'),
						id : 'cto_management_attribute_ui',
						handler : function() {
							me.setRecordIds(me.grid);
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							
								if (me.grid.getSelectionModel().hasSelection()) {
									var records = me.grid.getSelectionModel()
											.getSelection();
									var ids = [];
									
									Ext.Array.each(records,
											function(record, i, all) {
												ids.push(record.get('id'));
											});
									var res =me.checkCheckOutStatus(me.recordIds);//ids->me.recordIds
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some CTOs is being check out by other people.',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
													return false;
									} else if (res == true) {		
									var win = Ext.createWidget('attributeEdit', {
												ids : me.recordIds, //ids->me.recordIds
												type : 'CTO'
											});
									win.show();
								}
							}
						}
					}, {
						text : 'Edit Attribute (Loadsheet)',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('cto_management_attribute_excel'),
						id : 'cto_management_attribute_excel',
						handler : function() {
							me.setRecordIds(me.grid);
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								var res =me.checkCheckOutStatus(me.recordIds);
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some MTMs is being check out by other people.',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
													return false;
									} else if (res == true) {		
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
										var form = editForm.getForm();
										form.standardSubmit = true;
										form.submit({
											url : '../cto/cto!editAttributes.action?ctoIds='
													+ me.recordIds,
											method : 'POST',
											success : function(form, action) {
											}
										});
								}
							}
						}
					}, {
						text : 'Country Attribute',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('cto_management_country_attribute'),
						id : 'cto_management_country_attribute',
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
							var res =me.checkCheckOutStatus(ids);
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some CTOs is being check out by other people.',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-error'
													});
													return false;
									} else if (res == true) {	
										var obj = Ext.createWidget('CTO-listCountrys', {
													ids : ids
												}, {
													isCheckOut : 'y'
												});
										obj.show();
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
								.isEnable('cto_management_updateLink_ui'),
						id : 'cto_management_updateLink_ui',
						handler : function() {
							me.setRecordIds(me.grid);
							if (me.recordIds == '') {
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
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew.html?objectType=cto"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
							}
						}
					}, {
						text : 'Download Element Links',
						iconCls : 'icon-menu-node',
						/*disabled : Ext.LOIS
								.isEnable('download_elementlink_sheet'),*/
						id : 'download_elementlink_sheet',
						handler : function() {
							me.setRecordIds(me.grid);
							if (me.recordIds == "") {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								selectedIds = me.recordIds;
								enhanceWinPanel = new Ext.Window({
									title : 'Download Element Links',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew2.html?objectType=cto"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
							}
						}
					}]
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
						disabled : Ext.LOIS
								.isEnable('cto_management_attribute_loadsheet'),
						id : 'cto_management_attribute_loadsheet',
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
							         width:550,
				                     height:450,
									 constrain:true,
									 modal : true,
									 closable: true,
									 items : [],
									 html:' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=ctoattribute&userId='+userId+'"> </iframe>'
				            });
				            enhanceWinPanel.show();
							//var win = me.excelWin();
							//win.show();
						}
					}, {
						text : 'Element Link Loadsheet',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('cto_management_elementLink_loadsheet'),
						id : 'cto_management_elementLink_loadsheet',
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
							//var win = me.loadLinksWin();
							//win.show();
							enhanceWinPanel = new Ext.Window({
								 title : 'load update links',
						         width:550,
			                     height:450,
								 constrain:true,
								 modal : true,
								 closable: true,
								 items : [],
								 html:' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=ctoelement&userId='+userId+'"> </iframe>'
							});
							enhanceWinPanel.show();
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
						text : 'Save As',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('cto_management_more_saveAs'),
						id : 'cto_management_more_saveAs',
						handler : function() {
							var grid = me.grid;
							var saveAsWin = me.saveAsWin();
							var ctoElementStore = me.ctoElementStore;

							if (grid.getSelectionModel().selected.items.length != 1) {
								Ext.Msg.alert("error",
										"please select one record!");
								return false;
							} else {

								s_id = grid.getSelectionModel().selected.items[0]
										.get('id');
								s_number = grid.getSelectionModel().selected.items[0]
										.get('number');
								ctoElementStore.on('beforeload', function() {
									ctoElementStore.getProxy().extraParams.offeringId = s_id;
								});
								ctoElementStore.load();
							}
							saveAsWin.show();
						}
					},{
						text : 'Promote',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('cto_management_more_promote'),
						id : 'cto_management_more_promote',
						handler : function(){	
							var grid = me.grid;
							var offeringIds='';
							
							if (grid.getSelectionModel().selected.items.length <=0) {
								Ext.Msg.alert('Message', 'please select some items.');
								return false;
							}
							var records = grid.getSelectionModel()
															.selected.items;
							for(var i=0;i<records.length;i++){
								if(i!=records.length-1){
									offeringIds+=records[i].get('id')+',';
								}else{
									offeringIds+=records[i].get('id');
								}
							} 
						 var url = '../basic/PromoteOffering.html?offeringIds='+offeringIds;	 
						 var vp =window.parent.vp;
						 var urlMap=window.parent.urlMap;
						 var ctoId = urlMap.get('../basic/PromoteOffering.html');
				         var center = vp.getComponent('center-tabs');
					     var tab_n = center.getActiveTab(ctoId);
					     var tt=   Ext.getCmp(ctoId);
					     Ext.Msg.confirm("Promote Searching",
						  	"The Offerings listing on Offering Promote page will be refreshed by the selected Offerings,do you want to go on?",
						  	function(btn){ 
	                        if (btn == 'yes'){ 
	                        		if(tt==undefined){
					        	tab_n =  center.add({		 
								 title:'Offering Promote',
								 iconCls: 'tabs',
								 id:ctoId,
								 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
								 closable: true
								 });
								 center.setActiveTab(tab_n);
					        }else{
					           center.remove(tt);					
					           tt=center.add({		 
								 title:'Offering Promote',
								 iconCls: 'tabs',
								 id:ctoId,
								 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
								 closable: true
					           });
					           center.setActiveTab(tt);
					        }   
                         } 
                        else{ 
                            return false; 
                            }	 });
					     
						}
					},{
						text : 'CTO Adhoc Report',
						iconCls : 'icon-menu-node',
						handler : function() {
							var grid = me.grid;
							if (grid.getStore().getCount() == 0) {
								Ext.MessageBox.alert("Message",
										"there is no data");
								return false;
							}
							Ext.Ajax.request({
							url : '../offering/offeringAdhocReport!checkCtoAdhocReportCount.action',

								timeout : 1800000,
								async : false,
								params : {
									projectName : adhocProjectName,
									offeringNumber : adhocCtoNumber,
									hierarchyCode : adhocProductHierarchy,
									/*
									 * add by liujh 2012-08-13 bugId: 568 start
									 */
									attribute1Name :  adhocAttribute1Name,   
									attribute1Value : adhocAttribute1Value,  
									valueD1From :     adhocValueD1From,      
									valueD1To :       adhocValueD1To,        
									valueFlag1 :      adhocValueFlag1,       
									attribute2Name :  adhocAttribute2Name,   
									attribute2Value : adhocAttribute2Value,  
									valueD2From :     adhocValueD2From,      
									valueD2To :       adhocValueD2To,        
									valueFlag2 :      adhocValueFlag2,       
									attribute3Name :  adhocAttribute3Name,   
									attribute3Value : adhocAttribute3Value,  
									valueD3From :     adhocValueD3From,      
									valueD3To :       adhocValueD3To,        
									valueFlag3 :      adhocValueFlag3,       
									/*
									 * bugID: 568 end
									 */
								    type:'CTO'
								},
								success : function(response, option) {
									var jsonMessage = Ext
											.decode(response.responseText);
									message = jsonMessage.msg;
									var adhocCount = jsonMessage.adhocCount;
									if (message == 'F') {
										if (!Ext.fly('CTOAdhocReport')) {
											var frm = document
													.createElement('form');
											frm.id = 'CTOAdhocReport';
											frm.name = id;
											frm.className = 'x-hidden';
											document.body.appendChild(frm);
										}

										Ext.Ajax.request({
											url : '../offering/offeringAdhocReport!exportAdhocReport.action',
											method : 'POST',
											form : Ext.fly('CTOAdhocReport'),
											isUpload : true,
											params : {
												projectName : adhocProjectName,
												offeringNumber : adhocCtoNumber,
												hierarchyCode : adhocProductHierarchy,
												/*
												 * add by liujh 2012-08-13 bugId: 568 start
												 */
												attribute1Name :  adhocAttribute1Name,   
												attribute1Value : adhocAttribute1Value,  
												valueD1From :     adhocValueD1From,      
												valueD1To :       adhocValueD1To,        
												valueFlag1 :      adhocValueFlag1,       
												attribute2Name :  adhocAttribute2Name,   
												attribute2Value : adhocAttribute2Value,  
												valueD2From :     adhocValueD2From,      
												valueD2To :       adhocValueD2To,        
												valueFlag2 :      adhocValueFlag2,       
												attribute3Name :  adhocAttribute3Name,   
												attribute3Value : adhocAttribute3Value,  
												valueD3From :     adhocValueD3From,      
												valueD3To :       adhocValueD3To,        
												valueFlag3 :      adhocValueFlag3,       
												/*
												 * bugID: 568 end
												 */
								    			type:'CTO'
											}
										})
									
									} else if (message == 'T') {
										Ext.Msg.confirm('infomation', 'Data has more than ' + adhocCount + ', the system can only export ' + adhocCount + ' before the data,are you sure?', function(btn) {
											if (btn == 'yes') {											
												if (!Ext.fly('CTOAdhocReport')) {
												var frm = document.createElement('form');
												frm.id = 'CTOAdhocReport';
												frm.name = id;
												frm.className = 'x-hidden';
												document.body.appendChild(frm);
										}

										Ext.Ajax.request({
											url : '../offering/offeringAdhocReport!exportAdhocReport.action',
											method : 'POST',
											form : Ext.fly('CTOAdhocReport'),
											isUpload : true,
											params : {
												projectName : adhocProjectName,
												offeringNumber : adhocCtoNumber,
												hierarchyCode : adhocProductHierarchy,
												/*
												 * add by liujh 2012-08-13 bugId: 568 start
												 */
												attribute1Name :  adhocAttribute1Name,   
												attribute1Value : adhocAttribute1Value,  
												valueD1From :     adhocValueD1From,      
												valueD1To :       adhocValueD1To,        
												valueFlag1 :      adhocValueFlag1,       
												attribute2Name :  adhocAttribute2Name,   
												attribute2Value : adhocAttribute2Value,  
												valueD2From :     adhocValueD2From,      
												valueD2To :       adhocValueD2To,        
												valueFlag2 :      adhocValueFlag2,       
												attribute3Name :  adhocAttribute3Name,   
												attribute3Value : adhocAttribute3Value,  
												valueD3From :     adhocValueD3From,      
												valueD3To :       adhocValueD3To,        
												valueFlag3 :      adhocValueFlag3,       
												/*
												 * bugID: 568 end
												 */
								    			type:'CTO'
											}
										})	
											}
										});  
									}
								},
								failure : function() {
									Ext.Msg
											.alert("Information",
													"Export cto adhoc report failed!");
								}
							});
						}
					},{
						text : 'Country Report',
						iconCls : 'icon-menu-node',
						//disabled:  Ext.LOIS.isEnable('mtm_wc_download'),
						id : 'mtm_wc_download',
						handler : function() {
							var idStr="";
							var ids = [];
							me.grid.store.each(function(record) {
										ids.push(record.get('id'));
										idStr=idStr+record.get('id')+",";
									});
							
								
								
							if (!Ext.fly('frmDummy_down')) {
									Ext.getBody().createChild({
										tag : 'form',
										id : 'frmDummy_down'
											//html: '<div>...</div>'
										});
									Ext.fly('frmDummy_down').className = 'x-hidden';
						   }
						   
						   if(ids.length==0){
						      Ext.Msg.alert("info","This is No Record!");
						      return;
						   }

							Ext.Ajax.request({
								url : '../mtm/wcPor!countryLinkDownloadExcelByAttribute.action',
								method : 'POST',//here must be get,or else could not convert ids
								isUpload : true,
								form : Ext.fly('frmDummy_down'),
								params : {
									idStr : idStr
								},
								success : function(response, config) {
									var res = Ext.JSON.decode(response.responseText);
									if (res.msg) {
										Ext.MessageBox.show({
											title : 'Message',
											msg : res.msg,
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-info'
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
							Ext.fly('frmDummy_down').destroy();
							
						}
					},
                    {
                    	text : 'View Translation',
    					iconCls : 'icon-menu-node',		
    					//disabled : Ext.LOIS.isEnable('view_cto_translation'),
    					id : 'view_cto_translation',
    					handler : function() {

							me.setRecordIds(me.grid);
							if (me.recordIds == '') {
								Ext.Msg.alert('empty',
										'please select some items22.');
								return false;
							}

							var ids = [];
							var grid = me.grid;
							for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
								ids
										.push(grid.getSelectionModel().selected.items[i]
												.get('id'));
							}

							enhanceWinPanel = new Ext.Window({
								title : 'View Translation',
								width : 1000,
								height : 700,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=CTO&viewOrEdit=view&recordIds=' + ids +'"> </iframe>',
								buttons : []
							});
							enhanceWinPanel.show();
//							var res =me.checkCheckOutStatus(ids);
//									if (res == false) {
//													Ext.MessageBox.show({
//														title : 'Message',
//														msg : 'Checkout Error!Some CTOs is being check out by other people.',
//														buttons : Ext.MessageBox.OK,
//														icon : 'ext-mb-error'
//													});
//													return false;
//									} else if (res == true) {
//										enhanceWinPanel = new Ext.Window({
//											title : 'View Translation',
//											width : 1000,
//											height : 700,
//											constrain : true,
//											modal : true,
//											closable : true,
//											items : [],
//											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=CTO&viewOrEdit=view&recordIds=' + ids +'"> </iframe>',
//											buttons : []
//										});
//										enhanceWinPanel.show();
//										//obj.hide();
//							}
    						
    					}
                    	
                    },                    
                    {
                        text : 'Edit Translation Value',
                        iconCls : 'icon-menu-node',
                        id : 'cto_management_manuallyTranslation_ui',
                        disabled : Ext.LOIS
                                .isEnable('cto_management_manuallyTranslation_ui'),
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
									var res =me.checkCheckOutStatus(ids);
									if (res == false) {
													Ext.MessageBox.show({
														title : 'Message',
														msg : 'Checkout Error!Some CTOs is being check out by other people.',
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
											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=CTO&viewOrEdit=edit&recordIds=' + ids +'"> </iframe>',
											buttons : []
										});
										enhanceWinPanel.show();
									}
									
								}
							
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
//                                        this.objectTypeForEditTrans = 'CTO';
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
                    }]
				}
			}, {
				xtype : "tbseparator"
			},
					 {
						text : '<b>Undo</b>',
						iconCls : 'icon-edit',
						disabled : Ext.LOIS
								.isEnable('cto_offering_attribute_undo'),
						id : 'cto_offering_attribute_undo',
						handler : function() {
							var records = me.grid.getSelectionModel()
										.getSelection();
								var ids = [];
								Ext.Array.each(records,
										function(record, i, all) {
											var checkOut = record.get('checkOutUserName');
											if(checkOut!=null){
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
									type: 'CTO'
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
				this.elementStore, this.ctoElementStore, this.form, this.grid,
				this.contextMenu,this.attributeNameStore,this.attributeValueStore);
		this.callParent();
		this.callParent(arguments)
	}

});