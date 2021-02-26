/**
 * Copyright (c) 2011, Lenovo Group, Ltd. All rights reserved.
 */
package com.lenovo.lois.offering.action;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import com.lenovo.lois.admin.entity.User;
import com.lenovo.lois.basic.entity.GenericOffering;
import com.lenovo.lois.basic.service.GenericOfferingService;
import com.lenovo.lois.common.constant.Constant;
import com.lenovo.lois.cto.entity.CtoCvQdInfo;
import com.lenovo.lois.element.entity.Element;
import com.lenovo.lois.element.entity.ElementAndOfferingBean;
import com.lenovo.lois.element.entity.ElementAttribute;
import com.lenovo.lois.element.entity.ElementType;
import com.lenovo.lois.element.entity.ElementTypeAttribute;
import com.lenovo.lois.element.entity.OfferingElementLink;
import com.lenovo.lois.element.service.ElementAttributeService;
import com.lenovo.lois.element.service.ElementService;
import com.lenovo.lois.element.service.ElementTypeAttributeService;
import com.lenovo.lois.element.service.ElementTypeService;
import com.lenovo.lois.element.service.OfferingElementLinkService;
import com.lenovo.lois.element.service.PHElementLinkService;
import com.lenovo.lois.element.service.SbbElementLinkService;
import com.lenovo.lois.framework.system.SystemHelper;
import com.lenovo.lois.framework.web.struts2.BaseAction;
import com.lenovo.lois.offering.entity.AdvanceConditionEleTypeBeanForUI;
import com.lenovo.lois.offering.entity.AdvanceConditionTypeAttributeBeanForUI;
import com.lenovo.lois.offering.entity.AttributeDataBeanForUI;
import com.lenovo.lois.offering.entity.ElementDataBeanForUI;
import com.lenovo.lois.offering.service.UpdateElementLinksForUIService;
import com.lenovo.lois.optsrv.entity.OfferingGlobal;
import com.lenovo.lois.ph.entity.ProductHierarchy;
import com.lenovo.lois.ph.entity.ProductHierarchyLevel;
import com.lenovo.lois.ph.service.ProductHierarchyService;
import com.lenovo.lois.sbb.entity.Sbb;
import com.lenovo.lois.sbb.service.SbbService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * <p>
 * 
 * <dl>
 * <dt><b>UpdateElementsLinksByUIAction</b></dt>
 * <p>
 * 
 * <pre>
 * 
 * </pre>
 * 
 * <p>
 * <dt><b>Thread Safety:</b></dt>
 * <dd>
 * <b>NOT-THREAD-SAFE</b> and <b>NOT-APPLICABLE</b> (for it will never be used
 * on multi-thread occasion.)</dd>
 * 
 * <p>
 * <dt><b>Serialization:</b></dt>
 * <dd>
 * <b>NOT-SERIALIIZABLE</b> and <b>NOT-APPLICABLE</b> (for it have no need to be
 * serializable.)</dd>
 * 
 * <p>
 * <dt><b>Design Patterns:</b></dt>
 * <p>
 * <dt><b>Change History:</b></dt>
 * <dd>
 * UpdateElementsLinksByUIAction</dd>
 * <dd>
 * 2011-7-28 lihx Create the class</dd>
 * </dl>
 * 
 * @see
 * @see
 */
public class UpdateElementsLinksByUIAction extends BaseAction {

	private static final long serialVersionUID = 294707801785991646L;
	private Log logger = LogFactory.getLog(getClass());
	private String message;
	
	private String objectIds;//offeringIds or sbbIds
	
	private String objectType;//offering or sbb
	
	private String phType;
	
	private String versionType;
	
	private String[] matrix;
	
	private String[] typeKeys;
	
	private String needCheckout;
	
	private String userId;
	
	
	/**
	 * <types>
	 * 	<type id="" name="">
	 * 		<attribute id="" name="" type="3" datatype="" translation=""/>
	 * 		<attribute id="" name="" type="2" datatype="" translation=""/>
	 * 	</type>
	 * </types>
	 */
	private String elementTypesStr;
	
	
	/**
	 * <elements>
	 * 	<element id="" name="" typeid="" status="" version="">
	 * 		<attribute id="" value=""/>
	 *  	<attribute id="" value=""/>
	 *  </element>
	 * 	<element id="" name="" typeid="">
	 *  	<attribute id="" value="">
	 * 			<language id="" code="" name="">
	 * 			</language>
	 * 		</attribute>
	 *  </element>
	 * </elements>
	 */
	private String elementsStr;
	
	
	/**
	 * <objects>
	 * 	<object id="" name="" pn="" status="" version="">
	 * 		<element id="" qty=""/>
	 * 		<element id="" qty=""/>
	 * 	</object>
	 * </objects>
	 */
	private String objectsStr;
	
	private UpdateElementLinksForUIService updateElementLinksForUIService;
	
	private GenericOfferingService genericOfferingService;
	
	private ElementTypeService elementTypeService;
	
    private OfferingElementLinkService offeringElementLinkService;
    
    private ElementAttributeService elementAttributeService;
    
    private ElementService elementService;
    
    private ElementTypeAttributeService elementTypeAttributeService;
    
    private SbbService sbbService;
    
    private SbbElementLinkService sbbElementLinkService;
    
    private ProductHierarchyService productHierarchyService;
    
    private PHElementLinkService phElementLinkService;
	
	public String findCurrentUserId(){
		HttpSession httpSession = ServletActionContext.getRequest().getSession();
		User user = (User)httpSession.getAttribute(Constant.SESSION_KEY_USER);
		userId = user.getId().toString();
		return SUCCESS;
	}
	
	public String findElementsByObjectIds() {
		objectIds = objectIds.replaceAll(" ", "");
		Map<String,String> map = updateElementLinksForUIService.findObjectsByObjectId(objectType,objectIds,phType);
		objectsStr = map.get("objectsStr");
		elementsStr = map.get("elementsStr");
		elementTypesStr = map.get("elementTypesStr");
		return SUCCESS;
	}
	/**
	 * 简单查询:
 elmentName: 21341234312,41234123,231412,312421
 
 复杂查询:
 elementType:ESS&att1:12312&att2:12321&attr3:1231231 

	 * @return
	 */
	public String findElementsByCondition() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		
		String objectType = ServletActionContext.getRequest().getParameter("objectType");
    	String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
    	
    	Boolean phFlag = false;
    	if("ph".equalsIgnoreCase(objectType)) {
    		Long[] phIds = null;
        	List<Long> phIdList = new ArrayList<Long>();
        	for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
    		List<ProductHierarchy> phs = productHierarchyService.getPHsByChoosePHID(phIds);
    		if(phs!=null&& phs.size()>0) {
    			ProductHierarchy ph = phs.get(0);
    			int level = ph.getLevel();
	            if (ProductHierarchyLevel.MT.getValue() != level) {
	            	phFlag = true;
	            } else {
	            	
	            }
    		}
    	}
    	
