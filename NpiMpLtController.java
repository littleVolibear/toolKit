package com.lenovo.mbg.portal.integration.controller;

import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.lenovo.mbg.portal.accesslog.service.AccessLogService;
import com.lenovo.mbg.portal.integration.dao.WCEBOMLatestMapper;
import com.lenovo.mbg.portal.integration.dao.WCItemLatestMapper;
import com.lenovo.mbg.portal.integration.dao.WCMBOMLatestMapper;
import com.lenovo.mbg.portal.integration.dao.WCMEPMapper;
import com.lenovo.mbg.portal.integration.model.*;
import com.lenovo.mbg.portal.integration.service.SalesModelMatrixReportService;
import com.lenovo.mbg.portal.security.model.User;
import com.lenovo.mbg.portal.security.service.UserService;
import com.lenovo.mbg.util.APIResponse;
import com.lenovo.mbg.util.Constants;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping(value = "/npimplt")
public class NpiMpLtController {

    private static final Logger LOGGER = Logger.getLogger(NpiMpLtController.class.getName());

    @Autowired
    private SalesModelMatrixReportService salesModelMatrixReportService;

    @Autowired
    private UserService userService;

    @Autowired
    private AccessLogService accessLogService;

    @Autowired
    private WCMBOMLatestMapper wcMBOMLatestMapper;
    @Autowired
    private WCItemLatestMapper wcItemLatestMapper;
    @Autowired
    private WCMEPMapper wcmepMapper;



