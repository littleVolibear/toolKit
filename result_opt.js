var phForXml, offeringLinkForXml, ocmFlexPanel;
var findParticipator=null;
Ext.Loader.setConfig({
			enabled : true
		});
Ext.Loader.setPath('Ext.optsrv.js.optsrv', '../optsrv/js/js.optsrv');
Ext.Loader.setPath('Ext.element.js', '../element/js');
Ext.Loader.setPath('Ext.optsrv.js.attribute', '../optsrv/js/attribute');

Ext.require(['Ext.element.js.elementsList',
		'Ext.optsrv.js.optsrv.commonWindow', 'Ext.optsrv.js.attribute.edit',
		'Ext.optsrv.js.optsrv.ListCountrys','Ext.mtm.WC.manage.linkFacet',
		'Ext.optsrv.js.optsrv.ListFacet']);
var selectedIds = '';
Ext.define('Ext.optsrv.js.search.result', {
	extend : 'Ext.grid.Panel',
	height : "100%",
	alias : 'widget.searchressult',
	// ---- flex attr start
	elementsStr : '',

	search : '0',

	elementTypesStr : '',

	objectsStr : '',

	objectType : '',
	
	// ---- flex UI, edit translation start
	elementsStrForEditTrans : '',

	elementTypesStrForEditTrans : '',

	objectsStrForEditTrans : '',

	objectTypeForEditTrans : '',
	// ----- flex UI, edit translation start
	
	queryParams : {},
	// ----- flex attr end
	initComponent : function() {

		var me = this;
		this.ids = [];
		this.global = this;
		this.idsReport = [];
		var rowNum = new Ext.grid.RowNumberer();
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
				for (var i = 2; i < me.columns.length; i++) {
					if ((me.columns[i].text != '')
							&& (includeHidden || !me.columns[i].isHidden())) {
						var w = me.columns[i].getWidth()
						totalWidthInPixels += w;
						if (me.columns[i].text == '') {
							cellType.push("None");
							cellTypeClass.push("");
							++visibleColumnCountReduction;
						} else {
							colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="'
									+ w + '" />';
							headerXml += '<ss:Cell ss:StyleID="headercell">'
									+ '<ss:Data ss:Type="String">'
									+ me.columns[i].text
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
						+ 'optsrv data'
						+ '">'
						+ '<ss:Names>'
						+ '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\''
						+ 'optsrv data'
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
					for (var j = 2; j < me.columns.length; j++) {
						if ((me.columns[j].text != '')
								&& (includeHidden || !me.columns[j].isHidden())) {
							var v = r[me.columns[j].dataIndex];
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
				//debugger;
				return result;
			}
		});
		
		/*
		 * opt adhoc param  start
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
		var adhocCategory1;
		var adhocCategory2;
		var adhocExcludeWDPNs;
		var adhocProjectName;
		var adhocOptNumber;
		var adhocObjectType;
		var adhocStatus;
		var adhocFileCondition;
		/*
		 * end
		 */
		
		Ext.apply(this, {
			columnLines : true,
			store : this.createStore(),
			// selModel : this.createCheckboxModel(),
			selModel : Ext.create('Ext.selection.CheckboxModel', {
				listeners : {
					selectionchange : function(obj, selecteds) {
						Ext.LOIS.setEnableByTypeAndStatus(
								Ext.LOIS.TYPE.OPT_SVC, selecteds);
						if (obj.getSelection().length == 0) {
							Ext.getCmp('optsrv_facet_attribute').disable();
						}else{
							Ext.getCmp('optsrv_facet_attribute').enable();
							
						}
						
						if (obj.getSelection().length >= 1) {
							Ext.getCmp('opt_management_facet_manuallyTranslation_ui').enable();							
						}else{
							Ext.getCmp('opt_management_facet_manuallyTranslation_ui').disable();							
						}

					},
					
					select : function(obj, record, index) {
						if (obj.getSelection().length == obj.store.data.length) {
							Ext.LOIS.setEnableByTypeAndStatus(
									Ext.LOIS.TYPE.OPT_SVC, obj.getSelection());
						}
						if (obj.getSelection().length == 0) {
							Ext.getCmp('optsrv_facet_attribute').disable();
						}else{
							Ext.getCmp('optsrv_facet_attribute').enable();
							
						}
						
						if (obj.getSelection().length >= 1) {
							Ext.getCmp('opt_management_facet_manuallyTranslation_ui').enable();							
						}else{
							Ext.getCmp('opt_management_facet_manuallyTranslation_ui').disable();							
						}

					}
				}
			}),
			tbar : this.createToolbar(),
			bbar : this.createPagingbar(),
			columns : [/**
			 * rowNum, { text : 'Number', flex : 1, dataIndex :
			 * 'number' }, { text : 'OF_Type', flex : 1, dataIndex :
			 * 'category' }, { text : 'Status', flex : 1, dataIndex :
			 * 'status' }, { text : 'Version', flex : 1, dataIndex :
			 * 'version_Number' }, { text : 'Check', flex : 1,
			 * dataIndex : 'lastmodify', renderer : function(v) { if
			 * (v == true) { return "<font color='red'>Check Out</font>"; }
			 * else { return "<font color='green'>Check In</font>"; } }
			 * },{ text : 'Last Modify', flex : 1, dataIndex :
			 * 'updateTime',
			 * //renderer:Ext.util.Format.dateRenderer('m/d/Y
			 * H:i:s')
			 * renderer:Ext.util.Format.dateRenderer('m/d/Y') },{
			 * text : 'Last Modify By', flex : 1, dataIndex :
			 * 'checkName' },{ text : 'Create On', flex : 1,
			 * dataIndex : 'createdTime',
			 * //renderer:Ext.util.Format.dateRenderer('m/d/Y
			 * H:i:s')
			 * renderer:Ext.util.Format.dateRenderer('m/d/Y') }, {
			 * text : 'Create By', flex : 1, dataIndex :
			 * 'updateName' },
			 */
					{
				xtype : 'actioncolumntext',
				header : 'Operation',
				 width: 200,
				align : 'left',
				items : [{
					// icon :
					// '../resources/images/icons/table_relationship.png', //
					// Use a URL in the icon config
					
					icon : 'Country Link',
					tooltip : 'Country Link Info',
					handler : function(grid, rowIndex, colIndex) {
						var rec = grid.store.getAt(rowIndex);
						if (Ext.LOIS.getEnableByTypeAndStatus(
								Ext.LOIS.TYPE.OPT_SVC, rec.get('status'),
								'optsrv_country_link')) {
							/*
							 * var rec = grid.store.getAt(rowIndex);
							 * if(Ext.LOIS.getEnableByTypeAndStatus(Ext.LOIS.TYPE.OPT_SVC,rec.get('status'),'optsrv_country_link')){
							 */
							// var rec = grid.store.getAt(rowIndex);
							var ids = [];
							ids.push(rec.get('id'));

							Ext.Ajax.request({
								url : '../offering/updateCountryLink!findAllRegionsAndLinkCountrys.action',
								method : 'GET',
								params : {
									objectType : 'OPT',
									ids : ids
								},
								success : function(response, config) {
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
													objectType : 'OPT',
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
				}
				//facet link-cxc-2016-4-22 17:02:13
				,{
				    icon:"Facet Link",
				    tooltip:"Facet Link Info",
				    handler : function(grid, rowIndex, colIndex) {
						var rec = grid.store.getAt(rowIndex);
						if (Ext.LOIS.getEnableByTypeAndStatus(
								Ext.LOIS.TYPE.OPT_SVC, rec.get('status'),
								'optsrv_country_link')) {
							/*
							 * var rec = grid.store.getAt(rowIndex);
							 * if(Ext.LOIS.getEnableByTypeAndStatus(Ext.LOIS.TYPE.OPT_SVC,rec.get('status'),'optsrv_country_link')){
							 */
							// var rec = grid.store.getAt(rowIndex);
							var ids = [];
							ids.push(rec.get('id'));
							var pns=[];
							pns.push(rec.get('number'));
							Ext.Ajax.request({
								url : '../offering/updateFacetLink!findAllRegionsAndLinkFacet.action',
								method : 'GET',
								params : {
									objectType : 'OPT',
									pns : pns,
									ids:ids
								},
								success : function(response, config) {
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
												'WC-linkFacet', {
													ids : ids,
													facetName:res.facetName,
													facet2 : res.facet2,
													objectType : 'OPT',
													partnumber : rec.get('number')
												});
										win.submit_url = '../offering/updateFacetLink!updateLinkFacet.action';
										win.cancel_url = '../offering/updateFacetLink!undo.action';
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
				},
				//end
				
				]
			}, {
				header : "Checkout By",
				dataIndex : "checkOutUserName",
				sortable: false,
				width: 156,
				align : "left", 
				renderer : function(v) {
					if (v) {
						return "<font color='red'>" + v + "</font>";
					}
				}

			}, {
				text : 'Number',
				// flex : 1,
				dataIndex : 'number',
				align : 'left',
				width: 116
			}, {
				text : 'Name',
				// flex : 1,
				dataIndex : 'name',
				align : 'left',
				width: 131
			}, {
				text : 'Status',
				// flex : 1,
				dataIndex : 'status',
				align : 'left',
				width: 100
			},  {
				text : "Early Order Window",
				dataIndex : "earlyOrderWindowDate",
				name : "earlyOrderWindowDate",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			},{
				text : "Announce Date",
				dataIndex : "announceDate",
				name : "announceDate",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			},{
				text : 'Version',
				// flex : 1,
				dataIndex : 'offeringVersion',
				align : 'left',
				width: 88
			},{
				text : 'Product Type',
				// flex : 1,
				dataIndex : 'productType',
				align : 'left',
				width: 100
			},{
				text : "Marketing Description",
				dataIndex : "marketingDescription",
				name : "marketingDescription",
				align : "left",
				width: 228
			}, {
				text : "Invoice Description",
				dataIndex : "invoiceDescription",
				name : "invoiceDescription",
				align : "left",
				width: 156
			}, {
				text : "Base Warranty",
				dataIndex : "basewar",
				name : "basewar",
				align : "left"
			},{
				text : "Category 1",
				dataIndex : "category1",
				name : "category1",
				align : "left",
				width: 156
			}, {
				text : "Category 2",
				dataIndex : "category2",
				name : "category2",
				align : "left",
				width: 192
			},
			{
				text : "Solution Category",
				dataIndex : "vcategory",
				name : "vcategory",
				align : "left",
				width: 192
			}, {
				text : "Audience",
				dataIndex : "audience",
				name : "audience",
				align : "left",
				width: 156
			}, {
				text : "Online Channel",
				dataIndex : "onlineChannel",
				name : "onlineChannel",
				align : "left",
				width: 156
			}, {
				text : "Spec Bid",
				dataIndex : "specBid",
				name : "specBid",
				align : "left",
				width: 100
			},{
				text : "WW Link",
				dataIndex : "wwLink",
				name : "wwLink",
				align : "left",
				width: 100
			}, {
				text : "OPT_MTM",
				dataIndex : "optMtm",
				name : "optMtm",
				align : "left",
				width: 100
			},{
				text : "IAL Number",
				dataIndex : "ialNumber",
				name : "ialNumber",
				align : "left",
				width: 100
			}, {
				text : "General Availability",
				dataIndex : "generalAvailabilityDate",
				name : "generalAvailabilityDate",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			},{
				text : "Withdrawal Date",
				dataIndex : "withdrawalDate",
				name : "withdrawalDate",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			},{
				text : "OS information",
				dataIndex : "osInformation",
				name : "osInformation",
				align : "left",
				width: 156
			}, {
				text : "ProductHierarchy",
				dataIndex : "productHierarchy",
				name : "productHierarchy",
				align : "left",
				width: 156
			}, {
				text : "UnspscCode",
				dataIndex : "unspscCode",
				name : "unspscCode",
				align : "left",
				width: 100
			}, {
				text : "LocationCode",
				dataIndex : "locationCode",
				name : "locationCode",
				align : "left",
				width: 108
			},{
				text : "Mkt Rep",
				dataIndex : "mktRep",
				name : "mktRep",
				align : "left",
				width: 156
			},{
				text : "Developer",
				dataIndex : "developer",
				name : "developer",
				align : "left",
				width: 156
			},{
				text : "MFG'er PN",
				dataIndex : "mfgerPn",
				name : "mfgerPn",
				align : "left",
				width: 108
			},  {
				text : "VLH Flag",
				dataIndex : "vlhFlag",
				name : "vlhFlag",
				align : "left",
				width: 100
			}, {
				text : 'Object Type',
				// flex : 1,
				dataIndex : 'category',
				align : 'left',
				width: 100
			}// add new column product type 
			, {
				text : "Bac Code",
				dataIndex : "bacCode",
				name : "bacCode",
				align : "left",
				width: 100
			},  
			/**Begin  Add SVC Attribute  By wm**/
			//'highAvailability','sdf','serviceCategory','productTier'
			{
				text : "High Availability",
				dataIndex : "highAvailability",
				name : "highAvailability",
				align : "left",
				width: 100
			},
			{
				text : "SDF",
				dataIndex : "sdf",
				name : "sdf",
				align : "left",
				width: 100
			},
			{
				text : "Service Category",
				dataIndex : "serviceCategory",
				name : "serviceCategory",
				align : "left",
				width: 100
			},
			{
				text : "Service Tier",
				dataIndex : "serviceTier",
				name : "serviceTier",
				align : "left",
				width: 100
			},
			{
				text : "Applicability",
				dataIndex : "applicability",
				name : "applicability",
				align : "left",
				width: 100
			},
			{
				text : "ApplicabilityKey",
				dataIndex : "applicabilityKey",
				name : "applicabilityKey",
				align : "left",
				width: 100
			},
			/**End Add SVC Attribute  By wm**/
			
			
			{
				text : "Last Modify",
				dataIndex : "updatedTime",
				name : "updatedTime",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			}, {
				text : "Last Modify By",
				dataIndex : "updatedUserName",
				sortable: false,
				name : "updatedUserName",
				align : "left",
				width: 156
			}, {
				text : "Create On",
				dataIndex : "createdTime",
				name : "createdTime",
				align : "left",
				width: 100,
				renderer : Ext.util.Format.dateRenderer('m/d/Y')
			}, {
				text : "Create By",
				dataIndex : "createdUserName",
				sortable: false,
				name : "createdUserName",
				align : "left",
				width: 156
			}
			/**
			 * , { text : 'Check', flex : 1, dataIndex : 'lastmodify', renderer :
			 * function(v) { if (v == true) { return "<font color='red'>Check
			 * Out</font>"; } else { return "<font color='green'>Check In</font>"; } } }
			 */
			]
		});

		this.callParent();

		this.on('itemdblclick', this.dblclick, this);

		// every click pagin button,then fire this event
		this.store.on('beforeload', this.onBeforeloadEvent, this);
		// this.store.loadPage(1);//this.store.load();
		// after grid rendered ,then select the record that has checked
		this.store.on('load', this.onStoreLoadEvent, this);

		// Ext.LOIS.copyAndPaste(this,this.store);

	},
	ifAllowCheck : function(t) {
		var global = this;
		var modifyRecords = [];
		Ext.Array.each(global.getSelectionModel().selected.items, function(
						record, i, all) {
					modifyRecords.push(record.data);
				});

		Ext.Ajax.request({
					url : '../offering/attribute!ifAllowCheck.action',
					method : 'POST',
					sync : false,
					params : {
						modifyRecords : Ext.JSON.encode(modifyRecords)
					},
					success : function(response, config) {
						var res = Ext.JSON.decode(response.responseText);
						if (res.allow) {
							return true;
						} else {
							Ext.MessageBox.show({
										title : 'Message',
										msg : "Is being check out by other people!",
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-info'
									});
							return false;
						}
					},
					failure : function() {
						Ext.MessageBox.show({
									title : 'Message',
									msg : 'Check In Error!',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
						return false;
					}
				});

	},
	createPagingbar : function() {
		this.paginationBottomBar = Ext.create('App.PagingToolbar', {
					pageSize : 100,
					store : this.store,
					displayInfo : true
				});
		return this.paginationBottomBar;
	},
	dblclick : function(me, record, item, index, e) {
		var dbclickvalue = record.data;
		var offeringId = dbclickvalue.id;
		var opt_link_grid=Ext.getCmp("opt_element_link_grid");
		opt_link_grid.offeringId = offeringId;
		opt_link_grid.executeQuery();

	},
	// select records after grid store loaded
	onStoreLoadEvent : function(store, records, isSuccessful, operation) {
		var grid = this;
		// if select the last record,It will appear "scrollerRight is null"
		// error
		// grid.body.unmask();
		Ext.Array.each(records, function(record, i, all) {
					Ext.Array.each(grid.ids, function(nid, i, all) {
								if (nid == record.get('id')) {
									grid.getSelectionModel().select(record,
											true, false);
									return false;
								}
							});
				});
	},
	// load form query params
	fromPH : '0',
	onBeforeloadEvent : function() {
		var me = this;
		if(me.moreSearch){
			me.store.getProxy().extraParams.ids = me.offeringIds;
			me.store.getProxy().url = "../optsrv/opt!findOfferingsByOfferingNumber.action";
		}else{
			me.store.getProxy().url = "../optsrv/opt!findOfferingsByCondition.action";
			me.store.proxy.actionMethods.read="POST";
		}
		if(me.fromPH=='0'){
		this.setIdsByChooseIds(me);
		me.store.getProxy().extraParams = me.queryParams;
		}
	},
	createCheckboxModel : function() {
		this.checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
					// mode : 'MULTI',
					listeners : {
						selectionchange : function(obj, selecteds) {
							Ext.LOIS.setEnableByTypeAndStatus(
									Ext.LOIS.TYPE.OPT_SVC, selecteds);
						}
					}
				});
		return this.checkboxModel;
	},
	createToolbar : function() {
		var global = this;
		this.toolbar = Ext.create('widget.toolbar', {
			layout : {
				overflowHandler : 'Menu'
			},
			items : ['-', {
				text : '<b>Search</b>',
				iconCls : 'icon-search',
				// disabled : false,
				id : 'optsrv_search',
				disabled : Ext.LOIS.isEnable('optsrv_search'),
				handler : function() {
					//global.elementStore.removeAll();
					global.ids = [];
					global.search = '1';
					var searchWin = Ext
							.create('Ext.optsrv.js.searchWindow', {});
					searchWin.show();
				}
			}, '-', {
				text : '<b>Edit</b>',
				iconCls : 'icon-edit',
				menu : {
					items : [{
						text : 'MKT Attribute',
						id : 'optsrv_mkt_edit',
						disabled : Ext.LOIS.isEnable('optsrv_mkt_edit'),
						iconCls : 'icon-menu-node',
						handler : function() {
							//var modifyRecords = [];
							//Ext.Array.each(
							//		global.getSelectionModel().selected.items,
							//		function(record, i, all) {
							//			modifyRecords.push(record.data);
							//		});
							global.setIdsByChooseIds(this);
							if (global.ids == '') {
											Ext.Msg
													.alert('empty',
															'please select some items.');
											return false;
										}
										var c = this;
						var a = "";
							Ext.Ajax.request({
								//url : '../offering/attribute!ifAllowCheck.action',
								url:'../offering/checkOut!checkCheckOutStatus.action',
								method : 'POST',
								sync : false,
								params : {
									ids : global.ids
								},
								success : function(d, f) {
									if (d.responseText == null
												|| d.responseText == undefined
												|| d.responseText == "undefined"
												|| d.responseText == "") {
											a = false
										} else {
											var e = Ext.JSON
													.decode(d.responseText);
											a = e.success
										}
										
									if (a == true) {
										var status = global.getSelectionModel().selected.items[0].data.category;
										var win = Ext.createWidget(
												'attributeEdit', {
													ids : global.ids,
													type : status
												});
										win.show();
									} else {
										Ext.MessageBox.show({
											title : 'Message',
											msg : "Is being check out by other people!",
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-info'
										});
										return false;
									}
								},
								failure : function() {
									Ext.MessageBox.show({
												title : 'Message',
												msg : 'Check In Error!',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									return false;
								}
							});
						}
					}, {
						text : 'Edit Attribute (Loadsheet)',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('optsvc_management_attribute_excel'),
						id : 'optsvc_management_attribute_excel',
						handler : function() {
							global.onBeforeloadEvent();
							var pns = global.setPNsByChooseIdsNO();
							
							if (global.ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
							} 
							else {
								if (!Ext
																					.fly("frmDummy")) {
																				Ext
																						.getBody()
																						.createChild(
																								{
																									tag : "form",
																									id : "frmDummy"
																								});
																				Ext
																						.fly("frmDummy").className = "x-hidden"
																			}
																			Ext.Ajax
																					.request({
																						url : "../offering/mmrdownload!generateMMRLoadSheet.action",
																						method : "POST",
																						isUpload : true,
																						timeout : 1800000,
																						form : Ext
																								.fly("frmDummy"),
																						params : {
																							pns : pns,
																							ids : global.ids,
																							objectType : "WCOPT"
																						},
																						success : function(
																								c,
																								d) {
																							var e = Ext.JSON
																									.decode(c.responseText);
																							if (e.msg) {
																								Ext.MessageBox
																										.show({
																											title : "Message",
																											msg : e.msg,
																											buttons : Ext.MessageBox.OK,
																											icon : "ext-mb-info"
																										})
																							}
																						},
																						failure : function() {
																							Ext.MessageBox
																									.show({
																										title : "Message",
																										msg : "Error!",
																										buttons : Ext.MessageBox.OK,
																										icon : "ext-mb-error"
																									})
																						}
																					});
																			Ext
																					.fly(
																							"frmDummy")
																					.destroy()
							}
						}
					}, {
						text : 'Date/Aud Attribute',
						iconCls : 'icon-menu-node',
						id : 'optsrv_aud_edit',
						disabled : Ext.LOIS.isEnable('optsrv_aud_edit'),
						handler : function() {
							var ids = global.setIdsByChooseIdsNO();
							if (ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							global.CheckOutOrIn(ids, 'out');
							global.editAudData(ids);
						}
					}, {
						text : 'Country Attribute',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('optsrv_country_attribute'),
						id : 'optsrv_country_attribute',
						handler : function() {

							var modifyRecords = [];
							Ext.Array.each(
									global.getSelectionModel().selected.items,
									function(record, i, all) {
										modifyRecords.push(record.data);
									});
							Ext.Ajax.request({
								url : '../offering/attribute!ifAllowCheck.action',
								method : 'POST',
								sync : false,
								params : {
									modifyRecords : Ext.JSON
											.encode(modifyRecords)
								},
								success : function(response, config) {
									var res = Ext.JSON
											.decode(response.responseText);
									if (res.allow) {
										var ids = global.setIdsByChooseIdsNO();
										if (ids == '') {
											Ext.Msg
													.alert('empty',
															'please select some items.');
											return false;
										}
										var ObjectType = global
												.getSelectionModel().selected.items[0].data.category;
										var obj = Ext.createWidget(
												'OPTSVC-listCountrys', {
													ids : ids,
													ObjectType : ObjectType,
													isCheckOut : 'y'
												});
										obj.show();
									} else {
										Ext.MessageBox.show({
											title : 'Message',
											msg : "Is being check out by other people!",
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-info'
										});
										return false;
									}
								},
								failure : function() {
									Ext.MessageBox.show({
												title : 'Message',
												msg : 'Check In Error!',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									return false;
								}
							});
						}
					}
					//add Facet Attribute- chenxc-2016-4-27 09:26:33
					, {
						text : 'Facet Attribute',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('optsrv_facet_attribute'),
						id : 'optsrv_facet_attribute',
						handler : function() {

							var modifyRecords = [];
							Ext.Array.each(
									global.getSelectionModel().selected.items,
									function(record, i, all) {
										modifyRecords.push(record.data);
									});
							Ext.Ajax.request({
								url : '../offering/attribute!ifAllowCheck.action',
								method : 'POST',
								sync : false,
								params : {
									modifyRecords : Ext.JSON
											.encode(modifyRecords)
								},
								success : function(response, config) {
									var res = Ext.JSON
											.decode(response.responseText);
									if (res.allow) {
										var ids = global.setPNsByChooseIdsNO();
//										var ids = [];
//										ids.push(rec.get('number'));
										
										if (ids == '') {
											Ext.Msg
													.alert('empty',
															'please select some items.');
											return false;
										}
										/*alert(ids);*/
										var ObjectType = global
												.getSelectionModel().selected.items[0].data.category;
										var obj = Ext.createWidget(
												'OPTSVC-listFacet', {
													pns : ids,
													ObjectType : ObjectType,
													isCheckOut : 'y'
												});
										obj.show();
									} else {
										Ext.MessageBox.show({
											title : 'Message',
											msg : "Is being check out by other people!",
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-info'
										});
										return false;
									}
								},
								failure : function() {
									Ext.MessageBox.show({
												title : 'Message',
												msg : 'Check In Error!',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
									return false;
								}
							});
						}
					}
					//end
					]
					// ]
				}
			},'-', {
				text : '<b>View Links</b>',
				iconCls : 'icon-element-link',
				menu : {
					items : [{
						text : 'View Links',
						id : 'optsrv_update_link',
						disabled : Ext.LOIS.isEnable('optsrv_update_link'),
						iconCls : 'icon-menu-node',
						handler : function() {
							global.onBeforeloadEvent();
							if (global.ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								selectedIds = global.ids;
								enhanceWinPanel = new Ext.Window({
									title : 'Edit Element Link',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew.html?objectType=opt"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
							}
						}
//						handler : function() {
//							global.onBeforeloadEvent();
//							if (global.ids == '') {
//								Ext.Msg.alert('empty',
//										'please select some items.');
//							} else {
//								
//								// added by zhangding1, on Nov. 9th.
//								Ext.Ajax.timeout = 90000000;
//								var waitingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
//								waitingMask.show();
//								Ext.Ajax.request({
//									url : '../element/elementLink!findElementsByObjectIds.action',
//									method : 'POST',
//									async:true,
//									params : {
//										objectIds : global.ids,
//										objectType : 'opt'
//									},
//									success : function(response, option) {
//										waitingMask.hide();
//										var result = Ext.JSON
//												.decode(response.responseText);
//										this.objectsStr = result.objectsStr;
//										this.elementTypesStr = result.elementTypesStr;
//										this.elementsStr = result.elementsStr;
//										this.objectType = 'opt';
//										enhanceWinPanel = new Ext.Window({
//											title : 'Edit Element Link',
//											width : 900,
//											height : 550,
//											// autoScroll : true,
//											constrain : true,
//											modal : true,
//											closable : false,
//											items : [],
//											html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLink/ElementLink.html"> </iframe>'
//										});
//										enhanceWinPanel.show();
//									},
//									// add arguments to failure callback function. by zhangding1, on Nov. 5th, 2012.
//									failure : function(response, option) {
//										waitingMask.hide();
//										Ext.MessageBox.show({
//													title : 'Message',
//													msg : 'Checkout Error!',
//													buttons : Ext.MessageBox.OK,
//													icon : 'ext-mb-error'
//												});
//									}
//								});
//
//							}
//						}
					}, {
						text : 'Download Element Links',
						iconCls : 'icon-menu-node',
						/*disabled : Ext.LOIS
								.isEnable('download_elementlink_sheet'),*/
						id : 'download_elementlink_sheet',
						handler : function() {
							global.onBeforeloadEvent();
							if (global.ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
							} else {
								selectedIds = global.ids;
								enhanceWinPanel = new Ext.Window({
									title : 'Download Element Links',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew2.html?objectType=opt"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
							}
						}
					}]
				}
			}, '-', {
				text : '<b>OCM</b>',
				iconCls : 'icon-ocm-link',
				menu : {
					items : [{ 
						text : 'OCM (UI)',
						id : 'optsrv_ocm_ui',
						disabled : Ext.LOIS.isEnable('optsrv_ocm_ui'),
						iconCls : 'icon-menu-node',
						handler : function() {
							// global.onBeforeloadEvent();
							global.setIdsByChooseIds(global);
							if (global.ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							if (global.ids.length > 300) {
								Ext.Msg
										.alert('Error',
												'Colund not select more than 300 items while doing OCM.');
								return false;
							}
							ocmFlexPanel = new Ext.Window({
								title : 'Edit OCM',
								width : 1000,
								height : 600,
								constrain : true,
								modal : true,
								closable : false,
								items : [],
								//' + global.ids +'
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../optsrv/OCMEditNew.html?recordIds=' + global.ids +'"> </iframe>',
								buttons : []
							});
							ocmFlexPanel.show();
							
						}
					},{
						text : 'OCM Loadsheet',
						id : 'optsrv_ocm_loadsheet',
						disabled : Ext.LOIS.isEnable('optsrv_ocm_loadsheet'),
						iconCls : 'icon-menu-node',
						handler : function() {
							// global.onBeforeloadEvent();
							var ids = global.setIdsByChooseIdsNO();
							if (ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}

							global.ocmDialog(ids);
						}
					}]
				}
			}, '-', {
				text : '<b>Loadsheet Upload</b>',
				iconCls : 'icon-loadsheet',
				menu : {
					items : [						
						{
						text : "WC OPT Loadsheet",
						iconCls : "icon-menu-node",
						disabled : Ext.LOIS
								.isEnable("opt_wc_mmr_inloadsheet"),
						id : "opt_wc_mmr_inloadsheet",
						handler : function() {
							var c = "";
							Ext.Ajax
									.request({
										url : "../element/getCurrentUser!findCurrentUserId.action",
										method : "POST",
										async : false,
										success : function(
												e,
												f) {
											var d = Ext.JSON
													.decode(e.responseText);
											c = d.userId
										},
										failure : function() {
										}
									});
							enhanceWinPanel = new Ext.Window(
									{
										title : "WC OPT MMR Loadsheet",
										width : 750,
										height : 350,
										constrain : true,
										modal : true,
										closable : true,
										items : [],
										html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=wcoptmmr&userId='
												+ c
												+ '"> </iframe>'
									});
							enhanceWinPanel
									.show()
						}
					},
					
					
					{
						text : 'Element Link Loadsheet',
						iconCls : 'icon-menu-node',
						id : 'optsrv_element_link_loadsheet',
						disabled : Ext.LOIS
								.isEnable('optsrv_element_link_loadsheet'),
						handler : function() {
							//global.loadLinksWin();
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
								width : 550,
								height : 450,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=optelement&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
						}
					}, 
					
					//modify UI for facet link loadsheet-chenxc-2016-4-29 10:45:35
					{
						text : 'Facet Link Loadsheet',
						iconCls : 'icon-menu-node',
						id : 'optsrv_facet_link_loadsheet',
						//disabled : Ext.LOIS
						//		.isEnable('optsrv_facet_link_loadsheet'),
						handler : function() {
							//global.loadLinksWin();
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
								title : 'FacetLink Upload',
								width :800,
								height : 450,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=optfacet&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
						}
					}, 
					//end
					
					/*
					//facet link loadsheet-cxc-2016-4-22 15:50:14
					{
					text : 'Facet Link Loadsheet',
					id : 'optsrv_facet_link_loadsheet',
					iconCls : 'icon-menu-node',
					handler : function() {
						var uploadWin = Ext.create('Ext.optsrv.js.FacetuploadWindow', {});
						uploadWin.show();
					}
					},
					
					//end
					*/	
				{
						text : 'OCM Loadsheet(By ProductHierarchy)',
						id : 'ocm_ls_byph',
						disabled : Ext.LOIS.isEnable('ocm_ls_byph'),
						iconCls : 'icon-menu-node',
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
								title : 'OCM LoadSheet',
								width : 780,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=ocmbyph&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();

							/**
							var center = vp.getComponent('center-tabs');
							var id = '123456789';
							var url = '../optsrv/offering-ph-link-byseries.html';

							var tab_n = center.add({
								title : 'Maintain Compatibility by ProductHierarchy',
								id : tab_n,
								// xtype:
								// '../optsrv/offering-ph-link-byseries.html',
								html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src='
										+ url + '></iframe>',
								iconCls : 'tabs',
								closable : true
							});
							center.setActiveTab(tab_n);
							 */
						}
					}, {
						text : 'OCM Loadsheet(By Offering)',
						id : 'ocm_ls_byoffering',
						disabled : Ext.LOIS.isEnable('ocm_ls_byoffering'),
						iconCls : 'icon-menu-node',
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
								title : 'OCM LoadSheet',
								width : 750,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],                                                                                         
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=ocmbyOffering&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
							/**
								var center = vp.getComponent('center-tabs');
								var url = '../optsrv/offering-ph-link-byoptsvc.html';
								var id = '987654321';

								var tab_n = center.add({
									title : 'Maintain Compatibility by OPT/SVC',
									id : id,
									// xtype:
									// '../optsrv/offering-ph-link-byoptsvc.html',
									html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src='
											+ url + '></iframe>',
									iconCls : 'tabs',
									closable : true
								});

								center.setActiveTab(tab_n);
							 */
						}
					},{
						text : 'MT-Service Tier Upload',
						id : 'opt_management_uploadMTServiceTier_ui',
						iconCls : 'icon-menu-node',
						handler : function() {
							var uploadWin = Ext.create('Ext.optsrv.js.uploadWindow', {});
							uploadWin.show();
						}
					}]
				}
			}, '-', {
				text : '<b>More</b>',
				iconCls : 'icon-more-actions',
				menu : {
					items : [{
						text : 'Save As',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('optsrv_management_more_saveAs'),
						id : 'optsrv_management_more_saveAs',
						handler : function() {

							if (global.getSelectionModel().selected.items.length != 1) {
								Ext.Msg.alert('error',
										'you should select only one!');
								return false;
							}
							var records = global.getSelectionModel()
									.getSelection();
							var ids = [];
							Ext.Array.each(records, function(record, i, all) {
										ids.push(record.get('id'));
									});
							var grid2 = Ext.createWidget('elementsList', {
										height : 300,
										width : 500,
										isShowTbar : true,
										s_id : ids[0],
										objectType : 'WC',
										flag : 'optsrv-commonWindow'
									});
							grid2.ids = ids;
							// grid2.store.getProxy().extraParams.ids = ids;
							grid2.store.getProxy().extraParams.offeringId = ids;
							grid2.store.load();
							var win = Ext.createWidget('optsrv-commonWindow', {
										item : grid2,
										title : 'OPT/SVC Save as'
										
									});
							win.show();

						}
					},{
						text : 'Promote',
						iconCls : 'icon-menu-node',
						disabled : Ext.LOIS
								.isEnable('opt/srv_management_more_promote'),
						id : 'opt/srv_management_more_promote',
						handler : function(){
							var offeringIds='';
							if (global.getSelectionModel().selected.items.length <=0) {
								Ext.Msg.alert('Message', 'please select some items.');
								return false;
							}
							var records = global.getSelectionModel()
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
						 var optsvcId = urlMap.get('../basic/PromoteOffering.html');
				         var center = vp.getComponent('center-tabs');
					     var tab_n = center.getActiveTab(optsvcId);
					     var tt=   Ext.getCmp(optsvcId);
					     Ext.Msg.confirm("Promote Searching",
									"The Offerings listing on Offering Promote page will be refreshed by the selected Offerings,do you want to go on?",
									function(btn){ 
									if (btn == 'yes'){
									if(tt==undefined){
						        	tab_n =  center.add({		 
									 title:'Offering Promote',
									 iconCls: 'tabs',
									 id:optsvcId,
									 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
									 closable: true
									 });
									 center.setActiveTab(tab_n);
						        }else{
						           center.remove(tt);					
						           tt=center.add({		 
									 title:'Offering Promote',
									 iconCls: 'tabs',
									 id:optsvcId,
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
						text : 'Report For OCM',
						iconCls : 'icon-menu-node',
						handler : function() {

							global.store.each(function(record) {

										global.idsReport.push(record.get('id'));

									});

							if (global.idsReport == '') {
								Ext.Msg.alert('Message',
										'please select some items');
								return false;
							}

							var ch_radio_report = Ext.create('Ext.form.Panel',
									{
										labelWidth : 180,
										method : "post",
										width : "100%",
										defaults : {
											labelWidth : 300,
											width : 400
										},
										defaultType : 'textfield',
										labelAlign : "left",
										bodyStyle : 'padding:20px;',
										items : [{
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '1',
											fieldLabel : 'Maintain Compatibility of Opt/Svc to MT'

										}, {
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '2',
											fieldLabel : 'Maintain Compatibility of Opt/Svc to Sub-Series'
										}, {
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '3',
											fieldLabel : 'Maintain Compatibility of Opt/Svc to Series'
										}, {
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '4',
											fieldLabel : 'Maintain Compatibility of MT to Opt/Svc'
										}, {
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '5',
											fieldLabel : 'Maintain Compatibility of Sub-Series to Opt/Svc'
										}, {
											xtype : 'radiofield',
											name : 'radio1',
											inputValue : '6',
											fieldLabel : 'Maintain Compatibility of Series to Opt/Svc'
										}],
										buttons : [{
											text : 'Export EXCEL',
											handler : function() {
												var value_report = ch_radio_report
														.getForm().getValues()["radio1"];
												var level_report;
												var url_report;
												if (value_report == 1) {
													level_report = 5;
													url_report = '../optsrv/ocmSeries!ocmPHExcelDownload.action';
												} else if (value_report == 2) {
													level_report = 4;
													url_report = '../optsrv/ocmSeries!ocmPHExcelDownload.action';
												} else if (value_report == 3) {
													level_report = 3;
													url_report = '../optsrv/ocmSeries!ocmPHExcelDownload.action';
												} else if (value_report == 4) {
													level_report = 5;
													url_report = '../optsrv/ocmSeries!ocmExcelDownload.action';
												} else if (value_report == 5) {
													level_report = 4;
													url_report = '../optsrv/ocmSeries!ocmExcelDownload.action';
												} else if (value_report == 6) {
													level_report = 3;
													url_report = '../optsrv/ocmSeries!ocmExcelDownload.action';
												}

												var form = ch_radio_report
														.getForm();
												form.standardSubmit = true;
												if (form.isValid()) {
													form.submit({
														url : url_report,
														params : {
															ids : global.idsReport,
															level : level_report
														},
														// waitMsg : 'Uploading
														// Excel File...',
														success : function(fp,
																o) {
															ch_win_report
																	.hide();
															global.idsReport = [];
															// Ext.getCmp('mtm_uploadWindow').close();
														},
														failure : function(
																form, action) {
															Ext.MessageBox
																	.show({
																		title : 'Message',
																		msg : 'download Failed!',
																		buttons : Ext.MessageBox.OK,
																		icon : 'ext-mb-error'
																	});
															global.idsReport = [];
														}
													});
												}
											}
										}, {
											text : 'Cancel',
											handler : function() {

												ch_win_report.close();
												global.idsReport = [];
											}
										}]
									});

							var ch_win_report = Ext.create('Ext.Window', {
										layout : {
											type : 'fit'
										},
										id : '232323dfgf',
										width : 400,
										title : "Adhoc Report",
										resizable : true,
										closable : true,
										closeAction : 'destroy',
										plain : true,
										modal : true,
										items : [ch_radio_report],
										isteners : {
											"close" : function() {

												global.idsReport = [];

											}
										}
									});

							ch_win_report.show();

						}
					}, {
						text : 'OPT/SRV Adhoc Report',
						iconCls : 'icon-menu-node',
						handler : function() {

							if (global.store.getCount() == 0) {
								Ext.MessageBox.alert("Message", "grid no data");
								return false;
							}
							//var vExportContent = global.getExcelXml(0);
							// debugger;

							//var fileNameArr = [];
							//fileNameArr = window.location.href.split('/');
							//var fileName = 'OPTSRV'
							//+ '_' + new Date().getTime();
							Ext.Ajax.request({

								url : '../optsrv/opt!checkOfferingAdhocReportCount.action',
								async:false,
								params : {
									projectName : opt_projectName,
									offeringNumber : opt_offeringNumber,
									status : opt_status,
									objectType : opt_objectType,
								    fileName : opt_fileName,
								    hierarchyCode : adhocProductHierarchy,
								    
								    /*
									 * change adhoc query param start
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
									category1 : adhocCategory1,
									category2 : adhocCategory2,
									excludeWDPNs : adhocExcludeWDPNs,
									fileCondition : adhocFileCondition,
									/*
									 * end 
									 */
								    
									currentPageNo : 1,
									sort : 'name',
									dir : 'asc',
									pageSize : 20
								},
								success : function(response, option) {
									var jsonMessage = Ext.decode(response.responseText);
									var message = jsonMessage.msg;
									var adhocCount = jsonMessage.adhocCount;
									if (message == 'F') {
										if (!Ext.fly('OPTfrmDummy')) {
														var frm = document
																.createElement('form');
														frm.id = 'OPTfrmDummy';
														frm.name = id;
														frm.className = 'x-hidden';
														document.body
																.appendChild(frm);
													}

													Ext.Ajax.request({
														url : '../optsrv/opt!makeAdhocReportForOPT.action',
														method : 'POST',
														form : Ext
																.fly('OPTfrmDummy'),
														isUpload : true,
														params : {
															projectName : opt_projectName,
															offeringNumber : opt_offeringNumber,
															status : opt_status,
															objectType : opt_objectType,
															fileName : opt_fileName,
															hierarchyCode : adhocProductHierarchy,
															
															/*
									 * change adhoc query param start
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
									category1 : adhocCategory1,
									category2 : adhocCategory2,
									excludeWDPNs : adhocExcludeWDPNs,
									fileCondition : adhocFileCondition,
									/*
									 * end 
									 */
															
															currentPageNo : 1,
															sort : 'name',
															dir : 'asc',
															pageSize : adhocCount
														}
													});
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
																if (!Ext.fly('OPTfrmDummy')) {
														var frm = document
																.createElement('form');
														frm.id = 'OPTfrmDummy';
														frm.name = id;
														frm.className = 'x-hidden';
														document.body
																.appendChild(frm);
													}

													Ext.Ajax.request({
														url : '../optsrv/opt!makeAdhocReportForOPT.action',
														method : 'POST',
														form : Ext
																.fly('OPTfrmDummy'),
														isUpload : true,
														params : {
															projectName : opt_projectName,
															offeringNumber : opt_offeringNumber,
															status : opt_status,
															objectType : opt_objectType,
															fileName : opt_fileName,
															hierarchyCode : adhocProductHierarchy,
															/*
									 * change adhoc query param start
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
									category1 : adhocCategory1,
									category2 : adhocCategory2,
									excludeWDPNs : adhocExcludeWDPNs,
									fileCondition : adhocFileCondition,
									/*
									 * end 
									 */
															currentPageNo : 1,
															sort : 'name',
															dir : 'asc',
															pageSize : adhocCount
														}
													});
															}
														});
									}
								},
										failure : function() {
											Ext.Msg
													.alert("Information",
															"Export opt adhoc report failed!");
										}
							});

							
													

						}

					}
					, {
						text : 'Country Report',
						iconCls : 'icon-menu-node',
						//disabled:  Ext.LOIS.isEnable('mtm_wc_download'),
						id : 'mtm_wc_download',
						handler : function() {
							var idStr="";
							var ids = [];
							global.store.each(function(record) {
										ids.push(record.get('id'));
										idStr=idStr+record.get('id')+",";
									});

							if (ids.length == 0) {
								Ext.Msg.alert("info", "This is No Record!");
								return;
							}
							if (!Ext.fly('frmDummy_down')) {
								Ext.getBody().createChild({
									tag : 'form',
									id : 'frmDummy_down'
										//html: '<div>...</div>'
									});
								Ext.fly('frmDummy_down').className = 'x-hidden';
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
									var res = Ext.JSON
											.decode(response.responseText);
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
					}
					//add facet download -chenxiaochan-2016-4-25 14:45:08
					
					/*,{
                    	text : 'Facet Report',
                        iconCls : 'icon-menu-node',
                        id : 'opt_management_downloadFacet_ui',
                        handler : function() {
                        	window.location.href ='../ph/facetTierLink!downLinksToExcel.action';
                        }
                    }*/
					//end
					
					
					,{
                        text : 'View Translation',
                        iconCls : 'icon-menu-node',
                        //disabled : Ext.LOIS
                        //        .isEnable('cto_management_updateLink_ui'),
                        id : 'opt_management_viewTranslation_ui',
                        handler : function() {
							var ids = global.setIdsByChooseIdsNO();
							if (ids == '') {
								Ext.Msg
										.alert(
												'empty',
												'please select some items.');
								return false;
							}else{
								var status = global
										.getSelectionModel().selected.items[0].data.category;
							
								enhanceWinPanel = new Ext.Window({
									title : 'View Translation',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=' + status + '&viewOrEdit=view&recordIds=' + ids +'"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();

							}
						}
                    }
					,{
                        text : 'Edit Translation Value',
                        iconCls : 'icon-menu-node',
                        id : 'opt_management_manuallyTranslation_ui',
                        disabled : window.parent.Ext.LOIS.isEnable('opt_management_manuallyTranslation_ui'),
                        handler : function() {
							var ids = global
							.setIdsByChooseIdsNO();
							if (ids == '') {
									Ext.Msg.alert(
										'empty',
										'please select some items.');
									return false;
							} else {
								var status = global
								.getSelectionModel().selected.items[0].data.category;
								Ext.Ajax.request({
									url : '../offering/checkOut!checkCheckOutStatus.action',
									method : 'POST',
									sync : false,
									params : {
										ids : ids
									},success : function(response, option){
										enhanceWinPanel = new Ext.Window({
											title : 'Edit Translation(* The values edit here will be reported and flattened to downstream instead of vendor translated value!)',
											width : 1000,
											height : 700,
											constrain : true,
											modal : true,
											closable : true,
											items : [],
											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=' + status + '&viewOrEdit=edit&recordIds=' + ids +'"> </iframe>',
											buttons : []
										});
										enhanceWinPanel.show();
									},failure : function(response, option){
										Ext.MessageBox.show({
											title : 'Message',
											msg : 'System Error!',
											buttons : Ext.MessageBox.OK,
											icon : 'ext-mb-error'
										});
									}
								});

					
							}
				}
                    },{
                    	text : 'View Facet Translation',
                        iconCls : 'icon-menu-node',
                        id : 'opt_management_viewFacetTranslation_ui',
                        handler : function() {
                            var ids = global.setIdsByChooseIdsNO();
                            if (ids == '') {
                                Ext.Msg
                                        .alert('empty',
                                                'please select some items.');
                                return false;
                            } else {
								var status = global.getSelectionModel().selected.items[0].data.category;
					
								enhanceWinPanel = new Ext.Window({
									title : 'View Translation',
									width : 1000,
									height : 700,
									constrain : true,
									modal : true,
									closable : true,
									items : [],
									html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=' + status + '&viewOrEdit=view&recordIds=' + ids +'&extendInfo=FACET"> </iframe>',
									buttons : []
								});
								enhanceWinPanel.show();
                            }
                        }},
                    {
                        	text : 'Edit Facet Translation Value',
                            iconCls : 'icon-menu-node',
                            id : 'opt_management_facet_manuallyTranslation_ui',
                            disabled : window.parent.Ext.LOIS.isEnable('opt_management_facet_manuallyTranslation_ui'),
                            handler : function() {
    							var ids = global.setIdsByChooseIdsNO();
    							if (ids == '') {
    									Ext.Msg.alert(
    										'empty',
    										'please select some items.');
    									return false;
    							} else {
    								var status = global
    								.getSelectionModel().selected.items[0].data.category;
    								Ext.Ajax.request({
    									url : '../offering/checkOut!checkCheckOutStatus.action',
    									method : 'POST',
    									sync : false,
    									params : {
    										ids : ids
    									},success : function(response, option){
    										
    										enhanceWinPanel = new Ext.Window({
    											title : 'Edit Translation(* The values edit here will be reported and flattened to downstream instead of vendor translated value!)',
    											width : 1000,
    											height : 700,
    											constrain : true,
    											modal : true,
    											closable : true,
    											items : [],
    											html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=' + status + '&viewOrEdit=edit&recordIds=' + ids +'&extendInfo=FACET"> </iframe>',
    											buttons : []
    										});
    										enhanceWinPanel.show();
    									},failure : function(response, option){
    										Ext.MessageBox.show({
    											title : 'Message',
    											msg : 'System Error!',
    											buttons : Ext.MessageBox.OK,
    											icon : 'ext-mb-error'
    										});
    									}
    								});

    					
    							}
    				}}
                    ,{
                    	text : 'Download MT-Service Tier',
                        iconCls : 'icon-menu-node',
                        id : 'opt_management_downloadMTServiceTier_ui',
                        handler : function() {
                        	window.location.href ='../ph/mtServiceTierLink!downLinksToExcel.action';
                        }
                    }]
				}
			}, {
				text : '<b>DRR</b>',
				iconCls : 'icon-edit',  
				disabled : Ext.LOIS.isEnable('optsvc_offering_attribute_drr'),
				id : 'optsvc_offering_attribute_drr',
				handler : function() {
					var ids = global.setIdsByChooseIdsNO();
	                if (ids == '') {
	                    Ext.Msg
	                            .alert('empty',
	                                    'please select some items.');
	                    return false;
	                }
	                var records = global.getSelectionModel().getSelection();
	                var hierarchyCodes = [];
	                var conditions = [];
	                var numbers = [];
	                var pkIds = [];
					Ext.Array.each(records, function(record, i, all) {
								var hierarchyCode = record.get('hierarchyCode');
								var condition = record.get('status');
								var number = record.get('number');
								var id = record.get('id');
								if (condition!='' && number!='') {
									hierarchyCodes.push(hierarchyCode);
									conditions.push(condition);
									numbers.push(number);
									pkIds.push(id);
								}
							});
					Ext.Ajax.request({
						url : '../basic/drr!searchDrrApproverByHierarchyCode.action',
						method : 'POST',
						params : {
							objectType : 'OPT',
							productHierarchy : hierarchyCodes[0]
						},
						success : function(response,option) {
							if(response.responseText=="") 
			                { 	
			                   return; 
			                } 
							var res = Ext.JSON.decode(response.responseText);
							if(res.success){
								Ext.regModel('ETS', {
									idProperty: 'value',
									fields: [
										{name: "value"}, 
										{name: "text"}
									]        
								});
								var ds = Ext.create('Ext.data.ArrayStore', {
							        data: eval(res.values),
							        model: 'ETS',
							        sortInfo: {
							            field: 'value',
							            direction: 'ASC'
							        }
							    });
								var isForm = Ext.widget('form', {
									 width:  '100%',
								     bodyPadding: 10,
								     frame: true,
								     items:[{
								    	 xtype: 'container',
						                 layout: 'hbox',
						                 items:[{
						                    	msgTarget : 'side',
						                    	//regex:/^[0-9]{1,20}$/,
						            	 		//regexText:"Only input number !",
						                    	labelAlign: 'left',
						                    	xtype:'textfield',
						                    	fieldLabel: 'User Name',
						                    	id:'user_name',
						                        name: 'brand',
						                        width: 260,
						               			labelWidth: 100
						                 },{
						                	 xtype:'button',
							                 text: 'Search',
							                 iconCls:'icon-search',
							                 width: 80,
							                 x :280,
					                       	 margins: '0 0 0 9',
					                       	 listeners:{
												"click" : function() {
					                				var userName = isForm.form.findField('user_name').getValue();
					                				if(userName == "" || isForm.form.isValid()==false){
					                					Ext.MessageBox.alert('Error Message', "User name error !");
					                					return ;
					                				}
					                				 
								    			  Ext.MessageBox.confirm("Confirm", "Would you like to add user '"+ userName +"'  for OPT/SVR DRR review?", 
														function(btn){ 
														   if(btn == "yes"){
														   	var recordFlag = 0;
																	ds.each(function(record) { 													
																		  var idCode = record.data.value;
																		  idCode = idCode.substring(idCode.indexOf('(')+1,idCode.indexOf(')'));
																		  if(idCode == userName){													  		
																		    	recordFlag++;
																		   }
																		}); 
																	if(recordFlag==0){
																		  	Ext.Ajax.request 
																       ({ 
																          url:'../basic/drr!findUserByUserId.action?userId='+userName,
																         success:function(response,option) 
																         {                 
																                if(response.responseText=="") 
																                { 
																                   return; 
																                } 
																                   var res = Ext.JSON.decode(response.responseText);
																	                if(res.success){
																			                	var r = Ext.ModelMgr.create({
															                   				 	value: res.message,
															                    			 	text: res.message
															                				}, 'ETS');			                				
															                				ds.insert(0, r);
															                				var userName1 = isForm.form.findField('itemselector1');
															                				var selectedusers = isForm.form.findField('itemselector1').getValue();
															                				userName1.initComponent();
															                			    isForm.getForm().findField('itemselector1').setValue(selectedusers);
																	                	//  Ext.Msg.alert("Message",res.message); 
																	                }else{
																	                      Ext.Msg.alert("Message",res.message); 	
																	                }						                  
											               				                    	
										    	 						}, 
																		 failure:function() 
																		{ 
																		  Ext.Msg.alert("error","error"); 
																		} 
																		});  
											
																	}	
														   }
														}
												); 
					            				}
						                 }
						                 }]
								     },{
								            xtype: 'itemselector',
								            name: 'itemselector',
								            id:'itemselector1',
								            anchor: '90%',
								            height : 220,
								            fieldLabel: 'Select user',
								            imagePath: '../ux/images/',
								            store: ds,
								            displayField: 'text',
								            valueField: 'value',
								            msgTarget: 'side'
								     }],
								  buttons:[{
							            text: 'Submit',
							            iconCls:'icon-submit',
							            handler: function(){
							            	var btnSelf = this;
							                if(isForm.getForm().isValid()){
							                     var selectedusers = isForm.form.findField('itemselector1').getValue();
							                     if(selectedusers == ""){
							                     	  Ext.Msg.alert("Message","Must select one user and OPT/SVC at least!");
							                     	  return;
							                     }
							                     for(var idIndex in conditions){
								                     var status = conditions[idIndex];
								                     var number = numbers[idIndex];
								                     
								                     if(-1=="Change,RFR,Final".indexOf(status)){
								                     	Ext.Msg.alert("info","Only 'Change', 'RFR' or 'Final' could start DRR, but "+number+" is "+status);
								                     	return false;
								                     }
							                     }
							                     this.disable();
				                     		  	 Ext.Ajax.request 
												       ({ 
												          url:'../basic/drr!startDrr.action',
												          params:{
												          userIds:selectedusers,
												          offeringNumbers:pkIds,
												          objectType:"OPT/SVR",
												          offeringPns:numbers,
												          productHierarchy:hierarchyCodes[0]},
												         success:function(response,option) 
												         {       
												         	    if(response.responseText=="") 
												                { 
												                   return; 
												                } 
											                    var res = Ext.JSON.decode(response.responseText);
												                if(res.success){
												                	if(res.message == "1"){
												                		Ext.MessageBox.alert('Message', "Please select the same brand");
												                	}if(res.message == "2"){
														               Ext.Msg.show({
																	     title:'Notice',
																	     msg: 'OPT/SRV Drr start workflow successfully.Would you like to close this window?',
																	     buttons: Ext.Msg.YESNO,
																	     fn: function(btn){
																	     	if(btn == 'yes'){
																	     	
																	     		findParticipator.close();
																	     	}else{
																	     		btnSelf.setDisabled(true);
																	     		var reset = Ext.getCmp('reset');
		            															reset.setDisabled(true);
																	     	}
																	     }
																		}); 
												                	}else{
												                		Ext.MessageBox.alert('Message', res.message);
												                	}
														              	     			  
												                }else{
												                      Ext.Msg.alert("Message",res.message); 	
												                }	
						    	 						}, 
														 failure:function() 
														{ 
														  Ext.Msg.alert("error","error"); 
														} 
														}); 
							                }
							            }
								  },{
							            text: 'Reset',
							            id:'reset',
							            iconCls:'icon-reset',
							            handler: function(){
							                var field = isForm.getForm().findField('itemselector');
							                if (!field.readOnly && !field.disabled) {
							                    field.clearValue();
							                }
							            }
								  }]      
								});
								
					
								findParticipator   = new Ext.Window({
			                        layout: 'fit',
			                        height: 350, 
			                        width: 700,
			                        modal:true,
			                        title: 'Find Participator',
			                        id:'findWindow',
			                        closeAction: 'destroy',
			                        items: [isForm]
				              	});
						
							    findParticipator.show();
                    
			                }else{
			                      Ext.Msg.alert("Message",res.message); 	
			                }
						},
						failure : function() {
							Ext.MessageBox.show({
										title : 'Message',
										msg : 'drr Error!',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
						}
					});
				}
			}, {
				xtype : "tbseparator"
			}, {
				text : '<b>Undo</b>',
				iconCls : 'icon-edit',
				disabled : Ext.LOIS.isEnable('optsvc_offering_attribute_undo'),
				id : 'optsvc_offering_attribute_undo',
				handler : function() {
					var records = global.getSelectionModel().getSelection();
					var ids = [];
					Ext.Array.each(records, function(record, i, all) {
								var checkOut = record.get('checkOutUserName');
								if (checkOut != '') {
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
							type : 'OPT'
						},
						success : function(res, req) {
							var grid = Ext.ComponentQuery
									.query('searchressult')[0];
							grid.store.load();
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
			}, {
				text : '<b>AccBU OCM</b>',
				iconCls : 'icon-ocm-link',
				menu : {
					items : [{
						text : 'AccessBUOCM (UI)',  
						id : 'optsrv_accocm_ui',  
						//disabled : Ext.LOIS.isEnable('optsrv_accocm_ui'),
						iconCls : 'icon-menu-node',
						handler : function() {
							global.setIdsByChooseIds(global);
							if (global.ids == '') {
								Ext.Msg.alert('empty',
										'please select some items.');
								return false;
							}
							if (global.ids.length > 300) {
								Ext.Msg
										.alert('Error',
												'Colund not select more than 300 items while doing OCM.');
								return false;
							}
							ocmFlexPanel = new Ext.Window({
								title : 'Edit AccessBUOCM',
								width : 1000,
								height : 600,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								//' + global.ids +'
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../optsrv/accessBUOCMEditNew.html?recordIds=' + global.ids +'"> </iframe>',
								buttons : []
							});
							ocmFlexPanel.show();

						}
					},{    
						text : 'AccessBUOCM Loadsheet',
						id : 'optsrv_ocm_loadsheet',
						disabled : Ext.LOIS.isEnable('optsrv_ocm_loadsheet'),
						iconCls : 'icon-menu-node',
						handler : function() {
							var ids = global.setIdsByChooseIdsNO();
							if (ids == '') {
								Ext.Msg.alert('empty','please select some items.');
								return false;
							}

							global.ocmDialogc(ids);   
						}
					}]
				}
			}, {
				text : '<b>AccBU Loadsheet Upload</b>',
				iconCls : 'icon-loadsheet',
				menu : {
					items : [{
						text : 'AccessBUOCM Loadsheet(By Offering)',
						id : 'ocm_ls_byoffering',
						disabled : Ext.LOIS.isEnable('ocm_ls_byoffering'),
						iconCls : 'icon-menu-node',
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
								title : 'AccessBUOCM LoadSheet',
								width : 750,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=accOcmbyOffering&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
						}
					},{
						text : 'AccessBUOCM Loadsheet(By ProductHierarchy)',
						id : 'accocm_ls_byph',
						iconCls : 'icon-menu-node',
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
								title : 'AccessBUOCM LoadSheet',
								width : 780,
								height : 350,
								constrain : true,
								modal : true,
								closable : true,
								items : [],
								html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=accOcmbyph&userId='
										+ userId + '"> </iframe>'
							});
							enhanceWinPanel.show();
						}
					}]
				}
			}

			]
		});
		return this.toolbar;
	},
	loadLinksWin : function() {
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
							status : versionType,
							offeringType : 'OPT'
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
									var et = '../offering/updateLinks!listAllResult.action?message='
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
							url : '../offering/updateLinks!validateCheckOutStatus.action',
							params : {
								linkId : linkId,
								status : versionType,
								offeringType : 'OPT'
							},
							success : function(response, option) {
								var status = option.result.status;
								var fileName = option.result.fileName;
								var grid = Ext.ComponentQuery
										.query('searchressult')[0];
								grid.store.load();
								if (fileName != 'undefined') {
									if (fileName == 'null') {
										Ext.Msg.alert("error",
												"file is invalid.");
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
						url : '../offering/updateLinks!listAllResults.action',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var grid4 = new Ext.grid.GridPanel({
					height : 200,
					store : msgStore,
					columns : [new Ext.grid.RowNumberer(), {
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
		var loadLinksWin = new Ext.Window({
					width : 400,
					title : 'load update links',
					height : 300,
					closeAction : 'hide',
					constrain : true,
					items : [{
								border : false,
								items : [{
											region : 'center',
											items : [loadLinksForm]
										}, {
											region : 'south',
											height : 200,
											items : [grid4]
										}]
							}]
				});
		loadLinksWin.show();
	},
	createStore : function() {
		this.store = Ext.create('Ext.data.JsonStore', {
					remoteSort : true,
					// model : 'Task',
					pageSize : 100,
					fields : ['id', 'name', 'number', 'description', 'status',
							'offeringVersion', 'updatedTime', 'lastmodifyby',
							'createdTime', 'category','productType', 'category1',
							'category2','vcategory', 'checkOutUserName', 'updatedUserName',
							'updateTime', 'bacCode', 'mktRep', 'developer',
							'mfgerPn', 'osInformation', 'vlhFlag', 'specBid',
							'optMtm', 'OptMktContact', 'basewar',
							'ialNumber', 'earlyOrderWindowDate',
							'generalAvailabilityDate', 'locationCode',
							'productHierarchy', 'unspscCode',
							'marketingDescription', 'invoiceDescription',
							'audience','onlineChannel', 'announceDate', 'withdrawalDate',
							'wwLink', 'createdUserName', 'hierarchyCode',
							/**Begin  Add SVC Attribute  By wm**/
							'highAvailability','sdf','serviceCategory','serviceTier','applicability','applicabilityKey'
							/**End Add SVC Attribute  By wm**/
							],
					proxy : {
						timeout : 1500000,
						type : 'ajax',
						/**
						 * url : '../optsrv/opt!searchOptByCondition.action',
						 * reader : { type : 'json', root : 'children',
						 * totalProperty : 'totalCount' },
						 */
						url : '../optsrv/opt!findOfferingsByCondition.action',
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
					        }  ,
						simpleSortMode : true
					},
					sorters : [{
								property : 'number',
								direction : 'ASC'
							}]
				});
		return this.store;
	},
	CheckOutOrIn : function(ids, chType) {
		// var idsthis = this;
		Ext.Ajax.request({
					url : '../optsrv/opt!checkOutAndCheckInAction.action',
					method : 'get',
					async : false,
					params : {
						checkType : chType,
						ids : ids
					},
					success : function(opts, request) {

					}
				});
	},
	ocmDialog : function(ids) {
		var global = this;
		var mt_url;
		var mt_store = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var mt_store2 = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var mt_store3 = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});

		var form5 = Ext.create('Ext.form.FormPanel', {
			id : "mtm_searchForm",
			monitorValid : true,
			bodyStyle : 'padding:5px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				labelWidth : 70,
				labelAlign : "left",
				items : [{
					columnWidth : .5,
					layout : 'anchor',
					baseCls : 'x-plain',
					border : false,
					defaultType : 'textfield',
					defaults : {
						anchor : '98%'
					},
					items : [{

						fieldLabel : "Brand Name",
						xtype : "combo",
						name : 'brandName',
						store : mt_store,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local',
						listeners : {
							"expand" : function(v) {
								mt_url = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=Brand';
								mt_store.proxy.url = mt_url;
							},
							'select' : function(combo, record, index) {
								var mt_url = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=Series';
								mt_store3.proxy.url = mt_url;
								mt_store3.proxy.extraParams.parentId = combo
										.getValue();
								mt_store3.load();

								Ext.getCmp('serieeeeeeesId').reset();
								Ext.getCmp('subddddd').reset();
							}
						}
					}, {
						labelWidth : 100,
						fieldLabel : "Sub-Series Name",
						xtype : "combo",
						id : 'subddddd',
						name : 'subSeriesName',
						store : mt_store2,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local'
					}]
				}, {
					columnWidth : .5,
					layout : 'anchor',
					border : false,
					baseCls : 'x-plain',

					defaultType : 'textfield',
					defaults : {
						anchor : '98%'
					},
					items : [{
						xtype : "combo",
						fieldLabel : '&nbsp;&nbsp;Series Name',
						id : 'serieeeeeeesId',
						name : 'seriesName',
						store : mt_store3,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local',
						listeners : {
							"expand" : function() {

							},
							'select' : function(combo, record, index) {
								mt_store2.proxy.extraParams.parentId = combo
										.getValue();
								mt_url = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=SubSeries';
								mt_store2.proxy.url = mt_url;
								mt_store2.load();

								Ext.getCmp('subddddd').reset();
							}
						}
					}, {
						fieldLabel : "MT Name",
						name : 'inputCondition'
					}]
				}]
			}],
			buttons : [{
				text : "Search and Export EXCEL",
				handler : function() {
					var form5 = Ext.getCmp('mtm_searchForm').getForm();
					form5.standardSubmit = true;
					form5.submit({
								url : '../optsrv/ocmSeries!ocmExcelDownloadV2.action',
								params : {
									ids : ids,
									level : 5
								},
								
								// commends added zhangding1, 
								//method : 'POST',
								success : function(fp, o) {
									// Ext.getCmp('mtm_uploadWindow').close();
								},
								failure : function(form, action) {
									Ext.MessageBox.show({
												title : 'Message',
												msg : 'download Failed!',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
									});
								}
							});
				}
			}]
		});
		var compatibility_mt_store = Ext.create('Ext.data.Store',{
					// autoDestroy : true,
					model: 'Ext.optsvc.ocm.Model',
					//fields : ['OPTCATL1', 'PN'],
					proxy : {
						url:'../optsrv/ocmSeries!findChangeOffering.action',
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					sorters : [{
								property : 'OPTCATL1',
								direction : 'ASC'
							}]
				});

		var gridMaintain2 = Ext.create('Ext.grid.Panel', {
					id : 'button-grid23',
					height:180,
					//autoScroll:true,
					store : compatibility_mt_store,
					columnLines : true,
					columns : [new Ext.grid.RowNumberer(), {
								text : 'Category',
								width : 100,
								align : 'center',
								dataIndex : 'OPTCATL1'
							}, {
								text : 'OPT/SVC',
								width : 100,
								align : 'center',
								dataIndex : 'PN'
							}]

				});

		var win2222 = Ext.create('Ext.window.Window', {
					title : 'Maintain Compatibility of MT to OPT/SVC',
					//layout : {
					//	type : 'fit'
					//},
					width : 600,
					// height:400,
					// frame : true,
					modal : true,
					closable : true,
					closeAction : 'destroy',
					resizable : false,
					constrain : true,
					items : [form5, gridMaintain2]
				});

		var ch_radio = Ext.create('Ext.form.Panel', {
			labelWidth : 180,
			method : "post",
			width : "100%",
			defaults : {
				labelWidth : 300,
				width : 400
			},
			defaultType : 'textfield',
			labelAlign : "left",
			bodyStyle : 'padding:20px;',
			items : [{
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '1',
						fieldLabel : 'Maintain Compatibility of Opt/Svc to MT'

					}, {
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '2',
						fieldLabel : 'Maintain Compatibility of Opt/Svc to Sub-Series'
					}, {
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '3',
						fieldLabel : 'Maintain Compatibility of Opt/Svc to Series'
					}, {
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '4',
						fieldLabel : 'Maintain Compatibility of MT to Opt/Svc'
					}, {
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '5',
						fieldLabel : 'Maintain Compatibility of Sub-Series to Opt/Svc'
					}, {
						xtype : 'radiofield',
						name : 'radio1',
						inputValue : '6',
						fieldLabel : 'Maintain Compatibility of Series to Opt/Svc'
					}],
			buttons : [{
				text : 'OK',
				handler : function() {
					var rd_value = ch_radio.getForm().getValues()["radio1"];
					ch_radio.form.reset();
					// setIdsByChooseIds();
					if (rd_value == 1) {
						var winasa = Ext.create('Ext.optsrv.search.phmtWindow',
								{
									ids : ids
								});
						winasa.show();
					} else if (rd_value == 2) {
						var winasa = Ext.create(
								'Ext.optsrv.search.subseriesWindow', {
									ids : ids
								});
						winasa.show();
					} else if (rd_value == 3) {
						var winasa = Ext.create(
								'Ext.optsrv.search.phseriesWindow', {
									ids : ids
								});
						winasa.show();
					} else if (rd_value == 4) {
						win2222.show();
					} else if (rd_value == 5) {
						var winasa = Ext.create(
								'Ext.optsrv.search.optsubseriesWindow', {
									ids : ids
								});
						winasa.show();  
					} else if (rd_value == 6) {
						var winasa = Ext.create(
								'Ext.optsrv.search.optseriesWindow', {
									ids : ids
								});
						winasa.show();
					}
					closeWin()
				}
			}, {
				text : 'Cancel',
				handler : function() {
					closeWin();
				}
			}]
		});
		
		var ch_win = Ext.create('Ext.Window', {
			layout : {
				type : 'fit'
			},
			id : '232323d',
			width : 400,
			title : "Compatibility Management",
			resizable : false,
			closable : true,
			closeAction : 'destroy',
			plain : true,
			modal : true,
			items : [ch_radio]
		});

		ch_win.show();
		
		function closeWin() {
			ch_win.close();  
		}  
				
		win2222.on("beforeshow", function() {
					var et = '../optsrv/ocmSeries!findChangeOffering.action';
					compatibility_mt_store.proxy.url = et;
					compatibility_mt_store.load({
								params : {
									ids : ids
								}
							});
				});

		win2222.on("destroy", function() {
					compatibility_mt_store.query = false;
					Ext.destroyMembers(win2222, compatibility_mt_store,
							gridMaintain2, form5);
				});

	},
	ocmDialogc : function(ids) {
		var globalc = this;
		var mt_urlc;
		var mt_storec = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var mt_store2c = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var mt_store3c = new Ext.data.JsonStore({
					fields : ['value', 'text'],
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});

		var form5c = Ext.create('Ext.form.FormPanel', {
			id : "mtm_searchForm",
			monitorValid : true,
			bodyStyle : 'padding:5px 5px 0',
			items : [{
				layout : 'column',
				border : false,
				labelWidth : 70,
				labelAlign : "left",
				items : [{
					columnWidth : .5,
					layout : 'anchor',
					baseCls : 'x-plain',
					border : false,
					defaultType : 'textfield',
					defaults : {
						anchor : '98%'
					},
					items : [{

						fieldLabel : "Brand Name",
						xtype : "combo",
						name : 'brandName',
						store : mt_storec,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local',
						listeners : {
							"expand" : function(v) {  
								mt_urlc = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=Brand';
								mt_storec.proxy.url = mt_urlc;
							},
							'select' : function(combo, record, index) {
								var mt_urlc = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=Series';
								mt_store3c.proxy.url = mt_urlc;
								mt_store3c.proxy.extraParams.parentId = combo
										.getValue();
								mt_store3c.load();

								Ext.getCmp('serieeeeeeesId').reset();
								Ext.getCmp('subddddd').reset();
							}
						}  
					}, {
						labelWidth : 100,
						fieldLabel : "Sub-Series Name",
						xtype : "combo",
						id : 'subddddd',
						name : 'subSeriesName',
						store : mt_store2c,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local'
					}]
				}, {
					columnWidth : .5,
					layout : 'anchor',
					border : false,
					baseCls : 'x-plain',

					defaultType : 'textfield',
					defaults : {
						anchor : '98%'
					},
					items : [{
						xtype : "combo",
						fieldLabel : '&nbsp;&nbsp;Series Name',
						id : 'serieeeeeeesId',
						name : 'seriesName',
						store : mt_store3c,
						editable : false,
						emptyText : '',
						displayField : 'value',
						valueField : 'text',
						mode : 'local',
						listeners : {
							"expand" : function() {

							},
							'select' : function(combo, record, index) {
								mt_store2c.proxy.extraParams.parentId = combo
										.getValue();
								mt_urlc = '../optsrv/opt!findMTDropdown.action?drop_down_parameter=SubSeries';
								mt_store2c.proxy.url = mt_urlc;
								mt_store2c.load(); 

								Ext.getCmp('subddddd').reset();
							}
						}
					}, {
						fieldLabel : "MT Name",
						name : 'inputCondition'
					}]
				}]
			}],
			buttons : [{
				text : "Search and Export EXCEL",
				handler : function() {
					var form5c = Ext.getCmp('mtm_searchForm').getForm();
					form5c.standardSubmit = true;
					form5c.submit({
								url : '../optsrv/ocmSeries!AccOcmExcelDownloadV2.action',
								params : {
									ids : ids,
									level : 5
								},
								
								success : function(fp, o) {
								},
								failure : function(form, action) {
									Ext.MessageBox.show({
												title : 'Message',
												msg : 'download Failed!',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
									});
								}
							});
				}
			}]
		});
		var compatibility_mt_storec = Ext.create('Ext.data.Store',{
					model: 'Ext.optsvc.ocm.Model',
					proxy : {
						url:'../optsrv/ocmSeries!findChangeOffering.action',
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					},
					sorters : [{
								property : 'OPTCATL1',
								direction : 'ASC'
							}]
				});

		var gridMaintain2c = Ext.create('Ext.grid.Panel', {
					id : 'button-grid23',
					height:180,
					store : compatibility_mt_storec,
					columnLines : true,
					columns : [new Ext.grid.RowNumberer(), {
								text : 'Category',
								width : 100,
								align : 'center',
								dataIndex : 'OPTCATL1'
							}, {
								text : 'OPT/SVC',
								width : 100,
								align : 'center',
								dataIndex : 'PN'
							}]

				});

		var win2222c = Ext.create('Ext.window.Window', {
					title : 'AccessBU Maintain Compatibility of MT to OPT',
					width : 600,
					modal : true,
					closable : true,
					closeAction : 'destroy',
					resizable : false,
					constrain : true,
					items : [form5c, gridMaintain2c]
				});

		var ch_radioc = Ext.create('Ext.form.Panel', {
			labelWidth : 180,
			method : "post",
			width : "100%",
			defaults : {
				labelWidth : 300,
				width : 400
			},
			defaultType : 'textfield',
			labelAlign : "left",
			bodyStyle : 'padding:20px;',
			items : [{
						xtype : 'radiofield',
						name : 'radio2',
						inputValue : '10',
						fieldLabel : 'Maintain Compatibility of OPT to MT'
		
					}, {
						xtype : 'radiofield',
						name : 'radio2',
						inputValue : '11',
						fieldLabel : 'Maintain Compatibility of OPT to Sub-Series'
					}, {
						xtype : 'radiofield',
						name : 'radio2',   
						inputValue : '12',   
						fieldLabel : 'Maintain Compatibility of OPT to Series'
					}, {
						xtype : 'radiofield',
						name : 'radio2',        
						inputValue : '7',
						fieldLabel : 'Maintain Compatibility of MT to OPT'
					}, {  
						xtype : 'radiofield',
						name : 'radio2',
						inputValue : '8',
						fieldLabel : 'Maintain Compatibility of Sub-Series to OPT'
					}, {
						xtype : 'radiofield',
						name : 'radio2',
						inputValue : '9',
						fieldLabel : 'Maintain Compatibility of Series to OPT'
					}],
			buttons : [{
				text : 'OK',
				handler : function() {
					var rd_valuec = ch_radioc.getForm().getValues()["radio2"];
					ch_radioc.form.reset();
					if (rd_valuec == 7) {
						win2222c.show(); 
					} else if (rd_valuec == 8) {
						var winasa = Ext.create(
								'Ext.optsrv.search.accoptsubseriesWindow', {
									ids : ids
								});
						winasa.show();    
					} else if (rd_valuec == 9) {   
						var winasa = Ext.create(  
								'Ext.optsrv.search.accoptseriesWindow', {
									ids : ids 
								});
						winasa.show();
					}else if (rd_valuec == 10) {
						var winasa = Ext.create(
							   'Ext.optsrv.search.accphmtWindow',{
								   ids : ids
								});
						winasa.show();
					} else if (rd_valuec == 11) {  
								var winasa = Ext.create(
								'Ext.optsrv.search.accsubseriesWindow', {
								ids : ids
								});
						winasa.show();
					} else if (rd_valuec == 12) {
								var winasa = Ext.create(
								'Ext.optsrv.search.accphseriesWindow', {
								ids : ids
								});
						winasa.show();
					}
					closeWinc()
				}
			}, {
				text : 'Cancel',
				handler : function() {
					closeWinc();
				}  
			}]
		});

		var ch_winc = Ext.create('Ext.Window', {
			layout : {
				type : 'fit'
			},
			id : '232323c',
			width : 400,
			title : "AccessBU Compatibility Management",
			resizable : false,
			closable : true,
			closeAction : 'destroy',
			plain : true,
			modal : true,
			items : [ch_radioc]  
		});

		ch_winc.show();

		function closeWinc() {
			ch_winc.close();
		} 

		win2222c.on("beforeshow", function() {
					var et = '../optsrv/ocmSeries!findChangeOffering.action';
					compatibility_mt_storec.proxy.url = et;
					compatibility_mt_storec.load({
								params : {
									ids : ids
								}
							});
				});

		win2222c.on("destroy", function() {
					compatibility_mt_storec.query = false;
					Ext.destroyMembers(win2222c, compatibility_mt_storec,
							gridMaintain2c, form5c);
				});

	},
	setIdsByChooseIdsNO : function() {
		var ids = [];
		var grid = this;
		this.store.each(function(record) {
					if (grid.getSelectionModel().isSelected(record)) {
						if (!Ext.Array.contains(ids, record.get('id'))) {
							ids.push(record.get('id'));
						}
					}
				});
		return ids;
	},
	setPNsByChooseIdsNO : function() {
		var pns = [];
		var grid = this;
		this.store.each(function(record) {
					if (grid.getSelectionModel().isSelected(record)) {
						//if (!Ext.Array.contains(ids, record.get('number'))) {
						//alert(record.get('number'));
						pns.push(record.get('number'));
						//}
					}
				});
		return pns;
	},
	setIdsByChooseIds : function(me) {
		var ids = this.ids;
		var grid = this;
		var search = this.search;
		if (search == '0') {
			grid.store.each(function(record) {
						if (grid.getSelectionModel().isSelected(record)) {
							if (!Ext.Array.contains(ids, record.get('id'))) {
								ids.push(record.get('id'));
							}
						} else {
							if (Ext.Array.contains(ids, record.get('id'))) {
								Ext.Array.remove(ids, record.get('id'));
							}
						}
					});
		} else if (search == '1') {
			this.search = '0';
		}
	},
	executeQuery : function(projectName, offeringNumber, status, objectType,
			fileName) {
		this.store.on('beforeload', function(e) {
					e.proxy.extraParams.projectName = projectName;
					e.proxy.extraParams.offeringNumber = offeringNumber;
					e.proxy.extraParams.status = status;
					e.proxy.extraParams.objectType = objectType;
					e.proxy.extraParams.fileName = fileName;
				});
		this.store.load();
	},
	undo : function(ids) {
		Ext.Ajax.request({
					url : '../optsrv/opt!undo.action',
					method : 'get',
					async : false,
					params : {
						ids : ids
					},
					success : function(response, request) {
						var res = Ext.JSON.decode(response.responseText);
						if (res.msg == "ok") {
							Ext.Msg.alert("succes", "update success !")
						}
					}
				});
	},
	editAudData : function(ids) {
		var me = this;
		var modelNameAndxType = [];
		Ext.Ajax.request({
			url : '../optsrv/opt!dynamicLoadHeaders.action',
			method : 'post',
			async : false,
			success : function(opts, request) {
				modelNameAndxType = Ext.JSON.decode(opts.responseText).result[0].columModle;
			}
		});
		var marking_date_aud_store = new Ext.data.JsonStore({
					fields : ["id", "number", "name", "bacCode", "AUDIENCECOMBO", {
								name : "anncDate",
								type : "date",
								dateFormat : "m/d/Y"
							}, {
								name : "withdrawalDate",
								type : "date",
								dateFormat : "m/d/Y"
							}, "categroy"],
					url : '../optsrv/opt!findAudByCheckedId.action',
					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});
		var temp_value = "";
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 2
				});

		var marking_date_aud_grid = Ext.create('Ext.grid.CopyPasteGrid', {
           
			height : 300,
			store : marking_date_aud_store,
			selModel : {
				selType : 'cellmodel'
			},
			plugins : [cellEditing],
			multiSelect : true,
			columns : modelNameAndxType,
			columnLines : true,
			enableLocking : true,
			tbar : [{
				text : 'Check In',
				iconCls : "icon-checkin",
				handler : function() {
					global.CheckOutOrIn(ids, 'in');
					var listUpdateRecord = new Array();
					var store_record = marking_date_aud_store.data.items;
					marking_date_aud_store.each(function(record) {
								for (var i = 0; i < store_record.length; i++) {
									listUpdateRecord[i] = store_record[i].data;
								}
							});

					Ext.Ajax.request({
								url : '../optsrv/opt!updateAudAndData.action',
								params : {
									strJson : Ext.encode(listUpdateRecord)
								},
								success : function(response, option) {
									if (response.responseText == "") {
										return;
									}
									var res = Ext.JSON
											.decode(response.responseText);
											
									if (res.msg == "ok") {
										Ext.Msg.alert("succes",
												"update success !")

										global.store.load();
										marking_date_aud_win.close();
									} else if (res.msg == "no") {
										Ext.Msg.alert("info",
												"you have not modify record !")
									}
								},
								failure : function() {
									Ext.Msg.alert("error", "error");
								}

							});

				}
			}, {
				xtype : "tbseparator"
			}, {
				text : "Undo",
				id : 'btn_edit',
				iconCls : "icon-undo",
				handler : function() {
					me.undo(ids);
					marking_date_aud_win.close();
				}
			}, {
				xtype : 'tbfill'
			}, {
				xtype : 'button',
				iconCls : "icon-copy",
				text : 'Copy',
				handler : function() {
					var selected_items = marking_date_aud_grid.view
							.getSelectionModel().selected.items;
					if (selected_items.length == 0) {
						return;
					}
					var column = marking_date_aud_grid.getSelectionModel().position.column;
					var row = marking_date_aud_grid.getSelectionModel().position.row;
					var record = marking_date_aud_grid.store.getAt(row); // Get
					var fieldName = marking_date_aud_grid.view
							.getSelectionModel().selected.items[0].fields.items[column].name; // Get
					temp_value = record.get(fieldName);
				}
			}, {
				xtype : 'button',
				iconCls : "icon-paste",
				text : 'Paste',
				handler : function() {
					if (temp_value != "") {
						var column = marking_date_aud_grid.getSelectionModel().position.column;
						var row = marking_date_aud_grid.getSelectionModel().position.row;
						var record = marking_date_aud_grid.store.getAt(row); // Get
						var fieldName = marking_date_aud_grid.view
								.getSelectionModel().selected.items[0].fields.items[column].name; // Get
						record.set(fieldName, temp_value);
					}
				}
			}]

		});
		var global = this;

		var marking_date_aud_win = Ext.create('Ext.window.Window', {
					title : 'OPT/SVR Date/Aud Attributes Management',
					layout : {
						type : 'fit'
					},
					width : 800,
					constrain : true,
					resizable : false,
					closable : true,
					closeAction : 'destroy',
					plain : true,
					modal : true,
					constrain : true,
					items : marking_date_aud_grid

				});
		marking_date_aud_win.on("beforeshow", function() {
					var et = '../optsrv/opt!findAudByCheckedId.action';
					marking_date_aud_store.proxy.url = et;
					marking_date_aud_store.load({
								params : {
									ids : ids
								}
							});
				});
		marking_date_aud_win.on("destroy", function() {
					marking_date_aud_store.query = false;
					Ext.destroyMembers(marking_date_aud_win,
							marking_date_aud_store, marking_date_aud_grid);
				});
		marking_date_aud_win.show();
		// marking_date_aud_grid = null;
		// this.ids=null;
	},
	editMKT : function(ids) {
		/**
		 * me.undo(me.ids); marking_date_aud_win.close();
		 */
		var global = this;
		var ids_edit = [];
		var json_edit;
		/*
		 * var records = global.getSelectionModel().getSelection();
		 * Ext.Array.each(records, function(record, i, all) {
		 * ids_edit.push(record.get('id')); });
		 */
		Ext.Ajax.request({
					url : '../optsrv/opt!listColumFieldNameJsonString.action',
					method : 'get',
					async : false,
					success : function(opts, request) {

						json_edit = Ext.JSON.decode(opts.responseText).result;
					}
				});

		var marking_date_edit_store = new Ext.data.JsonStore({
					// model : 'editMKT',
					fields : ["id", "number", "name", "bacCode", "category1",
							"marketingDescription", "category2", "mktRep",
							"developer", "osInformation", "invoiceDescription",
							"vlhFlag", "specBid", "optMtm"],

					proxy : {
						type : 'ajax',
						reader : {
							type : 'json',
							root : 'root'
						}
					}
				});

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 2
				});
		var modifyRecords = [];
		var bt6 = new Ext.Button({
					text : 'Check In',
					iconCls : "icon-checkin",
					handler : function() {
						Ext.Array.each(marking_date_edit_store
										.getUpdatedRecords(), function(record,
										i, all) {
									modifyRecords.push(record.data);
								});
						Ext.Ajax.request({
									url : '../optsrv/opt!mktEditCheckIn.action',
									method : 'POST',
									params : {
										modifyRecords : Ext.JSON
												.encode(modifyRecords)
									},
									success : function(response, config) {
										var res = Ext.JSON
												.decode(response.responseText);
										if (res.success) {
											Ext.MessageBox.show({
														title : 'Message',
														msg : 'Check In successful!',
														buttons : Ext.MessageBox.OK,
														icon : 'ext-mb-info'
													});
										}
										global.CheckOutOrIn(ids, 'in');
										edit_win.close();
									},
									failure : function() {
										Ext.MessageBox.show({
													title : 'Message',
													msg : 'Check In Error!',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
									}
								});

					}
				});
		var bt7 = new Ext.Button({
					text : 'Undo',
					iconCls : "icon-undo",
					handler : function() {
						global.CheckOutOrIn(ids, 'in');
						edit_win.close();
					}
				});
		var temp_value = "";
		var bt8 = new Ext.Button({
			text : 'Copy',
			iconCls : "icon-copy",
			handler : function() {
				var selected_items = edit_grid.view.getSelectionModel().selected.items;
				if (selected_items.length == 0) {
					return;
				}
				var column = edit_grid.getSelectionModel().position.column;
				var row = edit_grid.getSelectionModel().position.row;
				var record = edit_grid.store.getAt(row); // Get the Record
				var fieldName = edit_grid.view.getSelectionModel().selected.items[0].fields.items[column].name; // Get
				temp_value = record.get(fieldName);
			}
		});
		var bt9 = new Ext.Button({
			text : 'Paste',
			iconCls : "icon-paste",
			handler : function() {
				if (temp_value != "") {
					var column = edit_grid.getSelectionModel().position.column;
					var row = edit_grid.getSelectionModel().position.row;
					var record = edit_grid.store.getAt(row); // Get the
					var fieldName = edit_grid.view.getSelectionModel().selected.items[0].fields.items[column].name; // Get
					record.set(fieldName, temp_value);
				}
			}
		});
		var edit_grid = new Ext.grid.GridPanel({
					height : 300,
					iconCls : 'icon-grid',
					plugins : [cellEditing],
					store : marking_date_edit_store,
					selModel : {
						selType : 'cellmodel'
					},
					columnLines : true,
					tbar : [bt6, '-', bt7, {
								xtype : 'tbfill'
							}, bt8, '-', bt9],
					columns : json_edit
				});

		var edit_win = Ext.create('Ext.Window', {
					title : 'OPT/SVR MKT edit',
					/*
					 * id : '200L', layout : { type : 'fit' },
					 */
					constrain : true,
					width : 800,
					resizable : false,
					closable : true,
					closeAction : 'destroy',
					plain : true,
					modal : true,
					items : [edit_grid]
				});

		edit_win.on("beforeshow", function() {
					var et = '../optsrv/opt!getEditedOfferingOptsByCheckedId.action';
					marking_date_edit_store.proxy.url = et;
					marking_date_edit_store.load({
								params : {
									ids : ids
								}
							});
				});
		edit_win.on("destroy", function() {
					marking_date_edit_store.query = false;
					Ext.destroyMembers(edit_win, marking_date_edit_store,
							edit_grid);
				});
		edit_win.show();
	},
	CheckOutOrIn : function(ids, chType) {

		Ext.Ajax.request({
					url : '../optsrv/opt!checkOutAndCheckInAction.action',
					method : 'get',
					async : false,
					params : {
						checkType : chType,
						ids : ids
					},
					success : function(opts, request) {

					}
				});
	},
	RemoveArray : function(array, attachId) {
		for (var i = 0, n = 0; i < array.length; i++) {
			if (array[i] != attachId) {
				array[n++] = array[i]
			}
		}
		array.length -= 1;
	},
	containsArray : function(array, attachId) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == attachId) {
				return true;
				break;
			}
		}
		return false;
	},
	doUpdateLinks : function() {
		var updateOptIds;
		var message = '';
		var linkId = '';
		if (this.ids.length == 0) {
			Ext.Msg.alert('empty', 'please select some items.');
		} else {
			updateOptIds = this.ids;
			var updateLinksStore = new Ext.data.JsonStore({
				fields : ['id', 'number', 'name', 'status', 'version'],
				remoteSort : true,
				pageSize : 10,
				proxy : {
					type : 'ajax',
					url : '../offering/updateLinksSearch!findOfferingByIds.action',
					reader : {
						type : 'json',
						root : 'results',
						totalProperty : 'totalCount'
					},
					simpleSortMode : true
				},
				listeners : {
					beforeload : function() {
						updateLinksStore.proxy.extraParams.offeringIds = updateOptIds;
					}
				}
			});

			var updateLinksForm = Ext.create('Ext.form.FormPanel', {
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
							elementName = elementName.replace('"', '&#34;');
							var form = updateLinksForm.getForm();
							form.standardSubmit = true;
							form.submit({
								url : '../offering/updateLinksSearch!downLinksToExcel.action?offeringType=OPT&offeringIds='
										+ updateOptIds
										+ '&elementName1='
										+ elementName,
								method : 'POST',
								success : function(form, action) {
									updateLinksWin.close();
								},
								failure : function() {
									Ext.Msg.alert("error",
											"sorry,error message!");
								}
							});
						}
					}
				}]
			});
			var updateLinksBottomBar = Ext.create('App.PagingToolbar', {
						pageSize : 10,
						store : updateLinksStore,
						displayInfo : true
					});

			var updateLinksGrid = new Ext.grid.GridPanel({
						height : 276,
						columnLines : true,
						store : updateLinksStore,
						bbar : updateLinksBottomBar,
						columns : [new Ext.grid.RowNumberer(), {
									dataIndex : "id",
									hidden : true
								}, {
									text : 'Number',
									flex : 1,
									dataIndex : 'number'
								}, {
									text : 'Name',
									flex : 1,
									dataIndex : 'name'
								}, {
									text : 'Status',
									flex : 1,
									dataIndex : 'status'
								}, {
									text : 'Version',
									flex : 1,
									dataIndex : 'version'
								}]
					});
			updateLinksStore.load();
			var updateLinksWin = new Ext.Window({
						layout : 'border',
						width : 600,
						height : 450,
						closeAction : 'hide',
						constrain : true,
						items : [{
									region : 'center',
									layout : 'border',
									border : false,
									items : [{
												region : 'center',
												layout : "fit",
												items : [updateLinksForm]
											}, {
												region : 'south',
												height : 300,
												collapsible : true,
												items : [updateLinksGrid]
											}]
								}]

					});
			updateLinksWin.show();
		}
	},
	onDestroy : function() {
		Ext.destroyMembers(this);
		this.callParent();
	}
});