		Boolean flag = false;
		JSONObject errorResultObj = new JSONObject();
		String searchCriteria = request.getParameter("searchCondition");
		try {
			searchCriteria = URLDecoder.decode(searchCriteria,"UTF-8");
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		String[] eleName;
		PrintWriter out1 = null;

		Map<Long,String> typeAttriMap = new HashMap<Long,String>();
		List<ElementTypeAttribute> typeAttributes= elementTypeAttributeService.findAllTypeAttributes();
		for(ElementTypeAttribute typeAttri :typeAttributes) {
			typeAttriMap.put(typeAttri.getId(), typeAttri.getName());
		}
		
		List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
		
		List<ElementDataBeanForUI> result = new ArrayList<ElementDataBeanForUI>();
		if(searchCriteria.contains("elementName")) {
			searchCriteria = searchCriteria.replace("elementName:", "");
			eleName=searchCriteria.split("&-&");
			List<String> elementNameList = Arrays.asList(eleName);
			List<Element> elements = elementService.queryElementByElementName(elementNameList);
			if(phFlag) {
				elements = filterElements(elements,eleTypeMap);
			}
			if(elements.size()>200) {
				flag = true;
				errorResultObj.put("success",true);
				org.json.JSONObject errorMap = new org.json.JSONObject();
				errorMap.put("msg", "Results larger than 200!");
				errorResultObj.put("results",errorMap.toString());
			}else {
				for(Element element : elements) {
					ElementDataBeanForUI node = new ElementDataBeanForUI();
		            node.setId(element.getId());
		            node.setName(element.getName());
		            node.setTypeid(element.getElementTypeId());
		            node.setStatus(element.getStatus());
		            node.setVersion(element.getElementVersion());
		            List<AttributeDataBeanForUI> attributeList = getAttributeList(element);
		            node.setAttributes(attributeList);
		            result.add(node);
				}
			}
		}else {
			//elementTypeID:18&elementId:17683648757&elementDesc:CTO 14.0" Monitor
			//elementType:ESS&att1:12312&att2:12321&attr3:1231231 
			String[] para = searchCriteria.split("&-&");
			if(para.length<=1) {
				flag = true;
//				errorResultObj.put("success",false);
//				errorResultObj.put("results","Results larger than 200!");
			} else {
				String para0 = para[0];
				String elementType = para0.replace("elementTypeID:", "");
				List<AdvanceConditionEleTypeBeanForUI> conditions = new ArrayList<AdvanceConditionEleTypeBeanForUI>();
				AdvanceConditionEleTypeBeanForUI condition = new AdvanceConditionEleTypeBeanForUI();
				condition.setTypeid(elementType);
				List<AdvanceConditionTypeAttributeBeanForUI> attributes = new ArrayList<AdvanceConditionTypeAttributeBeanForUI>();
				for(int i = 1; i<para.length; i++) {
					String paraStr = para[i];
					String[] attri = paraStr.split("&:&");
					AdvanceConditionTypeAttributeBeanForUI acta = new AdvanceConditionTypeAttributeBeanForUI();
					String searchKey = attri[0];
					if(searchKey.indexOf("menu_") > -1) {
						searchKey = searchKey.replace("menu_", "");
					}
					if("elementId".equalsIgnoreCase(searchKey)) {
						acta.setId("id");
						acta.setValue(attri[1]);
					} else if("elementVersion".equalsIgnoreCase(searchKey)){
						acta.setId("version");
						acta.setValue(attri[1]);
					} else if("elementDesc".equalsIgnoreCase(searchKey)) {
						acta.setId("name");
						acta.setValue(attri[1]);
					} else if("elementStatus".equalsIgnoreCase(searchKey)) {
						acta.setId("status");
						acta.setValue(attri[1]);
					} else {
						acta.setId(typeAttriMap.get(searchKey).toString());
						acta.setValue(attri[1]);
					}
					attributes.add(acta);
				}
				
				List<AdvanceConditionTypeAttributeBeanForUI> sortAttributes = new ArrayList<AdvanceConditionTypeAttributeBeanForUI>();
				for(AdvanceConditionTypeAttributeBeanForUI ui :attributes) {
					if(("id").equalsIgnoreCase(ui.getId())) {
						sortAttributes.add(ui);
					}
				}
				for(AdvanceConditionTypeAttributeBeanForUI ui : attributes) {
					if(!sortAttributes.contains(ui)) {
						sortAttributes.add(ui);
					}
				}
				condition.setAttributes(sortAttributes);
				conditions.add(condition);
				
				List<Element> elements = elementService.findElementsByAdvanceNew(conditions);
				if(elements.size()>200) {
					flag = true;
				}else {
					for(Element element : elements) {
						ElementDataBeanForUI node = new ElementDataBeanForUI();
			            node.setId(element.getId());
			            node.setName(element.getName());
			            node.setTypeid(element.getElementTypeId());
			            node.setStatus(element.getStatus());
			            node.setVersion(element.getElementVersion());
			            List<AttributeDataBeanForUI> attributeList = getAttributeList(element);
			            node.setAttributes(attributeList);
			            result.add(node);
					}
				}
				
			}
			
		}
		
		org.json.JSONArray jsonList = new org.json.JSONArray();
    	
		
		for(ElementDataBeanForUI ui : result) {
			org.json.JSONObject dataMap = new org.json.JSONObject();
			dataMap.put("elementId", ui.getId());
			dataMap.put("elementType", eleTypeMap.get(ui.getTypeid()));
			dataMap.put("elementDesc",ui.getName());
			dataMap.put("elementVersion",ui.getVersion());
			dataMap.put("elementStatus",ui.getStatus());
//			for(AttributeDataBeanForUI attui : ui.getAttributes()) {
//				dataMap.put(typeAttriMap.get(attui.getId()), attui.getValue());
//			}
			jsonList.put(dataMap);
		}
		
		String eleResults = jsonList.toString();
		
		try {
			out1 = response.getWriter();
			if(flag) {
				out1.print(errorResultObj.toString());
				return "error";
			}else {
				JSONObject resultObj = new JSONObject();
				resultObj.put("success",true);
				resultObj.put("results",eleResults);
				out1.print(resultObj.toString());
			}
			
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findElementsByCondition", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	private List<Element> filterElements(List<Element> elements, Map<Long, String> eleTypeMap) {
		List<Element> filterElements = new ArrayList<Element>();
		for(Element element : elements) {
			if("FB".equalsIgnoreCase(eleTypeMap.get(element.getElementTypeId()))||
					"MM".equalsIgnoreCase(eleTypeMap.get(element.getElementTypeId()))||
					"IMG".equalsIgnoreCase(eleTypeMap.get(element.getElementTypeId()))) {
				filterElements.add(element);
			}
		}
		return filterElements;
	}

	private List<AttributeDataBeanForUI> getAttributeList(Element element) {
        List<ElementAttribute> attributeSet = elementAttributeService.findAttributeByEleId(element.getId());
        Iterator<ElementAttribute> ite = attributeSet.iterator();
        List<AttributeDataBeanForUI> attributeList = new ArrayList<AttributeDataBeanForUI>();
        while(ite.hasNext()) {// element attribute for
            AttributeDataBeanForUI attributeUI = new AttributeDataBeanForUI();
            ElementAttribute attribute = ite.next();
            attributeUI.setId(attribute.getElementTypeAttribute().getId());
            attributeUI.setValue(attribute.getValue());
            attributeList.add(attributeUI);
        }
        return attributeList;
        
    }
	
	public String findElementByCondition() {
		HttpServletResponse response = ServletActionContext.getResponse();
		
    	org.json.JSONArray jsonList = new org.json.JSONArray();
    	org.json.JSONObject result = new org.json.JSONObject();
    	
    	//Map<String,List<Map<String,String>>> result = new HashMap<>();
    	
    	List<Map<String,String>> list = new ArrayList<>();
    	
    	Element element = elementService.loadEntityByPk(21504490077l);
		List<ElementAttribute> attriList = this.elementAttributeService.findAttributeByEleId(element.getId());
		Map<Long, String> attriMap = new HashMap<Long, String>();
        Map<Long, ElementAttribute> attriMap1 = new HashMap<Long, ElementAttribute>();
        for(ElementAttribute attri : attriList) {
            attriMap.put(attri.getElementTypeAttribute().getId(), attri.getValue() == null ? "" : attri
                    .getValue());
        }
        for(ElementAttribute attri : attriList) {
            attriMap1.put(attri.getElementTypeAttribute().getId(), attri);
        }
        
        
        Map<String, String> attributeMap = new HashMap<String, String>();
    	attributeMap.put("id", element.getId()== null ? "":element.getId().toString());
    	attributeMap.put("desc", element.getName() == null ? "" : element.getName());
    	attributeMap.put("status", element.getStatus() == null ? "" : element.getStatus());
    	
        for(ElementAttribute elementAttribute : attriList) {
        	attributeMap.put(elementAttribute.getElementTypeAttribute().getId().toString(), elementAttribute.getValue());
        }
		
        list.add(attributeMap);
		
        result.put(element.getElementTypeId().toString(),list);
		
        jsonList.put(result);

		String eleResults = jsonList.toString();
		PrintWriter out1 = null;
		
		try {
			out1 = response.getWriter();
			JSONObject resultObj = new JSONObject();
			resultObj.put("success",true);
			resultObj.put("targetPageNo",1);
			resultObj.put("totalCount",1);
			resultObj.put("results",eleResults);
			out1.print(resultObj.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findObjectNumbers Translation", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	public String updateElementLinksForView() {
		HttpServletResponse response = ServletActionContext.getResponse();
    	StringBuffer jsonDate = new StringBuffer();
    	StringBuffer attr_sub = new StringBuffer();
    	
    	String width="150";
    	
    	StringBuffer offeringData = new StringBuffer();
    	
    	String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
    	
    	List<GenericOffering> offerings = genericOfferingService.findGenericOfferingByIds(ids);
    	
    	Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		for(GenericOffering offering : offerings ) {
			List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
			Map<Long,Long> linkMap = new HashMap<Long,Long>();
			for(OfferingElementLink link : links) {
				linkMap.put(link.getElementId(),link.getOfferingId());
			}
			eleLinksMap.put(offering.getNumber(), linkMap);
		}
    	
    	String objectType = ServletActionContext.getRequest().getParameter("objType");
    	String[] searchResults = ServletActionContext.getRequest().getParameterValues("searchResults");
    	
    	List<ElementDataBeanForUI> elements = updateElementLinksForUIService.findElementsByObjectIdNew(objectType, ids);
    	
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
    	if(searchResults!=null) {
			List<ElementDataBeanForUI> newElements = new ArrayList<ElementDataBeanForUI>();
			for(String sr : searchResults) {
				String str[] = sr.split("&-&");
				if(str.length==4) {
					Long id = Long.valueOf(str[0]);
					String name = str[1];
					String status = str[2];
					String type = str[3];
					Long typeId = eleTypeMap1.get(type);
					ElementDataBeanForUI ele = new ElementDataBeanForUI();
					ele.setId(id);
					ele.setName(name);
					ele.setStatus(status);
					ele.setTypeid(typeId);
					newElements.add(ele);
				}
			}
			if(newElements.size()>0) {
				List<Long> eleIdList = new ArrayList<>();
				for(ElementDataBeanForUI ele : elements) {
					eleIdList.add(ele.getId());
				}
				
				for(ElementDataBeanForUI ele : newElements) {
					if(!eleIdList.contains(ele.getId())) {
						elements.add(ele);
					}
				}
			}
		}
    	
        //Element ID
		attr_sub.append("{");
		attr_sub.append("'header':'Element ID',");
		attr_sub.append("'width':").append("" + width + "").append(",");
		attr_sub.append("'name':").append("'eleId'").append(",");
		attr_sub.append("'dataIndex':").append("'eleId'").append(",");
		attr_sub.append("}").append(",");
        
        //Element Desc
		attr_sub.append("{");
		attr_sub.append("'header':'Element Desc',");
		attr_sub.append("'width':").append("" + width + "").append(",");
		attr_sub.append("'name':").append("'desc'").append(",");
		attr_sub.append("'dataIndex':").append("'desc'").append(",");
		attr_sub.append("}").append(",");
		
		//Status
		attr_sub.append("{");
		attr_sub.append("'header':'Status',");
		attr_sub.append("'width':").append("" + width + "").append(",");
		attr_sub.append("'name':").append("'status'").append(",");
		attr_sub.append("'dataIndex':").append("'status'").append(",");
		attr_sub.append("}").append(",");
		
		//Type
		attr_sub.append("{");
		attr_sub.append("'header':'Type',");
		attr_sub.append("'width':").append("" + width + "").append(",");
		attr_sub.append("'name':").append("'type'").append(",");
		attr_sub.append("'dataIndex':").append("'type'").append(",");
		attr_sub.append("}").append(",");
		
		//offerings
		for(GenericOffering offering : offerings) {
			String number = offering.getNumber();
			String value = offering.getNumber()+"["+offering.getName()+"]";
			
			attr_sub.append("{");
			attr_sub.append("'header':'" + value.toString() + "',");
			attr_sub.append("'name':").append("'" + number + "'").append(",");
			attr_sub.append("'width':").append("" + width + "").append(",");
			
			attr_sub.append("'dataIndex':").append("'" + number + "'");
			attr_sub.append("}").append(",");
			// title data
			offeringData.append(",{name:'" + number + "'}");
		}
		
		
		if (attr_sub.length() > 0) {
			attr_sub.deleteCharAt(attr_sub.length() - 1);
		}
		
		String columModle = attr_sub.toString();
		
		StringBuffer dataDate = new StringBuffer();
		
		dataDate.append("{name:'eleId'},{name:'desc'},{name:'status'},{name:'type'}")
		.append(offeringData.toString());
		
		// VALUE
		StringBuffer data = new StringBuffer();
		for(ElementDataBeanForUI ele : elements) {
			Map<String, String> dataMap = new HashMap<String, String>();
    		String eleId = ele.getId().toString();
    		String eleName = ele.getName();
    		String eleStatus = ele.getStatus();
    		String eleType =eleTypeMap.get(ele.getTypeid());
    		dataMap.put("eleId", eleId);
	    	dataMap.put("desc", eleName);
	    	dataMap.put("status", eleStatus);
	    	dataMap.put("type", eleType);
	    	for(GenericOffering offering : offerings) {
	    		Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
	    		if(linksMap !=null) {
	    			if(linksMap.containsKey(ele.getId())) {
		    			dataMap.put(offering.getNumber(), "X");
		    		} else {
		    			dataMap.put(offering.getNumber(), "");
		    		}
	    		}
	    	}
	    	
	    	// data
			JSONArray jsonList = JSONArray.fromObject(dataMap);
			data.append(jsonList.toString().substring(1, jsonList.toString().length() - 1)).append(",");
		}
		
		if (data.length() > 0) {
			data.deleteCharAt(data.length() - 1);
		}

		jsonDate.append("{'columModle':[").append(columModle).append("],");
		jsonDate.append("'dataModel':[").append(dataDate.toString()).append("],");
		jsonDate.append("'data':[").append(data).append("]").append("}");

		PrintWriter out = null;
		try {
			out = response.getWriter();
			out.print(jsonDate.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when updateElementLinkForViewNew ", e);
		} finally {
			if (out != null) {
				out.close();
			}
		}
    	
    	return "success";
	}
	
	public String findChooseRecordAndCheckinNew() {
		HttpServletResponse response = ServletActionContext.getResponse();
    	
    	// VALUE
		String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
    	
    	List<GenericOffering> offerings = genericOfferingService.findGenericOfferingByIds(ids);
    	
    	Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		for(GenericOffering offering : offerings ) {
			List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
			Map<Long,Long> linkMap = new HashMap<Long,Long>();
			for(OfferingElementLink link : links) {
				linkMap.put(link.getElementId(),link.getOfferingId());
			}
			eleLinksMap.put(offering.getNumber(), linkMap);
		}
    	
    	String objectType = ServletActionContext.getRequest().getParameter("objType");
    	String[] searchResults = ServletActionContext.getRequest().getParameterValues("searchResults");
    	
    	List<ElementDataBeanForUI> elements = updateElementLinksForUIService.findElementsByObjectIdNew(objectType, ids);
    	
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
    	if(searchResults!=null) {
			List<ElementDataBeanForUI> newElements = new ArrayList<ElementDataBeanForUI>();
			for(String sr : searchResults) {
				String str[] = sr.split("&-&");
				if(str.length==4) {
					Long id = Long.valueOf(str[0]);
					String name = str[1];
					String status = str[2];
					String type = str[3];
					Long typeId = eleTypeMap1.get(type);
					ElementDataBeanForUI ele = new ElementDataBeanForUI();
					ele.setId(id);
					ele.setName(name);
					ele.setStatus(status);
					ele.setTypeid(typeId);
					newElements.add(ele);
				}
			}
			if(newElements.size()>0) {
				List<Long> eleIdList = new ArrayList<>();
				for(ElementDataBeanForUI ele : elements) {
					eleIdList.add(ele.getId());
				}
				
				for(ElementDataBeanForUI ele : newElements) {
					if(!eleIdList.contains(ele.getId())) {
						elements.add(ele);
					}
				}
			}
		}
    	StringBuffer data = new StringBuffer();
    	for(ElementDataBeanForUI ele : elements) {
			Map<String, String> dataMap = new HashMap<String, String>();
    		String eleId = ele.getId().toString();
    		String eleName = ele.getName();
    		String eleStatus = ele.getStatus();
    		String eleType =eleTypeMap.get(ele.getTypeid());
    		dataMap.put("eleId", eleId);
	    	dataMap.put("desc", eleName);
	    	dataMap.put("status", eleStatus);
	    	dataMap.put("type", eleType);
	    	for(GenericOffering offering : offerings) {
	    		Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
	    		if(linksMap !=null) {
	    			if(linksMap.containsKey(ele.getId())) {
		    			dataMap.put(offering.getNumber(), "X");
		    		} else {
		    			dataMap.put(offering.getNumber(), "");
		    		}
	    		}
	    	}
	    	
	    	// data
			JSONArray jsonList = JSONArray.fromObject(dataMap);
			data.append(jsonList.toString().substring(1, jsonList.toString().length() - 1)).append(",");
		}
    	
		if (data.length() > 0) {
			data.deleteCharAt(data.length() - 1);
		}
		StringBuffer sb = new StringBuffer("{root:[").append(data).append("]}");
		PrintWriter out1 = null;
		try {
			out1 = response.getWriter();
			out1.print(sb.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findChooseRecordAndCheckinNew ", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	public String findOfferingsByIds() {
		HttpServletResponse response = ServletActionContext.getResponse();
		String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
		String objectType = ServletActionContext.getRequest().getParameter("objectType");
    	org.json.JSONArray jsonList = new org.json.JSONArray();
    	//objectType = URLDecoder.decode(s)
    	if("sbb".equalsIgnoreCase(objectType)) {
    		Long[] sbbIds = null;
        	List<Long> sbbIdList = new ArrayList<Long>();
        	for(String id: ids) {
				sbbIdList.add(Long.valueOf(id));
			}
			sbbIds = (Long[]) sbbIdList.toArray(new Long[sbbIdList.size()]);
			List<Sbb> sbbs = sbbService.findSbbListByIds(sbbIds);
			for(Sbb sbb : sbbs) {
				org.json.JSONObject dataMap = new org.json.JSONObject();
				String number = sbb.getNumber();
    	    	String name = sbb.getName();
    	    	dataMap.put("objectNumber", number);
    	    	dataMap.put("objectName", name);
    	    	jsonList.put(dataMap);
			}
        	
    	} 
    	else if("ph".equalsIgnoreCase(objectType)) {
    		Long[] phIds = null;
        	List<Long> phIdList = new ArrayList<Long>();
        	for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
        	List<ProductHierarchy> phs = productHierarchyService.getPHsByChoosePHID(phIds);
        	for(ProductHierarchy ph : phs) {
        		org.json.JSONObject dataMap = new org.json.JSONObject();
    	    	String number = ph.getHierarchyCode();
    	    	String name = ph.getLoisDescription();
    	    	dataMap.put("objectNumber", number);
    	    	dataMap.put("objectName", name);
    	    	jsonList.put(dataMap);
        	}
        	
    	} else {
    		List<GenericOffering> offerings = genericOfferingService.findGenericOfferingByIds(ids);
    		for(GenericOffering offering : offerings) {
    	    	org.json.JSONObject dataMap = new org.json.JSONObject();
    	    	String number = offering.getNumber();
    	    	String name = offering.getName();
    	    	dataMap.put("objectNumber", number);
    	    	dataMap.put("objectName", name);
    	    	jsonList.put(dataMap);
    		}
    	}
    	
    	

		String offeringResults = jsonList.toString();
		PrintWriter out1 = null;
		
		try {
			out1 = response.getWriter();
			JSONObject resultObj = new JSONObject();
			resultObj.put("success",true);
			resultObj.put("targetPageNo",1);
			resultObj.put("totalCount",1);
			resultObj.put("results",offeringResults);
			out1.print(resultObj.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findObjectNumbers Translation", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	public String findElementsByObjectIdsNew() {
		HttpServletResponse response = ServletActionContext.getResponse();
    	String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
    	String objectType = ServletActionContext.getRequest().getParameter("objectType");
    	String[] searchResults = ServletActionContext.getRequest().getParameterValues("searchResults");
    	String[] fieldsValue = ServletActionContext.getRequest().getParameterValues("fieldsValue");

    	Long[] sbbIds = null;
    	List<Long> sbbIdList = new ArrayList<Long>();
    	Set<String> set = new HashSet<>();
		for(int i=0;i<ids.length;i++){
			set.add(ids[i]);
		}
		
		Long[] phIds = null;
    	List<Long> phIdList = new ArrayList<Long>();
		
		
		List<GenericOffering> offerings = new ArrayList<GenericOffering>();
		List<Sbb> sbbs = new ArrayList<Sbb>();
		List<ProductHierarchy> phs = new ArrayList<ProductHierarchy>();
		Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		
		if("sbb".equalsIgnoreCase(objectType)) {
			for(String id: ids) {
				sbbIdList.add(Long.valueOf(id));
			}
			sbbIds = (Long[]) sbbIdList.toArray(new Long[sbbIdList.size()]);
			sbbs = sbbService.findSbbListByIds(sbbIds);
			for(Sbb sbb : sbbs) {
				List<Element> links = sbbElementLinkService.findElementsBySbbid(sbb.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(Element link : links) {
					linkMap.put(link.getId(),link.getId());
				}
				eleLinksMap.put(sbb.getNumber(), linkMap);
			}
		} else if("ph".equalsIgnoreCase(objectType)) {
			
        	for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
        	phs = productHierarchyService.getPHsByChoosePHID(phIds);
        	for(ProductHierarchy ph : phs) {
        		List<ElementAndOfferingBean> links = phElementLinkService.searchPhElementLinkByCondition(ph.getId());
        		Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(ElementAndOfferingBean link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(ph.getHierarchyCode(), linkMap);
        	}
		} else {
			ids = (String[]) set.toArray(new String[set.size()]);
			offerings = genericOfferingService.findGenericOfferingByIds(ids);

			for(GenericOffering offering : offerings ) {
				List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(OfferingElementLink link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(offering.getNumber(), linkMap);
			}
		}

		List<ElementDataBeanForUI> elements = updateElementLinksForUIService.findElementsByObjectIdNew(objectType, ids);

	    org.json.JSONArray jsonList = new org.json.JSONArray();
    	
    	
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
		if(searchResults!=null) {
			List<ElementDataBeanForUI> newElements = new ArrayList<ElementDataBeanForUI>();
			for(String sr : searchResults) {
				String str[] = sr.split("&-&");
				if(str.length==4) {
					Long id = Long.valueOf(str[0]);
					String name = str[1];
					name = URLDecoder.decode(name);
					String status = str[2];
					String type = str[3];
					Long typeId = eleTypeMap1.get(type);
					ElementDataBeanForUI ele = new ElementDataBeanForUI();
					ele.setId(id);
					ele.setName(name);
					ele.setStatus(status);
					ele.setTypeid(typeId);
					newElements.add(ele);
				}
			}
			if(newElements.size()>0) {
				List<Long> eleIdList = new ArrayList<>();
				for(ElementDataBeanForUI ele : elements) {
					eleIdList.add(ele.getId());
				}
				
				for(ElementDataBeanForUI ele : newElements) {
					if(!eleIdList.contains(ele.getId())) {
						elements.add(ele);
						eleIdList.add(ele.getId());
					}
				}
			}
		}
		
    	for(ElementDataBeanForUI ele : elements) {
    		org.json.JSONObject dataMap = new org.json.JSONObject();
    		String eleId = ele.getId().toString();
    		String eleName = ele.getName();
    		String eleStatus = ele.getStatus();
    		String eleType =eleTypeMap.get(ele.getTypeid());
    		dataMap.put("eleId", eleId);
	    	dataMap.put("eleName", eleName);
	    	dataMap.put("eleStatus", eleStatus);
	    	dataMap.put("eleType", eleType);
	    	if("sbb".equalsIgnoreCase(objectType)) {
	    		for(Sbb sbb : sbbs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(sbb.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(sbb.getNumber(), "X");
			    		} else {
			    			dataMap.put(sbb.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(sbb.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(sbb.getNumber(), "");
			    				}else {
			    					dataMap.put(sbb.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else if("ph".equalsIgnoreCase(objectType)){
	    		for(ProductHierarchy ph : phs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(ph.getHierarchyCode());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(ph.getHierarchyCode(), "X");
			    		} else {
			    			dataMap.put(ph.getHierarchyCode(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(ph.getHierarchyCode()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(ph.getHierarchyCode(), "");
			    				}else {
			    					dataMap.put(ph.getHierarchyCode(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else {
	    		for(GenericOffering offering : offerings) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(offering.getNumber(), "X");
			    		} else {
			    			dataMap.put(offering.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(offering.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(offering.getNumber(), "");
			    				}else {
			    					dataMap.put(offering.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	}
	    	
	    	jsonList.put(dataMap);
    	}

		System.out.println("results size:" + jsonList.length());
		System.out.println("results internal:" + jsonList.toString());
		
		String eleResults = jsonList.toString();
		PrintWriter out1 = null;
		
		
		try {
			out1 = response.getWriter();
			JSONObject resultObj = new JSONObject();
			resultObj.put("success",true);
			resultObj.put("targetPageNo",1);
			resultObj.put("totalCount",1);
			resultObj.put("results",eleResults);
			out1.print(resultObj.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findElementsByObjectIdsNew Translation", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	public String checkOutObjectsByObjectIdsNew(){
		
		String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
		String objectIds=StringUtils.join(ids, ","); 
    	String objectType = ServletActionContext.getRequest().getParameter("objectType");
    	if("ph".equalsIgnoreCase(objectType)) {
    		message = "ok";
    		return SUCCESS;
    	}
		boolean flag = updateElementLinksForUIService.checkOutObjectsByObjectIds(objectType, objectIds);
		if(flag){
			message = "ok";
		}else{
			message = "Some objects is being check out by other people.";
		}
		return SUCCESS;
	}
	
	public String checkOutObjectsByObjectIds(){
		objectIds=objectIds.replaceAll(";", ",");
		boolean flag = updateElementLinksForUIService.checkOutObjectsByObjectIds(objectType, objectIds);
		if(flag){
			message = "ok";
		}else{
			message = "Some objects is being check out by other people.";
		}
		return SUCCESS;
	}
	
	public String checkInObjectsByObjectIds(){
		message = updateElementLinksForUIService.checkInObjectsByObjectIds(objectType, objectsStr, versionType);
		return SUCCESS;
	}
	
	public String checkInObjectsByObjectIdsNew(){
		String fieldsValue[] = ServletActionContext.getRequest().getParameterValues("fieldsValue");
		String objectType = ServletActionContext.getRequest().getParameter("objectType");
		String versionType = ServletActionContext.getRequest().getParameter("versionType");
		message = updateElementLinksForUIService.checkInObjectsByObjectIdsNew(objectType, fieldsValue, versionType);
		return SUCCESS;
	}
	
	public String undoObjectsByObjectIds(){
		objectIds=objectIds.replaceAll(";", ",");
		boolean flag = updateElementLinksForUIService.undoObjectsByObjectIds(objectType, objectIds);
		if(flag){
			message = "ok";
		}else{
			message = "error";
		}
		return SUCCESS;
	}
	
	public String generateElementLinkLoadSheet(){
		User user = (User)ServletActionContext.getRequest().getSession().getAttribute(Constant.SESSION_KEY_USER);
		StringBuffer excelName = new StringBuffer();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String millString = Long.toString(System.currentTimeMillis());
		int iLen = millString.length();
		String randomString = millString.substring(iLen - 5);
		excelName.append(objectType+"Element_Spreadsheet_");
		excelName.append(format.format(SystemHelper.getCurrentSystemTime()));
		excelName.append("_"+user.getItcode()+"_");
		excelName.append(randomString);
		excelName.append(".xlsx");
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("aplication/msexcel");
		response.setHeader("Content-disposition", "attachment; filename="
				+ excelName.toString());
		try {
			OutputStream os = ServletActionContext.getResponse()
			.getOutputStream();
			try {
				updateElementLinksForUIService.generateElementLinkLoadSheet(objectType,matrix,typeKeys,os,needCheckout);
			} catch (Exception e) {
			    logger.error("ERROR:",e);
                logger.error(e.getMessage(),e);
				return null;
			}
		} catch (IOException e1) {
		    logger.error("ERROR:",e1);
            logger.error(e1.getMessage(),e1);
			return null;
		}
		return null;
	}
	
	public String generateElementLinkLoadSheetNew(){
		String ids[] = ServletActionContext.getRequest().getParameterValues("idList");
    	String objectType = ServletActionContext.getRequest().getParameter("objType");
    	
    	// 查出所有的element
    	
    	String[] typeKeys = ServletActionContext.getRequest().getParameterValues("typeKeys");
    	typeKeys = removeDuplicates(typeKeys);
    	String[] exportData = ServletActionContext.getRequest().getParameterValues("exportData");
    	exportData = removeDuplicates(exportData);
    	String needCheckout = ServletActionContext.getRequest().getParameter("needCheckout");
    	
    	
    	
    	String[] matrixNew;
    	List<String> matrixList =new ArrayList();
    	StringBuffer header = new StringBuffer();
    	
    	Map<String,String[]> infoMap = new HashMap<String,String[]>();
    	Map<String,List<String>> infoListMap = new HashMap<>();
    	
    	Long[] sbbIds = null;
    	List<Long> sbbIdList = new ArrayList<Long>();
    	
    	Long[] phIds = null;
    	List<Long> phIdList = new ArrayList<Long>();
		
    	
    	Set<String> set = new HashSet<>();
		for(int i=0;i<ids.length;i++){
			set.add(ids[i]);
		}
    	
    	List<GenericOffering> offerings = new ArrayList<GenericOffering>();
		List<Sbb> sbbs = new ArrayList<Sbb>();
		List<ProductHierarchy> phs = new ArrayList<ProductHierarchy>();
		Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		
		if("sbb".equalsIgnoreCase(objectType)) {
			for(String id: ids) {
				sbbIdList.add(Long.valueOf(id));
			}
			sbbIds = (Long[]) sbbIdList.toArray(new Long[sbbIdList.size()]);
			sbbs = sbbService.findSbbListByIds(sbbIds);
			for(Sbb sbb : sbbs) {
				List<Element> links = sbbElementLinkService.findElementsBySbbid(sbb.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(Element link : links) {
					linkMap.put(link.getId(),link.getId());
				}
				eleLinksMap.put(sbb.getNumber(), linkMap);
			}
		}else if("ph".equalsIgnoreCase(objectType)){
			for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
        	phs = productHierarchyService.getPHsByChoosePHID(phIds);
        	for(ProductHierarchy ph : phs) {
        		List<ElementAndOfferingBean> links = phElementLinkService.searchPhElementLinkByCondition(ph.getId());
        		Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(ElementAndOfferingBean link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(ph.getHierarchyCode(), linkMap);
        	}
		}else {
			ids = (String[]) set.toArray(new String[set.size()]);
			offerings = genericOfferingService.findGenericOfferingByIds(ids);

			for(GenericOffering offering : offerings ) {
				List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(OfferingElementLink link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(offering.getNumber(), linkMap);
			}
		}
    	
    	
    	
    	Map<Long,String> typeAttriMap = new HashMap<Long,String>();
		List<ElementTypeAttribute> typeAttributes= elementTypeAttributeService.findAllTypeAttributes();
		for(ElementTypeAttribute typeAttri :typeAttributes) {
			typeAttriMap.put(typeAttri.getId(), typeAttri.getName());
		}
		
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
    	header.append("ID,LOISCELL=TYPE NAME,LOISCELL=ELEMENT NAME");
    	
    	if("sbb".equalsIgnoreCase(objectType)) {
    		for(Sbb sbb : sbbs) {
        		header.append(",LOISCELL="+sbb.getName()+"["+sbb.getNumber()+"]");
        	}
    	} else if("ph".equalsIgnoreCase(objectType)){
    		for(ProductHierarchy ph : phs) {
    			header.append(",LOISCELL="+ph.getLoisDescription()+"["+ph.getHierarchyCode()+"]");
    		}
    	} else {
    		for(GenericOffering offering : offerings) {
        		header.append(",LOISCELL="+offering.getName()+"["+offering.getNumber()+"]");
        	}
    	}
    	
    	
    	//eleId:17648881684;eleName:Paris Feature Benefits;eleStatus:Final;eleType:FB;0196CTO:X;
    	
    	//36[17648881684],LOISCELL=FB,LOISCELL=Paris Feature Benefits,LOISCELL=X,
    	matrixList.add(header.toString());
    	if(exportData!=null) {
    		for(String str : exportData) {
    			
    			StringBuffer dataBuffer = new StringBuffer();
    			
    			//eleId
    			String eleId = str;
    			Element element = elementService.loadEntityById(Long.valueOf(eleId));
    			//eleName
    			String eleName = element.getName();
    			//eleName = URLDecoder.decode(eleName);
    			//eleStatus
    			//String eleStatus = element.getStatus();
    			//eleType
    			String eleType = eleTypeMap.get(element.getElementTypeId());
    			String typeId = element.getElementTypeId().toString();
    			
    			dataBuffer.append(typeId+"["+eleId+"]");
    			dataBuffer.append(",LOISCELL="+eleType);
    			dataBuffer.append(",LOISCELL="+eleName);
    			
    			if("sbb".equalsIgnoreCase(objectType)) {
    				for(int i = 0;i<sbbs.size();i++) {
        				Sbb sbb =  sbbs.get(i);
        				String value="";
        				Map<Long,Long> linksMap = eleLinksMap.get(sbb.getNumber());
        	    		if(linksMap !=null) {
        	    			if(linksMap.containsKey(element.getId())) {
        	    				value = "X";
        		    		}
        	    		}
        				dataBuffer.append(",LOISCELL="+value);
        			}
    			} else if("ph".equalsIgnoreCase(objectType)) {
    				for(int i = 0;i<phs.size();i++) {
        				ProductHierarchy ph =  phs.get(i);
        				String value="";
        				Map<Long,Long> linksMap = eleLinksMap.get(ph.getHierarchyCode());
        	    		if(linksMap !=null) {
        	    			if(linksMap.containsKey(element.getId())) {
        	    				value = "X";
        		    		}
        	    		}
        				dataBuffer.append(",LOISCELL="+value);
        			}
    			} else {
    				for(int i = 0;i<offerings.size();i++) {
        				GenericOffering offering =  offerings.get(i);
        				String value="";
        				Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
        	    		if(linksMap !=null) {
        	    			if(linksMap.containsKey(element.getId())) {
        	    				value = "X";
        		    		}
        	    		}
        				dataBuffer.append(",LOISCELL="+value);
        			}
    			}
    			
    			matrixList.add(dataBuffer.toString());
    			
    			
    			List<ElementAttribute> attriList = this.elementAttributeService.findAttributeByEleId(element.getId());
    			
    			attriList.sort(new Comparator<ElementAttribute>() {
    			        @Override
    			        public int compare(ElementAttribute o1, ElementAttribute o2) {
    			            return (int) (o1.getElementTypeAttribute().getId()-o2.getElementTypeAttribute().getId());
    			        }
    			    });
    			
    			if(infoListMap.keySet().contains(eleType)) {
    				StringBuffer valueBuffer = new StringBuffer();
    				valueBuffer.append(element.getId());
    				valueBuffer.append(",LOISCELL="+element.getName());
    				valueBuffer.append(",LOISCELL="+element.getElementVersion());
    				valueBuffer.append(",LOISCELL="+element.getStatus());
    				for(ElementAttribute attri : attriList) {
    					if(attri.getValue()==null) {
    						valueBuffer.append(",LOISCELL=");
    					}else {
    						valueBuffer.append(",LOISCELL="+attri.getValue());
    					}
    				}
    				infoListMap.get(eleType).add(valueBuffer.toString());
    			}else {
    				List<String> tempList = new ArrayList<String>();
    				StringBuffer headerBuffer = new StringBuffer();
    				StringBuffer valueBuffer = new StringBuffer();
    				headerBuffer.append("Element ID,LOISCELL=Element Desc,LOISCELL=Version,LOISCELL=Status");
    				valueBuffer.append(element.getId());
    				valueBuffer.append(",LOISCELL="+element.getName());
    				valueBuffer.append(",LOISCELL="+element.getElementVersion());
    				valueBuffer.append(",LOISCELL="+element.getStatus());
    				for(ElementAttribute attri : attriList) {
    					headerBuffer.append(",LOISCELL="+typeAttriMap.get(attri.getElementTypeAttribute().getId()));
    					if(attri.getValue()==null) {
    						valueBuffer.append(",LOISCELL=");
    					}else {
    						valueBuffer.append(",LOISCELL="+attri.getValue());
    					}
    					
    				}
    				tempList.add(headerBuffer.toString());
    				tempList.add(valueBuffer.toString());
    				infoListMap.put(eleType, tempList);
    			}
        	}
    	}
    	
    	matrixNew = matrixList.toArray(new String[0]);
    	
    	if(typeKeys!=null) {
    		for(String type : typeKeys) {
        		List<String> str = infoListMap.get(type);
        		infoMap.put(type, str.toArray(new String[0]));
        	}
    	}
    	
    	
    	
		User user = (User)ServletActionContext.getRequest().getSession().getAttribute(Constant.SESSION_KEY_USER);
		StringBuffer excelName = new StringBuffer();
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String millString = Long.toString(System.currentTimeMillis());
		int iLen = millString.length();
		String randomString = millString.substring(iLen - 5);
		excelName.append(objectType+"Element_Spreadsheet_");
		excelName.append(format.format(SystemHelper.getCurrentSystemTime()));
		excelName.append("_"+user.getItcode()+"_");
		excelName.append(randomString);
		excelName.append(".xlsx");
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("aplication/msexcel");
		response.setHeader("Content-disposition", "attachment; filename="
				+ excelName.toString());
		try {
			OutputStream os = ServletActionContext.getResponse()
			.getOutputStream();
			try {
				updateElementLinksForUIService.generateElementLinkLoadSheetNew(objectType,matrixNew,typeKeys,infoMap,os,needCheckout);
			} catch (Exception e) {
			    logger.error("ERROR:",e);
                logger.error(e.getMessage(),e);
				return null;
			}
		} catch (IOException e1) {
		    logger.error("ERROR:",e1);
            logger.error(e1.getMessage(),e1);
			return null;
		}
		return null;
	}
	
	public String[] removeDuplicates(String[] arrStr) {
		List<String> list = new ArrayList<>();
		if(arrStr==null) {
			return null;
		}
	    for (int i=0; i<arrStr.length; i++) {
	        if(!list.contains(arrStr[i])) {
	            list.add(arrStr[i]);
	       }
	    }
	    String[] newArrStr =  list.toArray(new String[1]);
	    return newArrStr;
	}
	
	public String getObjectIds() {
		return objectIds;
	}

	public void setObjectIds(String objectIds) {
		this.objectIds = objectIds;
	}

	public String getElementTypesStr() {
		return elementTypesStr;
	}

	public void setElementTypesStr(String elementTypesStr) {
		this.elementTypesStr = elementTypesStr;
	}

	public String getElementsStr() {
		return elementsStr;
	}

	public void setElementsStr(String elementsStr) {
		this.elementsStr = elementsStr;
	}

	public String getObjectsStr() {
		return objectsStr;
	}

	public void setObjectsStr(String objectsStr) {
		this.objectsStr = objectsStr;
	}

	public void setUpdateElementLinksForUIService(
			UpdateElementLinksForUIService updateElementLinksForUIService) {
		this.updateElementLinksForUIService = updateElementLinksForUIService;
	}

	public String getObjectType() {
		return objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getVersionType() {
		return versionType;
	}

	public void setVersionType(String versionType) {
		this.versionType = versionType;
	}

	public String[] getMatrix() {
		return matrix;
	}

	public void setMatrix(String[] matrix) {
		this.matrix = matrix;
	}

	public String[] getTypeKeys() {
		return typeKeys;
	}

	public void setTypeKeys(String[] typeKeys) {
		this.typeKeys = typeKeys;
	}

	public String getNeedCheckout() {
		return needCheckout;
	}

	public void setNeedCheckout(String needCheckout) {
		this.needCheckout = needCheckout;
	}

	public String getPhType() {
		return phType;
	}

	public void setPhType(String phType) {
		this.phType = phType;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setGenericOfferingService(GenericOfferingService genericOfferingService) {
		this.genericOfferingService = genericOfferingService;
	}
	
	public void setElementTypeService(ElementTypeService elementTypeService) {
        this.elementTypeService = elementTypeService;
    }
	
	public void setOfferingElementLinkService(OfferingElementLinkService offeringElementLinkService) {
        this.offeringElementLinkService = offeringElementLinkService;
    }
	
	public void setElementAttributeService(ElementAttributeService elementAttributeService) {
        this.elementAttributeService = elementAttributeService;
    }
	
	public void setElementService(ElementService elementService) {
        this.elementService = elementService;
    }

	public void setElementTypeAttributeService(ElementTypeAttributeService elementTypeAttributeService) {
		this.elementTypeAttributeService = elementTypeAttributeService;
	}
	
	public void setSbbService(SbbService sbbService) {
        this.sbbService = sbbService;
    }
	
	public void setSbbElementLinkService(SbbElementLinkService sbbElementLinkService) {
        this.sbbElementLinkService = sbbElementLinkService;
    }
	
	public void setProductHierarchyService(ProductHierarchyService productHierarchyService) {
        this.productHierarchyService = productHierarchyService;
    }
	public void setPhElementLinkService(PHElementLinkService phElementLinkService) {
		this.phElementLinkService = phElementLinkService;
	}
	
	public String findElementsByObjectIdsNew2() {
		HttpServletResponse response = ServletActionContext.getResponse();
    	String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
    	String objectType = ServletActionContext.getRequest().getParameter("objectType");
    	String[] searchResults = ServletActionContext.getRequest().getParameterValues("searchResults");
    	String[] fieldsValue = ServletActionContext.getRequest().getParameterValues("fieldsValue");

    	Long[] sbbIds = null;
    	List<Long> sbbIdList = new ArrayList<Long>();
    	Set<String> set = new HashSet<>();
		for(int i=0;i<ids.length;i++){
			set.add(ids[i]);
		}
		
		Long[] phIds = null;
    	List<Long> phIdList = new ArrayList<Long>();
		
		
		List<GenericOffering> offerings = new ArrayList<GenericOffering>();
		List<Sbb> sbbs = new ArrayList<Sbb>();
		List<ProductHierarchy> phs = new ArrayList<ProductHierarchy>();
		Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		
		if("sbb".equalsIgnoreCase(objectType)) {
			for(String id: ids) {
				sbbIdList.add(Long.valueOf(id));
			}
			sbbIds = (Long[]) sbbIdList.toArray(new Long[sbbIdList.size()]);
			sbbs = sbbService.findSbbListByIds(sbbIds);
			for(Sbb sbb : sbbs) {
				List<Element> links = sbbElementLinkService.findElementsBySbbid(sbb.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(Element link : links) {
					linkMap.put(link.getId(),link.getId());
				}
				eleLinksMap.put(sbb.getNumber(), linkMap);
			}
		} else if("ph".equalsIgnoreCase(objectType)) {
			
        	for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
        	phs = productHierarchyService.getPHsByChoosePHID(phIds);
        	for(ProductHierarchy ph : phs) {
        		List<ElementAndOfferingBean> links = phElementLinkService.searchPhElementLinkByCondition(ph.getId());
        		Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(ElementAndOfferingBean link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(ph.getHierarchyCode(), linkMap);
        	}
		} else {
			ids = (String[]) set.toArray(new String[set.size()]);
			offerings = genericOfferingService.findGenericOfferingByIds(ids);

			for(GenericOffering offering : offerings ) {
				List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(OfferingElementLink link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(offering.getNumber(), linkMap);
			}
		}

//		List<ElementDataBeanForUI> elements = updateElementLinksForUIService.findElementsByObjectIdNew(objectType, ids);
		List<ElementDataBeanForUI> elements = new ArrayList<>();

	    org.json.JSONArray jsonList = new org.json.JSONArray();
    	
    	
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
		if(searchResults!=null) {
			List<ElementDataBeanForUI> newElements = new ArrayList<ElementDataBeanForUI>();
			for(String sr : searchResults) {
				String str[] = sr.split("&-&");
				if(str.length==4) {
					Long id = Long.valueOf(str[0]);
					String name = str[1];
					name = URLDecoder.decode(name);
					String status = str[2];
					String type = str[3];
					Long typeId = eleTypeMap1.get(type);
					ElementDataBeanForUI ele = new ElementDataBeanForUI();
					ele.setId(id);
					ele.setName(name);
					ele.setStatus(status);
					ele.setTypeid(typeId);
					newElements.add(ele);
				}
			}
			if(newElements.size()>0) {
				List<Long> eleIdList = new ArrayList<>();
				for(ElementDataBeanForUI ele : elements) {
					eleIdList.add(ele.getId());
				}
				
				for(ElementDataBeanForUI ele : newElements) {
					if(!eleIdList.contains(ele.getId())) {
						elements.add(ele);
						eleIdList.add(ele.getId());
					}
				}
			}
		}
		
    	for(ElementDataBeanForUI ele : elements) {
    		org.json.JSONObject dataMap = new org.json.JSONObject();
    		String eleId = ele.getId().toString();
    		String eleName = ele.getName();
    		String eleStatus = ele.getStatus();
    		String eleType =eleTypeMap.get(ele.getTypeid());
    		dataMap.put("eleId", eleId);
	    	dataMap.put("eleName", eleName);
	    	dataMap.put("eleStatus", eleStatus);
	    	dataMap.put("eleType", eleType);
	    	if("sbb".equalsIgnoreCase(objectType)) {
	    		for(Sbb sbb : sbbs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(sbb.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(sbb.getNumber(), "X");
			    		} else {
			    			dataMap.put(sbb.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(sbb.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(sbb.getNumber(), "");
			    				}else {
			    					dataMap.put(sbb.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else if("ph".equalsIgnoreCase(objectType)){
	    		for(ProductHierarchy ph : phs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(ph.getHierarchyCode());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(ph.getHierarchyCode(), "X");
			    		} else {
			    			dataMap.put(ph.getHierarchyCode(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(ph.getHierarchyCode()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(ph.getHierarchyCode(), "");
			    				}else {
			    					dataMap.put(ph.getHierarchyCode(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else {
	    		for(GenericOffering offering : offerings) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(offering.getNumber(), "X");
			    		} else {
			    			dataMap.put(offering.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(offering.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(offering.getNumber(), "");
			    				}else {
			    					dataMap.put(offering.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	}
	    	
	    	jsonList.put(dataMap);
    	}

		System.out.println("results size:" + jsonList.length());
		System.out.println("results internal:" + jsonList.toString());
		
		String eleResults = jsonList.toString();
		PrintWriter out1 = null;
		
		
		try {
			out1 = response.getWriter();
			JSONObject resultObj = new JSONObject();
			resultObj.put("success",true);
			resultObj.put("targetPageNo",1);
			resultObj.put("totalCount",1);
			resultObj.put("results",eleResults);
			out1.print(resultObj.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findElementsByObjectIdsNew Translation", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	// 导出之前,查所有的element
	public String findElementsByObjectIdsNew_export(String[] ids,String objectType) {
		HttpServletResponse response = ServletActionContext.getResponse();
//    	String ids[] = ServletActionContext.getRequest().getParameterValues("ids");
//    	String objectType = ServletActionContext.getRequest().getParameter("objectType");
//    	String[] searchResults = ServletActionContext.getRequest().getParameterValues("searchResults");
//    	String[] fieldsValue = ServletActionContext.getRequest().getParameterValues("fieldsValue");
    	String[] searchResults = null;
    	String[] fieldsValue = null;

    	Long[] sbbIds = null;
    	List<Long> sbbIdList = new ArrayList<Long>();
    	Set<String> set = new HashSet<>();
		for(int i=0;i<ids.length;i++){
			set.add(ids[i]);
		}
		
		Long[] phIds = null;
    	List<Long> phIdList = new ArrayList<Long>();
		
		
		List<GenericOffering> offerings = new ArrayList<GenericOffering>();
		List<Sbb> sbbs = new ArrayList<Sbb>();
		List<ProductHierarchy> phs = new ArrayList<ProductHierarchy>();
		Map<String,Map<Long,Long>> eleLinksMap = new HashMap<String,Map<Long,Long>>();
		
		if("sbb".equalsIgnoreCase(objectType)) {
			for(String id: ids) {
				sbbIdList.add(Long.valueOf(id));
			}
			sbbIds = (Long[]) sbbIdList.toArray(new Long[sbbIdList.size()]);
			sbbs = sbbService.findSbbListByIds(sbbIds);
			for(Sbb sbb : sbbs) {
				List<Element> links = sbbElementLinkService.findElementsBySbbid(sbb.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(Element link : links) {
					linkMap.put(link.getId(),link.getId());
				}
				eleLinksMap.put(sbb.getNumber(), linkMap);
			}
		} else if("ph".equalsIgnoreCase(objectType)) {
			
        	for(String id: ids) {
        		phIdList.add(Long.valueOf(id));
			}
        	phIds = (Long[]) phIdList.toArray(new Long[phIdList.size()]);
        	phs = productHierarchyService.getPHsByChoosePHID(phIds);
        	for(ProductHierarchy ph : phs) {
        		List<ElementAndOfferingBean> links = phElementLinkService.searchPhElementLinkByCondition(ph.getId());
        		Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(ElementAndOfferingBean link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(ph.getHierarchyCode(), linkMap);
        	}
		} else {
			ids = (String[]) set.toArray(new String[set.size()]);
			offerings = genericOfferingService.findGenericOfferingByIds(ids);

			for(GenericOffering offering : offerings ) {
				List<OfferingElementLink> links = offeringElementLinkService.searchByCondition(offering.getId());
				Map<Long,Long> linkMap = new HashMap<Long,Long>();
				for(OfferingElementLink link : links) {
					linkMap.put(link.getElementId(),link.getOfferingId());
				}
				eleLinksMap.put(offering.getNumber(), linkMap);
			}
		}

		List<ElementDataBeanForUI> elements = updateElementLinksForUIService.findElementsByObjectIdNew(objectType, ids);

	    org.json.JSONArray jsonList = new org.json.JSONArray();
    	
    	
    	List<ElementType> eleTypeList = this.elementTypeService.findAll();
    	Map<Long,String> eleTypeMap = new HashMap<Long,String>();
    	Map<String,Long> eleTypeMap1 = new HashMap<String,Long>();
    	for(ElementType eleType : eleTypeList) {
    		eleTypeMap.put(eleType.getId(), eleType.getName());
    		eleTypeMap1.put(eleType.getName(), eleType.getId());
    	}
    	
		if(searchResults!=null) {
			List<ElementDataBeanForUI> newElements = new ArrayList<ElementDataBeanForUI>();
			for(String sr : searchResults) {
				String str[] = sr.split("&-&");
				if(str.length==4) {
					Long id = Long.valueOf(str[0]);
					String name = str[1];
					name = URLDecoder.decode(name);
					String status = str[2];
					String type = str[3];
					Long typeId = eleTypeMap1.get(type);
					ElementDataBeanForUI ele = new ElementDataBeanForUI();
					ele.setId(id);
					ele.setName(name);
					ele.setStatus(status);
					ele.setTypeid(typeId);
					newElements.add(ele);
				}
			}
			if(newElements.size()>0) {
				List<Long> eleIdList = new ArrayList<>();
				for(ElementDataBeanForUI ele : elements) {
					eleIdList.add(ele.getId());
				}
				
				for(ElementDataBeanForUI ele : newElements) {
					if(!eleIdList.contains(ele.getId())) {
						elements.add(ele);
						eleIdList.add(ele.getId());
					}
				}
			}
		}
		
    	for(ElementDataBeanForUI ele : elements) {
    		org.json.JSONObject dataMap = new org.json.JSONObject();
    		String eleId = ele.getId().toString();
    		String eleName = ele.getName();
    		String eleStatus = ele.getStatus();
    		String eleType =eleTypeMap.get(ele.getTypeid());
    		dataMap.put("eleId", eleId);
	    	dataMap.put("eleName", eleName);
	    	dataMap.put("eleStatus", eleStatus);
	    	dataMap.put("eleType", eleType);
	    	if("sbb".equalsIgnoreCase(objectType)) {
	    		for(Sbb sbb : sbbs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(sbb.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(sbb.getNumber(), "X");
			    		} else {
			    			dataMap.put(sbb.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(sbb.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(sbb.getNumber(), "");
			    				}else {
			    					dataMap.put(sbb.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else if("ph".equalsIgnoreCase(objectType)){
	    		for(ProductHierarchy ph : phs) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(ph.getHierarchyCode());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(ph.getHierarchyCode(), "X");
			    		} else {
			    			dataMap.put(ph.getHierarchyCode(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(ph.getHierarchyCode()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(ph.getHierarchyCode(), "");
			    				}else {
			    					dataMap.put(ph.getHierarchyCode(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	} else {
	    		for(GenericOffering offering : offerings) {
		    		Map<Long,Long> linksMap = eleLinksMap.get(offering.getNumber());
		    		if(linksMap !=null) {
		    			if(linksMap.containsKey(ele.getId())) {
			    			dataMap.put(offering.getNumber(), "X");
			    		} else {
			    			dataMap.put(offering.getNumber(), "");
			    		}
		    		}
		    		
			    	if(null != fieldsValue) {
			    		for(String field : fieldsValue) {
			    			if(field.indexOf(eleId) > -1 && field.indexOf(offering.getNumber()) > -1) {
			    				String value = field.split(",")[2];
			    				if(value.equals("none")) {
			    					dataMap.put(offering.getNumber(), "");
			    				}else {
			    					dataMap.put(offering.getNumber(), "X");
			    				}
			    			}
			    		}
			    	}
		    	}
	    	}
	    	
	    	jsonList.put(dataMap);
    	}

		System.out.println("results size:" + jsonList.length());
		System.out.println("results internal:" + jsonList.toString());
		
		String eleResults = jsonList.toString();
		PrintWriter out1 = null;
		
		
		try {
			out1 = response.getWriter();
			JSONObject resultObj = new JSONObject();
			resultObj.put("success",true);
			resultObj.put("targetPageNo",1);
			resultObj.put("totalCount",1);
			resultObj.put("results",eleResults);
			out1.print(resultObj.toString());
		} catch (IOException e) {
			logger.error("ERROR:", e);
			logger.error("IOException occured when findElementsByObjectIdsNew Translation", e);
			return "error";
		} finally {
			if (out1 != null) {
				out1.close();
			}
		}
		return "success";
	}
	
	
	
	
	
}