    @ApiOperation(value = "FG Full Part Number Lead Time Report", notes = "FG Full Part Number Lead Time Report")
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public APIResponse<Object> downloadSMM(@RequestParam(value = "headNumber", required = false) String DesignResponsibility,
                                           HttpServletRequest request, HttpServletResponse response) {
        APIResponse<Object> apiResponse = new APIResponse<>();
        System.out.println("6666666666666");
        LOGGER.debug("NpiMpLtController Begin to download===" + DesignResponsibility + "*^^*");
        String[] dr = DesignResponsibility.split(";;;QQQ");
        for (int i = 0; i < dr.length; i++) {
            LOGGER.debug(i + "DR" + dr[i]);
        }

        HashMap<String, List<String>> materialHeadNumberMap = new HashMap<>();//1.headerNumber : materialList
//        HashMap<String, String> qualifyStatusMaterilMap = new HashMap<>();
        HashMap<String, Double> usageMap = new HashMap<>();// 3. headerNumber quantitySum
        HashMap<String, String> initalMaterialMap = new HashMap<>();
        HashMap<String, String> nplLtMap = new HashMap<>();
        HashMap<String, String> mpLtMap = new HashMap<>();

        // 第一部分: start materialHeadNumberMap组装
        WCMBOMLatestExample example = new WCMBOMLatestExample();
        WCMBOMLatestExample.Criteria c = example.createCriteria();
        c.andHeaderNumberIn(Arrays.asList(dr));
        List<WCMBOMLatest> queryList = wcMBOMLatestMapper.selectByExample(example);
        Map<String, List<WCMBOMLatest>> wcmbomLatestsMap = queryList.stream().collect(Collectors.groupingBy(WCMBOMLatest::getHeaderNumber, Collectors.toList()));
        wcmbomLatestsMap.entrySet().stream().forEach(map->{
            // 1. headerNumber : materialList
            materialHeadNumberMap.put(map.getKey(),map.getValue().stream().map(WCMBOMLatest::getHeaderNumber).distinct().collect(Collectors.toList()));
        });
        // 第一部分: end materialHeadNumberMap组装

        // 组装联合Key  hearNumber#material  quantity/usage
//        Map<String, String> usageKeyMap = queryList.stream().collect(Collectors.toMap(key -> key.getHeaderNumber() + "#" + key.getComponentItemNumber(), value -> value.getComponentQuantity(), (v1, v2) -> v1));
        // 第二部分: start headerNumber:status      qualifyStatusMaterilMap
        List<String> queryMaterialList = queryList.stream().map(WCMBOMLatest::getComponentItemNumber).collect(Collectors.toList());
        WCItemLatestExample wcItemLatestExample = new WCItemLatestExample();
        WCItemLatestExample.Criteria cItem = wcItemLatestExample.createCriteria();
        cItem.andItemNumberIn(queryMaterialList);
        List<WCItemLatest> materialStatusList = wcItemLatestMapper.selectByExample(wcItemLatestExample);
        Map<String, String> qualifyStatusMaterilMap = materialStatusList.stream().collect(Collectors.toMap(key -> key.getItemNumber(), value -> value.getItemStatus(), (v1, v2) -> v1));
        // 第二部分 status 组装完毕

        // 第三部分: start headerNumber quantitySum
        example.clear();
        List<WCMBOMLatest> allList = wcMBOMLatestMapper.selectByExample(example);
        for (WCMBOMLatest wcmbomLatest : queryList) {
            ArrayList<Double> quantityList = Lists.newArrayList();
            getChild(wcmbomLatest,allList,quantityList);
            double sum = quantityList.stream().mapToDouble(ele -> ele).sum();
            // 3. headerNumber quantitySum
            usageMap.put(wcmbomLatest.getHeaderNumber(), sum);
        }
        // 第三部分: end headerNumber quantitySum

        // 第四部分:start Planned_Delivery_Time
        WCMEPExample wcmepExample = new WCMEPExample();
        WCMEPExample.Criteria mepC = wcmepExample.createCriteria();
        mepC.andItemNumberIn(queryMaterialList);
        List<WCMEP> mepList = wcmepMapper.selectByExample(wcmepExample);
        Map<String, List<WCMEP>> deliveryTimeMap = mepList.stream().collect(Collectors.groupingBy(bean -> bean.getItemNumber()));
        deliveryTimeMap.entrySet().stream().forEach(map->{
            Optional<WCMEP> max = map.getValue().stream().filter(bean -> StringUtils.isBlank(bean.getPlannedDeliveryTime())).max(Comparator.comparing(WCMEP::getPlannedDeliveryTime));
            WCMEP time_max = max.orElse(new WCMEP());
            initalMaterialMap.put(map.getKey(), time_max.getPlannedDeliveryTime());
        });
        // 第四部分: end Planned_Delivery_Time

        // 第五部分: NPI LT / MP LTQ
//        A a = new AExample();
//        WCMEPExample.Criteria cc = a.createCriteria();
//        cc.andxxxx(queryMaterialList);
//        List<A> list = xxxMapper.selectByExample(wcmepExample);
//        Map<String,String> npiLtMap = list.stream.collector(Collectors.toMap(key->key.getMaterial,value->value.getNpiLt,(v1,v2)->v1));
//        Map<String,String> mpLtMap = list.stream.collector(Collectors.toMap(key->key.getMaterial,value->value.getmpLt,(v1,v2)->v1));
        try {
            InputStream input = NpiMpLtController.class.getClassLoader()
                    .getResourceAsStream(Constants.NPIMPLT_PATH);
            Workbook workbook = new XSSFWorkbook(input);
            Sheet sheet = workbook.getSheetAt(0);
            //add table title
            LOGGER.debug("npimplt getTableTitle begin=====");

            int colNum = 0;
            int rowNum = 0;
            Row row = sheet.createRow(rowNum++);

            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            //row.setRowStyle(style);
            Cell cell1 = row.createCell(colNum++);
            cell1.setCellValue("Item Code");
            cell1.setCellStyle(style);
            Cell cell2 = row.createCell(colNum++);
            cell2.setCellValue("Material");
            cell2.setCellStyle(style);
            Cell cell3 = row.createCell(colNum++);
            cell3.setCellValue("qualify status");
            cell3.setCellStyle(style);
            Cell cell4 = row.createCell(colNum++);
            cell4.setCellValue("Usage");
            cell4.setCellStyle(style);
            Cell cell5 = row.createCell(colNum++);
            cell5.setCellValue("Initial Lt");
            cell5.setCellStyle(style);
            Cell cell6 = row.createCell(colNum++);
            cell6.setCellValue("NPL LT");
            cell6.setCellStyle(style);
            Cell cell7 = row.createCell(colNum++);
            cell7.setCellValue("MP LT");
            cell7.setCellStyle(style);


            // 检查headNumber是否有对应的子项,即用Component_Item_Number去查headNumber checkHeadNumberHasItems
            for (String headeNumberEle : dr) {
                List<String> materialsList = materialHeadNumberMap.getOrDefault(headeNumberEle, Lists.newArrayList());
                for (String material : materialsList) {
                    row = sheet.createRow(rowNum++);
                    int i = 0;
                    row.createCell(i).setCellValue(headeNumberEle);// headeNumber/Item Code
                    row.createCell(i).setCellValue(material);//Material
                    row.createCell(i).setCellValue(qualifyStatusMaterilMap.getOrDefault(material, ""));//qualify status
                    row.createCell(i).setCellValue(usageMap.get(headeNumberEle));//usage
                    row.createCell(i).setCellValue(initalMaterialMap.getOrDefault(material, ""));//inital
                    row.createCell(i).setCellValue(nplLtMap.getOrDefault(material, ""));//nplLt
                    row.createCell(i).setCellValue(mpLtMap.getOrDefault(material, ""));//mpLt
                    i++;
                }
            }
            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(Constants.TAG_EOF);

            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + Constants.SALESMODELMATRIX_REPORT);
            OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
            workbook.write(outputStream);
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return apiResponse;
    }

