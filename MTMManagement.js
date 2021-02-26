Ext.Loader.setConfig({
	enabled : true
});
Ext.Loader.setPath("Ext.optsrv.js.attribute", "../optsrv/js/attribute");
Ext.Loader.setPath("Ext.optsrv.advsearch", "../optsrv/advSearch");
Ext.Loader.setPath("Ext.element.js", "../element/js");
Ext.Loader.setPath('Ext.common.manage', '../common');
Ext.require([ "Ext.mtm.WC.manage.CellEditing",
		"Ext.mtm.WC.manage.EditMTMAttribute",
		"Ext.common.manage.CommonViewTranslation",
		"Ext.common.manage.CommonEditTranslation",
		"Ext.mtm.WC.manage.ListCountrys", "Ext.element.js.elementsList","Ext.optsrv.js.js.element.element_link_grid",
		"Ext.mtm.WC.manage.commonWindow", "Ext.mtm.WC.manage.linkCountrys",
		"Ext.mtm.WC.manage.sbbList","Ext.mtm.WC.manage.svcList", "Ext.mtm.WC.manage.Action",
		"Ext.optsrv.advsearch.optsrv_advS", "Ext.optsrv.js.attribute.edit" ]);
var selectedIds = '';
Ext.define(
				"Ext.mtm.WC.manage.MTMManagement",
				{
					extend : "Ext.container.Container",
					alias : "widget.WC-mTMManagement",
					id :"WC-mTMManagement",
					elementsStr : "",
					elementTypesStr : "",
					objectsStr : "",
					objectType : "",
					// ---- flex UI, edit translation start
					elementsStrForEditTrans : '',

					elementTypesStrForEditTrans : '',

					objectsStrForEditTrans : '',

					objectTypeForEditTrans : '',
					// ----- flex UI, edit translation start
					recordIds : [] ,
					title : "Loading...",
					ids : [],
					queryParams : {},
					initComponent : function() {
						//override method of array begin
						this.recordIds = [] ;
						function RemoveArray(array, attachId) {
							for (var i = 0, n = 0; i < array.length; i++) {
								if (array[i] != attachId) {
									array[n++] = array[i]
								}
							}
							array.length -= 1;
						}
						function containsArray(array, attachId) {
							for (var i = 0; i < array.length; i++) {
								if (array[i] == attachId) {
									return true;
									break;
								}
							}
							return false;
						}
						Array.prototype.remove = function(obj) {
							return RemoveArray(this, obj);
						};
						Array.prototype.contains = function(obj) {
							return containsArray(this, obj);
						};
						//override method of array end
						var h = this;
						Ext
								.override(
										Ext.grid.GridPanel,
										{
											getExcelXml : function(k) {
												var l = this.createWorksheet(k);
												return '<xml version="1.0" encoding="utf-8"><ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office"><o:DocumentProperties><o:Title>cto lois data</o:Title></o:DocumentProperties><ss:ExcelWorkbook><ss:WindowHeight>'
														+ l.height
														+ "</ss:WindowHeight><ss:WindowWidth>"
														+ l.width
														+ '</ss:WindowWidth><ss:ProtectStructure>True</ss:ProtectStructure><ss:ProtectWindows>True</ss:ProtectWindows></ss:ExcelWorkbook><ss:Styles><ss:Style ss:ID="Default"><ss:Alignment ss:Vertical="Top" ss:WrapText="1" /><ss:Font ss:FontName="arial" ss:Size="10" /><ss:Borders><ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" /><ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" /><ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" /><ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" /></ss:Borders><ss:Interior /><ss:NumberFormat /><ss:Protection /></ss:Style><ss:Style ss:ID="title"><ss:Borders /><ss:Font /><ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" /><ss:NumberFormat ss:Format="@" /></ss:Style><ss:Style ss:ID="headercell"><ss:Font ss:Bold="1" ss:Size="10" /><ss:Alignment ss:WrapText="1" ss:Horizontal="Center" /><ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" /></ss:Style><ss:Style ss:ID="even"><ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" /></ss:Style><ss:Style ss:Parent="even" ss:ID="evendate"><ss:NumberFormat ss:Format="mm/dd/yyyy" /></ss:Style><ss:Style ss:Parent="even" ss:ID="evenint"><ss:NumberFormat ss:Format="0" /></ss:Style><ss:Style ss:Parent="even" ss:ID="evenfloat"><ss:NumberFormat ss:Format="0.00" /></ss:Style><ss:Style ss:ID="odd"><ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" /></ss:Style><ss:Style ss:Parent="odd" ss:ID="odddate"><ss:NumberFormat ss:Format="mm/dd/yyyy" /></ss:Style><ss:Style ss:Parent="odd" ss:ID="oddint"><ss:NumberFormat ss:Format="0" /></ss:Style><ss:Style ss:Parent="odd" ss:ID="oddfloat"><ss:NumberFormat ss:Format="0.00" /></ss:Style></ss:Styles>'
														+ l.xml
														+ "</ss:Workbook>"
											},
											createWorksheet : function(n) {
												var C = [];
												var z = [];
												var p = 0;
												var m = "";
												var E = "";
												var q = 0;
												for ( var G = 2; G < h.grid.columns.length; G++) {
													if ((h.grid.columns[G].text != "")
															&& (n || !h.grid.columns[G]
																	.isHidden())) {
														var u = h.grid.columns[G]
																.getWidth();
														p += u;
														if (h.grid.columns[G].text == "") {
															C.push("None");
															z.push("");
															++q
														} else {
															m += '<ss:Column ss:AutoFitWidth="1" ss:Width="'
																	+ u
																	+ '" />';
															E += '<ss:Cell ss:StyleID="headercell"><ss:Data ss:Type="String">'
																	+ h.grid.columns[G].text
																	+ '</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
															C.push("String");
															z.push("")
														}
													}
												}
												var H = C.length - q;
												var s = {
													height : 9000,
													width : Math.floor(p * 30) + 50
												};
												var y = '<ss:Worksheet ss:Name="mtm data"><ss:Names><ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'mtm data\'!R1:R2" /></ss:Names><ss:Table x:FullRows="1" x:FullColumns="1" ss:ExpandedColumnCount="'
														+ (H + 2)
														+ '" ss:ExpandedRowCount="'
														+ (h.store.getCount() + 2)
														+ '">'
														+ m
														+ '<ss:Row ss:Height="38"><ss:Cell ss:StyleID="title" ss:MergeAcross="'
														+ (H - 1)
														+ '"><ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String"><html:B >Generated by Lenovo Lois System</html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell></ss:Row><ss:Row ss:AutoFitHeight="1">'
														+ E + "</ss:Row>";
												for ( var G = 0, o = h.store.data.items, B = o.length; G < B; G++) {
													y += "<ss:Row>";
													var A = (G & 1) ? "odd"
															: "even";
													r = o[G].data;
													var D = 0;
													for ( var F = 2; F < h.grid.columns.length; F++) {
														if ((h.grid.columns[F].text != "")
																&& (n || !h.grid.columns[F]
																		.isHidden())) {
															var x = r[h.grid.columns[F].dataIndex];
															if (C[D] !== "None") {
																y += '<ss:Cell ss:StyleID="'
																		+ A
																		+ z[D]
																		+ '"><ss:Data ss:Type="'
																		+ C[D]
																		+ '">';
																if (x != null) {
																	y += x
																} else {
																	if (x == null) {
																		y += ""
																	}
																}
																y += "</ss:Data></ss:Cell>"
															}
															D++
														}
													}
													y += "</ss:Row>"
												}
												s.xml = y
														+ '</ss:Table><x:WorksheetOptions><x:PageSetup><x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" /><x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" /><x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" /></x:PageSetup><x:FitToPage /><x:Print><x:PrintErrors>Blank</x:PrintErrors><x:FitWidth>1</x:FitWidth><x:FitHeight>32767</x:FitHeight><x:ValidPrinterInfo /><x:VerticalResolution>600</x:VerticalResolution></x:Print><x:Selected /><x:DoNotDisplayGridlines /><x:ProtectObjects>True</x:ProtectObjects><x:ProtectScenarios>True</x:ProtectScenarios></x:WorksheetOptions></ss:Worksheet>';
												return s
											}
										});
						this.contextMenu = Ext
								.create(
										"Ext.menu.Menu",
										{
											items : [
													{
														text : "Controlled Update Links",
														iconCls : "icon-controlled-update-link",
														width : 90,
														handler : function() {
															h
																	.getSelectedIds(h.grid);
															if (h.ids == "") {
																Ext.Msg
																		.alert(
																				"empty",
																				"please select some items.");
																return
															}
															var l = false;
															h.grid.store
																	.each(function(
																			n) {
																		if (h.grid
																				.getSelectionModel()
																				.isSelected(
																						n)) {
																			var m = n.data.status;
																			if (m != "Final") {
																				l = true
																			}
																		}
																	});
															if (l) {
																Ext.Msg
																		.alert(
																				"empty",
																				'Only "Final" status MTM allow this action!');
																return
															}
															h.CheckOutOrIn(
																	h.ids,
																	"out");
															var k = Ext
																	.create(
																			"Ext.optsrv.advsearch.optsrv_advS",
																			{
																				ids : h.ids,
																				vn : "max"
																			});
															k.show()
														}
													},
													"-",
													{
														text : "Update Links",
														iconCls : "icon-update-link",
														width : 90,
														handler : function() {
															h
																	.getSelectedIds(h.grid);
															if (h.ids == "") {
																Ext.Msg
																		.alert(
																				"empty",
																				"please select some items.");
																return
															}
															h.CheckOutOrIn(
																	h.ids,
																	"out");
															var k = Ext
																	.create(
																			"Ext.optsrv.advsearch.optsrv_advS",
																			{
																				ids : h.ids,
																				vn : "min"
																			});
															k.show()
														}
													} ]
										});
						var g;
						var f;
						var j;
						var b;
						var d;
						var i;
						var e;
						var a;
						var c;
						
						/*
		 * mtm adhoc param  start
		 */
		var adhocAttribute1Name = '';
		var adhocAttribute1Value = '';
		var adhocValueD1From = '';
		var adhocValueD1To = '';
		var adhocValueFlag1 = '';
		var adhocAttribute2Name = '';
		var adhocAttribute2Value = '';
		var adhocValueD2From = '';
		var adhocValueD2To = '';
		var adhocValueFlag2 = '';
		var adhocAttribute3Name = '';
		var adhocAttribute3Value = '';
		var adhocValueD3From = '';
		var adhocValueD3To = '';
		var adhocValueFlag3 = '';
		var adhocAnnounceDateFrom = '';
		var adhocAnnounceDateTo = '';
		var adhocExcludeWDPNs = '';
		var adhocFileCondition = '';
		var adhocPhPage = '';
		/*
		 * end
		 */
						
						this.grid = Ext
								.create(
										"Ext.grid.Panel",
										{
											frame : true,
											autoScroll : true,
											store : this.createStore(),
											selModel : Ext
													.create(
															"Ext.selection.CheckboxModel",
															{
																listeners : {
																	selectionchange : function(
																			l,
																			k) {
																		Ext.LOIS
																				.setEnableByTypeAndStatus(
																						Ext.LOIS.TYPE.MTM_WC,
																						k)
																	},
																	select : function(
																			m,
																			k,
																			l) {
																		if (m
																				.getSelection().length == m.store.data.length) {
																			Ext.LOIS
																					.setEnableByTypeAndStatus(
																							Ext.LOIS.TYPE.MTM_WC,
																							m
																									.getSelection())
																		}
																	}
																}
															}),
											columns : [
													{
														xtype : "actioncolumntext",
														header : "Operation",
														width : 290,
														align : "left",
														items : [
																{
																	icon : "SBB Info",
																	tooltip : "SBB Info",
																	handler : function(
																			m,
																			q,
																			l) {
																		var p = m.store
																				.getAt(q);
																		if (!Ext.LOIS
																				.isEnable("mtm_wc_sbb_info")) {
																			var n = [];
																			n
																					.push(p
																							.get("id"));
																			var k = Ext
																					.createWidget("WC-sbbList");
																			k.store
																					.getProxy().extraParams.ids = n;
																			k.store
																					.load();
																			var o = Ext
																					.createWidget(
																							"WC-commonWindow",
																							{
																								item : k,
																								title : "SBB Info",
																								height : 500,
																								width : 650
																							});
																			o
																					.show()
																		} else {
																			alert("no permission!")
																		}
																	}
																},{
																    icon:"SBB Edit",
																    tooltip:"SBB Edit Info",
																    handler : function(m,q,l) {
																		var p = m.store.getAt(q);
																			    var n = [];
																		        n.push(p.get("id"));
																				var urlMap=window.parent.urlMap;
																                var  sbbid = urlMap.get('SBB-management');
																				var center = Ext.getCmp('center-tabs');
																				var offeringObject	= Ext.getCmp(sbbid);
																				Ext.Msg.confirm("Sbb Searching",
											                                                    "Do you want to close the current SBB maintain tab to see these SBBs?",
								                                                function(btn){ 
									                                                          if (btn == 'yes'){
									                                                          	if(offeringObject == undefined){
																					       var tab_n =  center.add({
																								title:'Maintain SBB',
																								id:sbbid,		 
																								xtype: 'SBB-management',
																								iconCls: 'tabs',
																								closable: true
																							}); 
																						    offeringObject = Ext.ComponentQuery.query('SBB-management')[0];
																				    }
																					        center.setActiveTab(offeringObject);
																					        var et = '../offering/searchSbbsByOfferId!findSbbsByOfferingId.action';
																							offeringObject.store.proxy.url = et;
																							offeringObject.store.getProxy().extraParams.offeringId = n;
																							adhoc_offeringId = n;
																							adhoc_adhoc = '2';
																							offeringObject.store.currentPage = 1;
																							offeringObject.store.load({
																							params : {
																								offeringId:n
																								}
																								});	
									                                                          }else{ 
																								 return false; 
																								}});
																				     	        			
																	}		    
																},{//start 2014 lois-egb dev

																	icon : "SVC Info",
																	tooltip : "SVC Info",
																	handler : function(m,q,l) {
																		var p = m.store.getAt(q);
																		if (!Ext.LOIS.isEnable("mtm_wc_sbb_info")) {
																			var n = [];
																			n.push(p.get("id"));
																			
																			Ext.Ajax.request({
																			    url: '../optsrv/opt!findOfferingsCountByOfferingNumber.action',
																			    params: {
																			        ids: n
																			    },
																			    success: function(response){
																			    	
																			        var count = Ext.JSON.decode(response.responseText).linkCount;
																			        if(count != 0){
																			        	var k = Ext.createWidget("WC-svcList");
																						k.store.getProxy().extraParams.ids = n;
																						k.store.load();
																						var o = Ext.createWidget("WC-commonWindow",
																										{
																											item : k,
																											title : "SVC Info",
																											height : 500,
																											width : 650
																										});
																						o.show();
																			        }else{
																			        	Ext.Msg.alert('message','no data!');
																			        }
																			    }
																			});
																			
																		} else {
																			alert("no permission!");
																		}
																	}
																
																},{

																    icon:"SVC Edit",
																    tooltip:"SVC Edit Info",
																    handler : function(m,q,l) {
																		var p = m.store.getAt(q);
																			    var n = [];
																		        n.push(p.get("id"));
																				var urlMap=window.parent.urlMap;
																                var  svcid = urlMap.get('searchoptsrv');
																				var center = Ext.getCmp('center-tabs');
																				var offeringObject	= Ext.getCmp(svcid);
																				 Ext.Ajax.request({
																					    url: '../optsrv/opt!findOfferingsCountByOfferingNumber.action',
																					    params: {
																					        ids: n
																					    },
																					    success: function(response){
																					    	
																					        var count = Ext.JSON.decode(response.responseText).linkCount;
																					        if(count != 0){
																					        
					                                                        	  
																				Ext.Msg.confirm("Svc Searching",
											                                                    "Do you want to close the current SVC maintain tab to see these SVCs?",
								                                                function(btn){ 
									                                                          if (btn == 'yes'){
									                                                        	 
									                                                          	if(offeringObject == undefined){
																					       var tab_n =  center.add({
																								title:'Maintain SVC',
																								id:svcid,		 
																								xtype: 'searchoptsrv',
																								iconCls: 'tabs',
																								closable: true
																							}); 
//																					       offeringObject =   Ext.ComponentQuery.query('searchressult')[0]
//																						    offeringObjectParent = Ext.ComponentQuery.query('searchoptsrv')[0];
																				    }
									                                                        offeringObject =   Ext.ComponentQuery.query('searchressult')[0];
									                                                        offeringObjectParent = Ext.ComponentQuery.query('searchoptsrv')[0];
																					        center.setActiveTab(offeringObjectParent);
																					        var et = '../optsrv/opt!findOfferingsByOfferingNumber.action';
																							offeringObject.store.proxy.url = et;
																							offeringObject.moreSearch = true;
																							offeringObject.store.getProxy().extraParams.ids = n;
																							offeringObject.offeringIds = n;
																							adhoc_offeringId = n;
																							adhoc_adhoc = '2';
																							offeringObject.store.currentPage = 1;
																							offeringObject.store.load({
																							params : {
																								ids:n
																								}
																								});	
																									        
																									       
									                                                          }else{ 
																								 return false; 
																								}
									                                                          
																				});
																				
																					        }else{
																				        	Ext.Msg.alert('message','no data!');
																				        	return false;
																				        }
																				    }
																			 });	        
																				     	        			
																	}		    
																
																},{
																	icon : "Country Link",
																	tooltip : "Country Link Info",
																	handler : function(
																			l,
																			o,
																			k) {
																		var n = l.store
																				.getAt(o);
																		if (Ext.LOIS
																				.getEnableByTypeAndStatus(
																						Ext.LOIS.TYPE.MTM_WC,
																						n
																								.get("status"),
																						"mtm_wc_country_link")) {
																			var m = [];
																			m
																					.push(n
																							.get("id"));
																			Ext.Ajax
																					.request({
																						url : "../offering/updateCountryLink!findAllRegionsAndLinkCountrys.action",
																						method : "GET",
																						params : {
																							objectType : n
																									.get("productType"),
																							ids : m
																						},
																						success : function(
																								p,
																								q) {
																							var s = Ext.JSON
																									.decode(p.responseText);
																							if (s.msg) {
																								Ext.MessageBox
																										.show({
																											title : "Message",
																											msg : s.msg,
																											buttons : Ext.MessageBox.OK,
																											icon : "ext-mb-info"
																										});
																								return
																							} else {
																								var t = Ext
																										.createWidget(
																												"WC-linkCountrys",
																												{
																													ids : m,
																													regions : s.regions,
																													countrys2 : s.countrys2,
																													objectType : n
																															.get("productType"),
																													partnumber : n.get("number")		
																												});
																								t.submit_url = "../offering/updateCountryLink!updateLinkCountrys.action";
																								t.cancel_url = "../offering/updateCountryLink!undo.action";
																								t
																										.show()
																							}
																						},
																						failure : function() {
																							return
																						}
																					})
																		} else {
																			alert("no permission!")
																		}
																	}
																} ]
													},
													{
														header : "Checkout By",
														dataIndex : "checkOutUserName",
														sortable: false,
														align : "left",
														width: 156,
														renderer : function(k) {
															if (k) {
																return "<font color='red'>"
																		+ k
																		+ "</font>"
															}
														}
													},
													{
														header : "MTM Number",
														dataIndex : "number",
														align : "left",
														width: 116
													},
													{
														header : "Name",
														dataIndex : "name",
														align : "left",
														width: 131
													},{
														header : "Status",
														dataIndex : "status",
														align : "left",
														width: 100
													},{
														header : "ProductHierarchy",
														dataIndex : "productHierarchy",
														align : "left",
														width: 156
													},{
														header : "Early Order Window",
														dataIndex : "earlyOrderWindowDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},{
														header : "Announce Date",
														dataIndex : "announceDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},
													{
														header : "Version",
														dataIndex : "offeringVersion",
														 sortable: false,
														align : "left",
														width: 88
													},
													{
														header : "Object Type",
														dataIndex : "productType",
														align : "left",
														width: 100
													},{
														header : "Code Name",
														dataIndex : "code_Name",
														align : "left",
														width: 100	
													},{
														header : "PorNumberVersion",
														dataIndex : "porVersionNumber",
														align : "left",
														width: 156
													},{
														header : "Audience",
														dataIndex : "audience",
														align : "left",
														width: 156
													},{
														header : "CustomModelFlag",
														dataIndex : "customModelFlag",
														align : "left",
														width: 100
													},
													{
														header : "ESP Code",
														dataIndex : "espCode",
														align : "left",
														width: 100
													},{
														header : "WW Link",
														dataIndex : "wwLink",
														align : "left",
														width: 100
													},{
														header : "IAL Number",
														dataIndex : "ialNumber",
														align : "left",
														width: 100
													},{
														header : "Base Warranty",
														dataIndex : "basewar",
														align:"left"
													},{
														header : "Base Warranty Description",
														dataIndex : "base_Warranty_Description",
														align : "left"
													},{
														header : "General Availability",
														dataIndex : "generalAvailabilityDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},
													{
														header : "Withdrawal Date",
														dataIndex : "withdrawalDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},{
														//wm PGI
														header : "Qualification Date",
														dataIndex : "qualification_Date",
														align : "left",
														width:100,
														renderer : Ext.util.Format
														.dateRenderer("m/d/Y")
													},{
														header : "Derived Announce Date",
														dataIndex : "derived_Announce_Date",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
														.dateRenderer("m/d/Y")
													},{
														header : "RTM Date",
														dataIndex : "rtm_Date",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
														.dateRenderer("m/d/Y")
													},{
														header : "Marketing Description",
														dataIndex : "mktdescription",
														align : "left",
														width: 228
													},{
														header : "Invoice Description",
														dataIndex : "ivoicedescription",
														align : "left",
														width: 156
													},
													{
														header : "UnspscCode",
														dataIndex : "unspscCode",
														align : "left",
														width: 100
													},{
														header : "Global Model",
														dataIndex : "global_Model",
														align : "left",
														width : 100
													},{
														header : "LocationCode",
														dataIndex : "locationCode",
														align : "left",
														width: 108
													},{
														header : "Launch Event",
														dataIndex : "launch_Event",
														align : "left",
														width : 100
													},{
														header : "EC Number",
														dataIndex : "ecNumber",
														align : "left",
														width: 124
													},{
														header : "upc_ean_jan_code",
														dataIndex : "upc_ean_jan_code",
														align : "left",
														width : 124
													},{
														header : "upc_ean_jan_type",
														dataIndex : "upc_ean_jan_type",
														align : "left",
														width : 100
													},{
														header : "Last Modify",
														dataIndex : "updateDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},
													{
														header : "Last Modify By",
														dataIndex : "updatedUserName",
														sortable: false,
														align : "left",
														width: 156
													},
													{
														header : "Create On",
														dataIndex : "createdDate",
														align : "left",
														width: 100,
														renderer : Ext.util.Format
																.dateRenderer("m/d/Y")
													},
													{
														header : "Create By",
														dataIndex : "createdUserName",
														sortable: false,
														align : "left"
													},
													{
														header : "Top_Seller_Flag",
														dataIndex : "top_seller_flag",
														align : "left",
														width : 100
													},{
														header : "ESS_FLAG",
														dataIndex : "ess_flag",
														align : "left",
														hidden:true,
														width : 100
													}],
											columnLines : true,
											tbar : this.createToolbar(),
											bbar : Ext.create(
													"App.PagingToolbar", {
														store : this.store,
														displayInfo : true
													}),
											viewConfig : {
												stripeRows : true,
												listeners : {
													itemcontextmenu : function(
															k, o, m, l, n) {
														n.stopEvent();
														h.contextMenu.showAt(n
																.getXY());
														return false
													}
												}
											}
										});
						this.elementsList = Ext.createWidget("elementsList", {
							isShowTbar : false,
							objectType : "WC"
						});
						Ext.apply(this, {
							layout : {
								type : "vbox",
								align : "stretch",
								pack : "start"
							},
							itemId : "mtm_mTMManagement_WC_mmr",
							items : [ {
								itemId : "mtm_mTMManagement_WC_down",
								items : this.grid,
								layout : "fit",
								flex : 1,
								border : false,
								animCollapse : false,
								collapsible : true
							}, {
								itemId : "mtm_mTMManagement_WC_down2",
								items : this.elementsList,
								layout : "fit",
								flex : 1,
								border : false,
								animCollapse : false,
								collapsible : true
							} ]
						});
						this.callParent(arguments);
						this.store.on("beforeload", this.onBeforeloadEvent,
								this);
						this.grid.on("itemdblclick", this.onItemdblclick, this);
						this.store.on("load", this.onStoreLoadEvent, this)
					},
					getSelectedIds : function(a) {
						var b = this.ids;
						a.store.each(function(c) {
							if (a.getSelectionModel().isSelected(c)) {
								if (!Ext.Array.contains(b, c.get("id"))) {
									b.push(c.get("id"))
								}
							} else {
								if (Ext.Array.contains(b, c.get("id"))) {
									Ext.Array.remove(b, c.get("id"))
								}
							}
						})
					},
					fromPH : '0',
					onBeforeloadEvent : function(a) {
						var b = this;
						if(b.fromPH=='0'){
						this.getSelectedIds(b.grid);
						b.store.getProxy().extraParams = b.queryParams
						}
					},
					onStoreLoadEvent : function(c, b, e, a) {
						var d = this;
						Ext.Array.each(b, function(f, g, h) {
							Ext.Array.each(d.ids, function(l, j, k) {
								if (l == f.get("id")) {
									d.grid.getSelectionModel().select(f, true,
											false);
									return false
								}
							})
						})
					},
					getValues : function() {
						var a = this;
						var b = {};
						this.getSelectedIds(a.grid);
						Ext.iterate(a.queryParams, function(c, d) {
							b[c] = d
						}, this);
						if (a.ids.length > 0) {
							b.ids = a.ids
						}
						b.objectType = "MTM";
						return b
					},
					onItemdblclick : function(g, a, f, b, h) {
						var d = [];
						d.push(a.get("id"));
						var c = this.elementsList;
						c.ids = d;
						c.store.getProxy().extraParams.offeringId = d;
						c.store.load()
					},
					createStore : function() {
						var me = this;
						this.store = Ext.create("Ext.data.Store", {
							model : "Ext.mtm.WC.Model",
							pageSize : Ext.LOIS.Config.pageSize,
							remoteSort : true,
							proxy : {
								type : "ajax",
								url : "../mtm/wcPor!search.action",
								method : "POST",
								timeout : 1800000,
								reader : {
									type : "json",
									root : "results",
									totalProperty : "totalCount"
								},actionMethods: {  
						            create : 'POST',  
						            read   : 'POST', // by default GET  
						            update : 'POST',  
						            destroy: 'POST'  
						        }  ,
								simpleSortMode : true
							},
							// comments added by zhangding1
							// Function team requires: 
							// Do not sort when using search condition window to search at the first time.
							// User requires to roll back. added by zhangding1, May 23th, 2012.
							sorters : [ {
								property : "number",
								direction : "ASC"
							} ],
							listeners : {
								load : function() {
									var records = new Array();
									me.store.each(function(record) {
												if (me.recordIds.contains(record.get('id'))) {
													records.push(record);
												}
											});
								  me.grid.getSelectionModel().select(records, true, false);
								},
								beforeload : function() {
									me.store.each(function(record) {
					
												if (me.grid.getSelectionModel().isSelected(record)) {
													if (!me.recordIds.contains(record.get('id'))) {
														me.recordIds.push(record.get('id'));
													}
												} else {
													if (me.recordIds.contains(record.get('id'))) {
														me.recordIds.remove(record.get('id'));
													}
												}
											});
								}
							}
							
						});
						return this.store
					},
					checkCheckOutStatus : function(b) {
						var c = this;
						var a = "";
						Ext.Ajax
								.request({
									url : "../offering/checkOut!checkCheckOutStatus.action",
									method : "POST",
									async : false,
									params : {
										ids : b
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
									},
									failure : function() {
										Ext.MessageBox.show({
											title : "Message",
											msg : "Checkout Error!",
											buttons : Ext.MessageBox.OK,
											icon : "ext-mb-error"
										})
									}
								});
						if (a == false) {
							return false
						} else {
							if (a == true) {
								return true
							}
						}
					},
					createToolbar : function() {
						var b = this;
						var a = Ext
								.create(
										"widget.toolbar",
										{
											items : [
													{
														text : "<b>Search</b>",
														iconCls : "icon-search",
														disabled : Ext.LOIS
																.isEnable("mtm_wc_search"),
														id : "mtm_wc_search",
														handler : function() {
															var c = Ext
																	.createWidget("WC-searchForm");
															var d = Ext
																	.createWidget(
																			"WC-commonWindow",
																			{
																				item : c,
																				title : "MTM Search Criteria",
																				width : 600
																			});
															d.show()
														}
													},
													"-",
													{
														text : "<b>Edit</b>",
														iconCls : "icon-edit",
														menu : {
															items : [
																	{
																		text : "MMR Attribute",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_mmr_attribute"),
																		id : "mtm_wc_mmr_attribute",
																		handler : function() {
																			if (b.grid.getSelectionModel().hasSelection()) {
																				b.getSelectedIds(b.grid);
																				var c = b.checkCheckOutStatus(b.ids);
																				if (c == false) {
																					Ext.MessageBox
																							.show({
																								title : "Message",
																								msg : "Checkout Error!Some MTMs is being check out by other people.",
																								buttons : Ext.MessageBox.OK,
																								icon : "ext-mb-error"
																							});
																					return false
																				} else {
																					if (c == true) {
																						var d = Ext
																								.createWidget(
																										"attributeEdit",
																										{
																											ids : b.ids,
																											type : "MTM"
																										});
																						d
																								.show()
																					}
																				}
																			}
																		}
																	},
																	{
																		text : "Country Attribute",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_country_attribute"),
																		id : "mtm_wc_country_attribute",
																		handler : function() {
																		var ids = [];
																		var grid = b.grid;
																		for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
																			ids.push(grid.getSelectionModel().selected.items[i].get('id'));
																		}
																			if (b.grid
																					.getSelectionModel()
																					.hasSelection()) {
																				var d = b.grid
																						.getSelectionModel()
																						.getSelection();
																				var c = "WCPOR";
																				var f = [];
																				Ext.Array
																						.each(
																								d,
																								function(
																										h,
																										j,
																										k) {
																									f
																											.push(h
																													.get("id"));
																									c = h
																											.get("productType")
																								});
																				if (f.length == 0) {
																					Ext.Msg
																							.alert(
																									"empty",
																									"please select some items.");
																					return
																				}
																				var e = b.checkCheckOutStatus(f);
																				if (e == false) {
																					Ext.MessageBox
																							.show({
																								title : "Message",
																								msg : "Checkout Error!Some MTMs is being check out by other people.",
																								buttons : Ext.MessageBox.OK,
																								icon : "ext-mb-error"
																							});
																					return false
																				} else {
																					if (e == true) {
																						var g = Ext
																								.createWidget(
																										"WC-listCountrys",
																										{
																											ids : f,
																											objectType : c
																										});

																					    g.show();
																						/*g.store
																								.load({
																									scope : this,
																									callback : function(
																											i,
																											h,
																											k) {
																										var j = Ext.JSON
																												.decode(h.response.responseText);
																										if (j.success) {
																											g
																													.show()
																										} else {
																											g
																													.destroy()
																										}
																									}
																								})*/
																					}
																				}
																			}
																		}
																	},
																	{
																		text : "Export to Loadsheet",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_mmr_exloadsheet"),
																		id : "mtm_wc_mmr_exloadsheet",
																		handler : function() {
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
																						params : b
																								.getValues(),
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
																	} ]
														}
													},
													"-",
													{
														text : "<b>View Links</b>",
														iconCls : "icon-element-link",
														menu : {
															items : [ {
																text : 'View Links',
																iconCls : 'icon-menu-node',
																disabled : Ext.LOIS
																		.isEnable('mtm_wc_element'),
																id : 'mtm_wc_element',
																handler : function() {
																	b.getSelectedIds(b.grid);
																	if (b.ids == "") {
																		Ext.Msg.alert('empty',
																				'please select some items.');
																	} else {
																		selectedIds = b.ids;
																		enhanceWinPanel = new Ext.Window({
																			title : 'Edit Element Link',
																			width : 1000,
																			height : 700,
																			constrain : true,
																			modal : true,
																			closable : true,
																			items : [],
																			html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew.html?objectType=mtm"> </iframe>',
																			buttons : []
																		});
																		enhanceWinPanel.show();
																	}
																}
															} 
//															{
//																text : "View Links",
//																iconCls : "icon-menu-node",
//																disabled : Ext.LOIS
//																		.isEnable("mtm_wc_element"),
//																id : "mtm_wc_element",
//																handler : function() {
//																	b
//																			.getSelectedIds(b.grid);
//																	if (b.ids == "") {
//																		Ext.Msg
//																				.alert(
//																						"empty",
//																						"please select some items.")
//																	} else {
//																		Ext.Ajax
//																				.request({
//																					url : "../element/elementLink!findElementsByObjectIds.action",
//																					method : "POST",
//																					params : {
//																						objectIds : b.ids,
//																						objectType : "mtm"
//																					},
//																					success : function(
//																							d,
//																							e) {
//																						var c = Ext.JSON
//																								.decode(d.responseText);
//																						this.objectsStr = c.objectsStr;
//																						this.elementTypesStr = c.elementTypesStr;
//																						this.elementsStr = c.elementsStr;
//																						this.objectType = "mtm";
//																						enhanceWinPanel = new Ext.Window(
//																								{
//																									title : "Edit Element Link",
//																									width : 800,
//																									height : 450,
//																									constrain : true,
//																									modal : true,
//																									closable : false,
//																									items : [],
//																									html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLink/ElementLink.html"> </iframe>'
//																								});
//																						enhanceWinPanel
//																								.show()
//																					},
//																					failure : function() {
//																						Ext.MessageBox
//																								.show({
//																									title : "Message",
//																									msg : "Checkout Error!",
//																									buttons : Ext.MessageBox.OK,
//																									icon : "ext-mb-error"
//																								})
//																					}
//																				})
//																	}
//																}
//															}
															
															, {
																text : 'Download Element Links',
																iconCls : 'icon-menu-node',
																/*disabled : Ext.LOIS
																		.isEnable('download_elementlink_sheet'),*/
																id : 'download_elementlink_sheet',
																handler : function() {
																	b.getSelectedIds(b.grid);
																	if (b.ids == "") {
																		Ext.Msg.alert('empty',
																				'please select some items.');
																	} else {
																		selectedIds = b.ids;
																		enhanceWinPanel = new Ext.Window({
																			title : 'Download Element Links',
																			width : 1000,
																			height : 700,
																			constrain : true,
																			modal : true,
																			closable : true,
																			items : [],
																			html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../element/ElementLinkNew2.html?objectType=mtm"> </iframe>',
																			buttons : []
																		});
																		enhanceWinPanel.show();
																	}
																}
															}]
														}
													},
													"-",
													{
														text : "<b>Loadsheet Upload</b>",
														iconCls : "icon-loadsheet",
														menu : {
															items : [
																	{
																		text : "Element Link Loadsheet",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_element_inloadsheet"),
																		id : "mtm_wc_element_inloadsheet",
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
																						title : "load update links",
																						width : 550,
																						height : 450,
																						constrain : true,
																						modal : true,
																						closable : true,
																						items : [],
																						html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=mtmelement&userId='
																								+ c
																								+ '"> </iframe>'
																					});
																			enhanceWinPanel
																					.show()
																		}
																	},
																	{
																		text : "WC MMR Loadsheet",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_mmr_inloadsheet"),
																		id : "mtm_wc_mmr_inloadsheet",
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
																						title : "WC MMR Loadsheet",
																						width : 750,
																						height : 350,
																						constrain : true,
																						modal : true,
																						closable : true,
																						items : [],
																						html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=wcmmr&userId='
																								+ c
																								+ '"> </iframe>'
																					});
																			enhanceWinPanel
																					.show()
																		}
																	},
																	{
																		text : "LS MMR Loadsheet",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_ls_mmr_inloadsheet"),
																		id : "mtm_ls_mmr_inloadsheet",
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
																						title : "LS MMR Loadsheet",
																						width : 750,
																						height : 350,
																						constrain : true,
																						modal : true,
																						closable : true,
																						items : [],
																						html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../FileUploader/FileUploadWithMessageNew.html?objectType=lsmmr&userId='
																								+ c
																								+ '"> </iframe>'
																					});
																			enhanceWinPanel
																					.show()
																		}
																	},
																	{
																		text : "Download Loadsheet Format",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_mmr_inloadsheet"),
																		handler : function() {
																			var c = Ext
																					.create(
																							"Ext.form.FormPanel",
																							{
																								height : 170,
																								bodyStyle : "padding:5px 5px 0",
																								items : [ {
																									layout : "column",
																									border : false,
																									labelWidth : 120,
																									labelAlign : "left"
																								} ]
																							});
																			var d = c
																					.getForm();
																			d.standardSubmit = true;
																			d
																					.submit({
																						url : "../loadsheet/loadsheet!downloadsheetFormat.action?formatType=MTM",
																						method : "POST",
																						success : function(
																								e,
																								f) {
																							Ext.Msg
																									.alert(
																											"error",
																											"sorry,error message!")
																						}
																					})
																		}
																	} ]
														}
													},
													"-",
													{
														text : "<b>More</b>",
														iconCls : "icon-more-actions",
														menu : {
															items : [
																	{
																		text : "Save As",
																		iconCls : "icon-menu-node",
																		disabled : Ext.LOIS
																				.isEnable("mtm_wc_save_as"),
																		id : "mtm_wc_save_as",
																		handler : function() {
																			if (b.grid
																					.getSelectionModel().selected.items.length != 1) {
																				Ext.Msg
																						.alert(
																								"error",
																								"please select one record!");
																				return false
																			}
																			if (b.grid
																					.getSelectionModel()
																					.hasSelection()) {
																				var c = b.grid
																						.getSelectionModel()
																						.getSelection();
																				var e = [];
																				Ext.Array
																						.each(
																								c,
																								function(
																										g,
																										h,
																										j) {
																									e
																											.push(g
																													.get("id"))
																								});
																				var d = Ext
																						.createWidget(
																								"elementsList",
																								{
																									height : 300,
																									width : 500,
																									isShowTbar : true,
																									s_id : e[0],
																									objectType : "WC",
																									flag : 'WC-commonWindow'
																								});
																				d.ids = e;
																				d.store
																						.getProxy().extraParams.offeringId = e;
																				d.store
																						.load();
																				var f = Ext
																						.createWidget(
																								"WC-commonWindow",
																								{
																									item : d,
																									title : "MTM Save As"
																								});
																				f
																						.show()
																			}
																		}
																	},{
																		text : 'Promote',
																		iconCls : 'icon-menu-node',
																		disabled : Ext.LOIS
																				.isEnable('mtm_management_more_promote'),
																		id : 'mtm_management_more_promote',
																		handler : function(){	
																			var offeringIds='';
																			if (b.grid.getSelectionModel().selected.items.length <=0) {
																				Ext.Msg.alert('Message', 'please select some items.');
																				return false;
																			}
																			var records = b.grid.getSelectionModel()
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
																		 var mtmId = urlMap.get('../basic/PromoteOffering.html');
																         var center = vp.getComponent('center-tabs');
																	     var tab_n = center.getActiveTab(mtmId);
																	        var tt=   Ext.getCmp(mtmId);
																	        Ext.Msg.confirm("Promote Searching",
																		  	"The Offerings listing on Offering Promote page will be refreshed by the selected Offerings,do you want to go on?",
																		  	function(btn){ 
													                        if (btn == 'yes'){
													                        	if(tt==undefined){
																	        	tab_n =  center.add({		 
																				 title:'Offering Promote',
																				 iconCls: 'tabs',
																				 id:mtmId,
																				 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
																				 closable: true
																				 });
																				 center.setActiveTab(tab_n);
																	        }else{
																	           center.remove(tt);					
																	           tt=center.add({		 
																				 title:'Offering Promote',
																				 iconCls: 'tabs',
																				 id:mtmId,
																				 html : '<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src=' + url + '></iframe>',
																				 closable: true
																	           });
																	           center.setActiveTab(tt);
																	        }
													                        	
													                         }else{ 
													                            return false; 
													                         }});
																		}
																	},
									       								{
																		text : "MTM Adhoc Report",
																		iconCls : "icon-menu-node",
																		handler : function() {
																			var c = b.grid;
																			if (c
																					.getStore()
																					.getCount() == 0) {
																				Ext.MessageBox
																						.alert(
																								"Message",
																								"there is no data");
																				return false
																			}
																			if(typeof(adhocMTMNumber) == 'undefined')
																			{
																				adhocMTMNumber = '';
																			}
																			if(typeof(adhocProjectName) == 'undefined')
																			{
																				adhocProjectName = '';
																			}
																			if(typeof(adhocProductHierarchy) == 'undefined')
																			{
																				adhocProductHierarchy = '';
																			}
																			if(typeof(adhocPhPage) == 'undefined')
																			{
																				adhocPhPage = '';
																			}
																			if(typeof(adhocPorNumberVersion) == 'undefined')
																			{
																				adhocPorNumberVersion = '';
																			}
																			if(typeof(adhocObjectType) == 'undefined')
																			{
																				adhocObjectType = '';
																			}
																			if(typeof(adhocCreatedTimeS) == 'undefined')
																			{
																				adhocCreatedTimeS = '';
																			}
																			if(typeof(adhocCreatedTimeE) == 'undefined')
																			{
																				adhocCreatedTimeE = '';
																			}
																			if(typeof(adhocUpdatedTimeS) == 'undefined')
																			{
																				adhocUpdatedTimeS = '';
																			}
																			if(typeof(adhocUpdatedTimeE) == 'undefined')
																			{
																				adhocUpdatedTimeE = '';
																			}
																			if(typeof(adhocStatus) == 'undefined')
																			{
																				adhocStatus = '';
																			}
																			if(typeof(adhocAttribute1Name) == 'undefined')
																			{
																				adhocAttribute1Name = '';
																			}
																			if(typeof(adhocAttribute1Value) == 'undefined')
																			{
																				adhocAttribute1Value = '';
																			}
																			if(typeof(adhocValueD1From) == 'undefined')
																			{
																				adhocValueD1From = '';
																			}
																			if(typeof(adhocValueD1To) == 'undefined')
																			{
																				adhocValueD1To = '';
																			}
																			if(typeof(adhocValueFlag1) == 'undefined')
																			{
																				adhocValueFlag1 = '';
																			}
																			if(typeof(adhocAttribute2Name) == 'undefined')
																			{
																				adhocAttribute2Name = '';
																			}
																			if(typeof(adhocAttribute2Value) == 'undefined')
																			{
																				adhocAttribute2Value = '';
																			}
																			if(typeof(adhocValueD2From) == 'undefined')
																			{
																				adhocValueD2From = '';
																			}
																			if(typeof(adhocValueD2To) == 'undefined')
																			{
																				adhocValueD2To = '';
																			}
																			if(typeof(adhocValueFlag2) == 'undefined')
																			{
																				adhocValueFlag2 = '';
																			}
																			if(typeof(adhocAttribute3Name) == 'undefined')
																			{
																				adhocAttribute3Name = '';
																			}
																			if(typeof(adhocAttribute3Value) == 'undefined')
																			{
																				adhocAttribute3Value = '';
																			}
																			if(typeof(adhocValueD3From) == 'undefined')
																			{
																				adhocValueD3From = '';
																			}
																			if(typeof(adhocValueD3To) == 'undefined')
																			{
																				adhocValueD3To = '';
																			}
																			if(typeof(adhocValueFlag3) == 'undefined')
																			{
																				adhocValueFlag3 = '';
																			}
																			if(typeof(adhocAnnounceDateFrom) == 'undefined')
																			{
																				adhocAnnounceDateFrom = '';
																			}																			
																			if(typeof(adhocFileCondition) == 'undefined')
																			{
																				adhocFileCondition = '';
																			}
																			
																			if(typeof(adhocExcludeWDPNs) == 'undefined')
																			{
																				adhocExcludeWDPNs = '';
																			}if(typeof(adhocAnnounceDateTo) == 'undefined')
																			{
																				adhocAnnounceDateTo = '';
																			}
																			Ext.Ajax
																					.request({
																						url : "../offering/offeringAdhocReport!checkMtmAdhocReportCount.action",
																						async : false,
																						params : {
																							offeringNumber : adhocMTMNumber,
																							projectName : adhocProjectName,																							
																							hierarchyCode : adhocProductHierarchy,
																							phPage : adhocPhPage,
																							porNumberVersion : adhocPorNumberVersion,
																							objectType : adhocObjectType,
																							createdTimeS : adhocCreatedTimeS,
																							createdTimeE : adhocCreatedTimeE,
																							updatedTimeS : adhocUpdatedTimeS,
																							updatedTimeE : adhocUpdatedTimeE,
																							status : adhocStatus,
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
																							announceDateFrom : adhocAnnounceDateFrom,
																							announceDateTo : adhocAnnounceDateTo,
																							excludeWDPNs : adhocExcludeWDPNs,
																							fileCondition : adhocFileCondition,
																							/*
																							 * end 
																							 */
																							type : "MTM"
																						},
																						success : function(
																								f,
																								g) {
																							var e = Ext
																									.decode(f.responseText);
																							message = e.msg;
																							var d = e.adhocCount;
																							if (message == "F") {
																								if (!Ext
																										.fly("MTMAdhocReport")) {
																									var h = document
																											.createElement("form");
																									h.id = "MTMAdhocReport";
																									h.name = id;
																									h.className = "x-hidden";
																									document.body
																											.appendChild(h)
																								}
																								Ext.Ajax
																										.request({
																											url : "../offering/offeringAdhocReport!exportMtmAdhocReport.action",
																											method : "POST",
																											form : Ext
																													.fly("MTMAdhocReport"),
																											isUpload : true,
																											params : {
																												offeringNumber : adhocMTMNumber,
																												projectName : adhocProjectName,
																												hierarchyCode : adhocProductHierarchy,
																												phPage : adhocPhPage,
																												porNumberVersion : adhocPorNumberVersion,
																												objectType : adhocObjectType,
																												createdTimeS : adhocCreatedTimeS,
																												createdTimeE : adhocCreatedTimeE,
																												updatedTimeS : adhocUpdatedTimeS,
																												updatedTimeE : adhocUpdatedTimeE,
																												status : adhocStatus,
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
																							announceDateFrom : adhocAnnounceDateFrom,
																							announceDateTo : adhocAnnounceDateTo,
																							excludeWDPNs : adhocExcludeWDPNs,
																							fileCondition : adhocFileCondition,
																							/*
																							 * end 
																							 */
																												type : "MTM"
																											}
																										})
																							} else {
																								if (message == "T") {
																									Ext.Msg
																											.confirm(
																													"infomation",
																													"Data has more than "
																															+ d
																															+ ", the system can only export "
																															+ d
																															+ " before the data,are you sure?",
																													function(
																															i) {
																														if (i == "yes") {
																															if (!Ext
																																	.fly("MTMAdhocReport")) {
																																var j = document
																																		.createElement("form");
																																j.id = "MTMAdhocReport";
																																j.name = id;
																																j.className = "x-hidden";
																																document.body
																																		.appendChild(j)
																															}
																															Ext.Ajax
																																	.request({
																																		url : "../offering/offeringAdhocReport!exportMtmAdhocReport.action",
																																		method : "POST",
																																		form : Ext
																																				.fly("MTMAdhocReport"),
																																		isUpload : true,
																																		params : {
																																			offeringNumber : adhocMTMNumber,
																																			projectName : adhocProjectName,
																																			hierarchyCode : adhocProductHierarchy,
																																			phPage : adhocPhPage,
																																			porNumberVersion : adhocPorNumberVersion,
																																			objectType : adhocObjectType,
																																			createdTimeS : adhocCreatedTimeS,
																																			createdTimeE : adhocCreatedTimeE,
																																			updatedTimeS : adhocUpdatedTimeS,
																																			updatedTimeE : adhocUpdatedTimeE,
																																			status : adhocStatus,
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
																							announceDateFrom : adhocAnnounceDateFrom,
																							announceDateTo : adhocAnnounceDateTo,
																							excludeWDPNs : adhocExcludeWDPNs,
																							fileCondition : adhocFileCondition,
																							/*
																							 * end 
																							 */
																																			type : "MTM"
																																		}
																																	})
																														}
																													})
																								}
																							}
																						},
																						failure : function() {
																							Ext.Msg
																									.alert(
																											"Information",
																											"Export mtm adhoc report failed!")
																						}
																					})
																		}
																	},
																	{
																		text : "Country Report",
																		iconCls : "icon-menu-node",
																		id : "mtm_wc_download",
																		handler : function() {
																			
																			b.store.each(function(record) {

																				if (b.grid.getSelectionModel().isSelected(record)) {
																					if (!b.recordIds.contains(record.get('id'))) {
																						b.recordIds.push(record.get('id'));
																					}
																				} else {
																					if (b.recordIds.contains(record.get('id'))) {
																						b.recordIds.remove(record.get('id'));
																					}
																				}
																			});
																			var aa = b.grid.getSelectionModel().getSelection(); 
																			var c = [];
																			Ext.Array
																					.each(aa,function(
																							d) {
																						c
																								.push(d
																										.get("id"))
																					});
																			if (!Ext
																					.fly("frmDummy_down")) {
																				Ext
																						.getBody()
																						.createChild(
																								{
																									tag : "form",
																									id : "frmDummy_down"
																								});
																				Ext
																						.fly("frmDummy_down").className = "x-hidden"
																			}
																			if (c.length == 0) {
																				Ext.Msg
																						.alert(
																								"info",
																								"This is No Record!");
																				return
																			}
																			
																			var idStr=b.recordIds.join(',');
																			Ext.Ajax
																					.request({
																						url : "../mtm/wcPor!countryLinkDownloadExcelByAttribute.action",
																						method : "POST",
																						isUpload : true,
																						form : Ext
																								.fly("frmDummy_down"),
																						params : {
																							idStr : idStr
																						},
																						success : function(
																								d,
																								e) {
																							var f = Ext.JSON
																									.decode(d.responseText);
																							b.recordIds=[];
																							if (f.msg) {
																								Ext.MessageBox
																										.show({
																											title : "Message",
																											msg : f.msg,
																											buttons : Ext.MessageBox.OK,
																											icon : "ext-mb-info"
																										})
																							}
																						},
																						failure : function() {
																							b.recordIds=[];
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
																							"frmDummy_down")
																					.destroy()
																		}
																	},
																	{
																		text : "View Translation",
																		iconCls : "icon-menu-node",
																		id : "mtm_management_viewTranslation_ui_new",
																		handler : function() {
																			b.getSelectedIds(b.grid);
																			if (b.ids == "") {
																				Ext.Msg
																						.alert(
																								"empty",
																								"please select some items111.");
																								return false;
																			} 

																				var ids = [];
																				var grid = b.grid;
																				for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
																					ids.push(grid.getSelectionModel().selected.items[i]
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
																					html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=MTM&viewOrEdit=view&recordIds=' + ids +'"> </iframe>',
																					buttons : []
																				});
																				enhanceWinPanel.show();
																			
																		}
																	},{
												                        text : 'Edit Translation Value',
												                        iconCls : 'icon-menu-node',
												                        disabled : window.parent.Ext.LOIS.isEnable('mtm_management_manuallyTranslation_ui'),
												                        id : 'mtm_management_manuallyTranslation_ui_new',
																		handler : function() {
																			b.getSelectedIds(b.grid);
																			if (b.ids == "") {
																				Ext.Msg
																						.alert(
																								"empty",
																								"please select some items.");
																								return false;
																			} 
																			var ids = [];
																			var grid = b.grid;
																			for (var i = 0; i < grid.getSelectionModel().selected.items.length; i++) {
																				ids.push(grid.getSelectionModel().selected.items[i]
																							.get('id'));
																			}
																			var res =b.checkCheckOutStatus(b.ids);
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
																					html : '  <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../common/CommonTranslation.html?type=MTM&viewOrEdit=edit&recordIds=' + ids +'"> </iframe>',
																					buttons : []
																				});
																				enhanceWinPanel.show();
																			}
																			
																		}
																	
//												                        handler : function() {
//												                        	b.getSelectedIds(b.grid);
//																			if (b.ids == "") {
//																				Ext.Msg
//																						.alert(
//																								"empty",
//																								"please select some items.")
//																			}else {
//												                                Ext.Ajax.request({
//												                                    url : '../offering/editTranslation!initEditTranslation.action',
//												                                    method : 'POST',
//												                                    success : function(response, option) {
//												                                        var result = Ext.JSON
//												                                                .decode(response.responseText);
//												                                        this.objectsStrForEditTrans = result.languageStrForXml;
//												                                        this.elementsStrForEditTrans = b.ids;
//												                                        this.objectTypeForEditTrans = 'MTM';
//												                                        editWinPanel = new Ext.Window({
//												                                            title : 'Edit Translation(* The values edit here will be reported and flattened to downstream instead of vendor translated value!)',
//												                                            width : 1000,
//												                                            height : 600,
//												                                            constrain : true,
//												                                            modal : true,
//												                                            closable : true,
//												                                            items : [],
//												                                            html : ' <iframe scrolling="no" frameborder="0" align="center" width="100%" height="100%" src="../basic/EditTranslationApp/EditTranslationApp.html"> </iframe>'
//												                                        });
//												                                        editWinPanel.show();
//												                                    },
//												                                    failure : function() {
//												                                        Ext.MessageBox.show({
//												                                            title : 'Error',
//												                                            msg : 'System Error!',
//												                                            buttons : Ext.MessageBox.OK,
//												                                            icon : 'ext-mb-error'
//												                                        });
//												                                    }
//												                                });
//												                            }
//												                        }
												                    }]
														}
													},
													{
														xtype : "tbseparator"
													},
													{
														text : "<b>Undo</b>",
														iconCls : "icon-edit",
														disabled : Ext.LOIS
																.isEnable("mtm_offering_attribute_undo"),
														id : "mtm_offering_attribute_undo",
														handler : function() {
															var c = b.grid
																	.getSelectionModel()
																	.getSelection();
															var d = [];
															Ext.Array
																	.each(
																			c,
																			function(
																					f,
																					g,
																					h) {
																				var e = f
																						.get("checkOutUserName");
																				if (e != "") {
																					d
																							.push(f
																									.get("id"))
																				}
																			});
															if (d == "") {
																Ext.Msg
																		.alert(
																				"no can undo items",
																				"please select some items.");
																return false
															}
															Ext.Ajax
																	.request({
																		url : "../offering/checkOut!undoObjectsByObjectIds.action",
																		method : "get",
																		async : false,
																		params : {
																			ids : d,
																			type : "MTM"
																		},
																		success : function(
																				e,
																				f) {
																			b.store
																					.load()
																		},
																		failure : function() {
																			Ext.MessageBox
																					.show({
																						title : "Message",
																						msg : "Undo Error!",
																						buttons : Ext.MessageBox.OK,
																						icon : "ext-mb-error"
																					})
																		}
																	})
														}
													} ]
										});
						return a
					},
					CheckOutOrIn : function(b, a) {
						Ext.Ajax
								.request({
									url : "../optsrv/opt!checkOutAndCheckInAction.action",
									method : "get",
									async : false,
									params : {
										checkType : a,
										ids : b
									},
									success : function(d, c) {
									}
								})
					},
					onDestroy : function() {
						Ext.destroyMembers(this, this.store, this.form,
								this.grid, this.contextMenu);
						this.callParent()
					}
				});