    public static void getChild(WCMBOMLatest root,List<WCMBOMLatest> list,List<Double> quantityList){
        ArrayList<WCMBOMLatest> childList = Lists.newArrayList();
        for (WCMBOMLatest bom : list) {
            if(bom.getComponentItemNumber().equals(root.getHeaderNumber())){
                childList.add(bom);
                quantityList.add(Double.parseDouble(bom.getComponentQuantity()));
            }
        }
        if(childList.isEmpty()){
            return ;
        }
        String json = JSON.toJSONString(childList);
        System.out.println("json:+======" + json);
        for (WCMBOMLatest b : childList) {
            getChild(b,list,quantityList);
        }
    }


    @PostMapping(value = "/upload")
    @ResponseBody
    public String uploadExcel(HttpServletRequest request) throws Exception {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        MultipartFile file = multipartRequest.getFile("filename");
        if (file.isEmpty()) {
            return "文件不能为空";
        }
        InputStream inputStream = file.getInputStream();
        List<List<Object>> list = getExcelContent(inputStream,file.getOriginalFilename());
        inputStream.close();

        for (int i = 0; i < list.size(); i++) {
            List<Object> lo = list.get(i);
            //TODO 随意发挥
            System.out.println(lo);

        }
        return "上传成功";
    }


    public List getExcelContent(InputStream in, String fileName)throws Exception{
        List list = new ArrayList<>();
        //创建Excel工作薄
        Workbook work = this.getWorkbook(in, fileName);
        if (null == work) {
            throw new Exception("创建Excel工作薄为空！");
        }
        Sheet sheet = null;
        Row row = null;
        Cell cell = null;

        for (int i = 0; i < work.getNumberOfSheets(); i++) {
            sheet = work.getSheetAt(i);
            if (sheet == null) {
                continue;
            }

            for (int j = sheet.getFirstRowNum(); j <= sheet.getLastRowNum(); j++) {
                row = sheet.getRow(j);
                if (row == null || row.getFirstCellNum() == j) {
                    continue;
                }

                List<Object> li = new ArrayList<>();
                for (int y = row.getFirstCellNum(); y < row.getLastCellNum(); y++) {
                    cell = row.getCell(y);
                    li.add(cell);
                }
                list.add(li);
            }
        }
        work.close();
        return list;
    }

    public Workbook getWorkbook(InputStream inStr, String fileName) throws Exception {
        Workbook workbook = null;
        String fileType = fileName.substring(fileName.lastIndexOf("."));
        if (".xls".equals(fileType)) {
            workbook = new HSSFWorkbook(inStr);
        } else if (".xlsx".equals(fileType)) {
            workbook = new XSSFWorkbook(inStr);
        } else {
            throw new Exception("请上传excel文件！");
        }
        return workbook;
    }

    @ApiOperation(value = "FG Full Part Number Lead Time Report", notes = "FG Full Part Number Lead Time Report")
    @RequestMapping(value = "/downloadSheetTemplate", method = RequestMethod.GET)
    public APIResponse<Object> downloadSheetTemplate(@RequestParam(value = "headNumber", required = false) String DesignResponsibility,
                                           HttpServletRequest request, HttpServletResponse response) {
        APIResponse<Object> apiResponse = new APIResponse<>();
        try {
            InputStream input = NpiMpLtController.class.getClassLoader()
                    .getResourceAsStream(Constants.NPIMPLT_PATH);
            Workbook workbook = new XSSFWorkbook(input);
            Sheet sheet = workbook.getSheetAt(0);
            //add table title
            LOGGER.debug("npimplt getTableTitle begin=====");

            int colNum = 0;
            int rowNum = 0;
            Row row = sheet.createRow(rowNum++);

            CellStyle style = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            style.setFont(font);
            //row.setRowStyle(style);
            Cell cell1 = row.createCell(colNum++);
            cell1.setCellValue("Item Code");
            cell1.setCellStyle(style);
            Cell cell2 = row.createCell(colNum++);
            cell2.setCellValue("Material");
            cell2.setCellStyle(style);
            Cell cell3 = row.createCell(colNum++);
            cell3.setCellValue("qualify status");
            cell3.setCellStyle(style);

            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(Constants.TAG_EOF);

            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + Constants.SALESMODELMATRIX_REPORT);
            OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
            workbook.write(outputStream);
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return apiResponse;
    }


}
