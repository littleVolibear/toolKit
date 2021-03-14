package com.lenovo.mbg.portal.integration.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.lenovo.mbg.portal.accesslog.service.AccessLogService;
import com.lenovo.mbg.portal.integration.dao.*;
import com.lenovo.mbg.portal.integration.model.*;
import com.lenovo.mbg.portal.integration.service.SalesModelMatrixReportService;
import com.lenovo.mbg.portal.security.model.User;
import com.lenovo.mbg.portal.security.service.UserService;
import com.lenovo.mbg.util.APIResponse;
import com.lenovo.mbg.util.Constants;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.security.Principal;
import java.text.DecimalFormat;
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
    @Autowired
    private NpiMpLtMapper npiMpLtMapper;
    @Autowired
    private MyWCMBOMLatestMapper myWCMBOMLatestMapper;

    @ApiOperation(value = "FG Full Part Number Lead Time Report", notes = "FG Full Part Number Lead Time Report")
    @RequestMapping(value = "/download", method = RequestMethod.GET)
    public APIResponse<Object> downloadSMM(@RequestParam(value = "headNumber", required = false) String headNumber,
                                           HttpServletRequest request, HttpServletResponse response) {
        APIResponse<Object> apiResponse = new APIResponse<>();
        System.out.println("request param:============" + headNumber);
        LOGGER.debug("NpiMpLtController Begin to download===" + headNumber + "*^^*");
        String[] dr = headNumber.split(",");
        for (int i = 0; i < dr.length; i++) {
            LOGGER.debug(i + "DR" + dr[i]);
            LOGGER.info(i + "DR" + dr[i]);
        }

        // 第一部分: start materialHeadNumberMap组装
        HashMap<String, List<String>> materialHeadNumberMap = new HashMap<>();//1.headerNumber : materialList
        WCMBOMLatestExample example = new WCMBOMLatestExample();
        WCMBOMLatestExample.Criteria c = example.createCriteria();
        c.andHeaderNumberIn(Arrays.asList(dr));
        List<WCMBOMLatest> queryList = wcMBOMLatestMapper.selectByExample(example);
        Map<String, List<WCMBOMLatest>> wcmbomLatestsMap = queryList.stream().collect(Collectors.groupingBy(WCMBOMLatest::getHeaderNumber, Collectors.toList()));
        wcmbomLatestsMap.entrySet().stream().forEach(map -> {
            // 1. headerNumber : materialList
            materialHeadNumberMap.put(map.getKey(), map.getValue().stream().map(WCMBOMLatest::getComponentItemNumber).distinct().collect(Collectors.toList()));
        });
        // 第一部分: end materialHeadNumberMap组装

        // 组装联合Key  hearNumber#material  quantity/usage
//        Map<String, String> commonKeyMap = queryList.stream().collect(Collectors.toMap(key -> key.getHeaderNumber() + "#" + key.getComponentItemNumber(), value -> value.getComponentQuantity(), (v1, v2) -> v1));
        // 第二部分: start headerNumber:status      qualifyStatusMaterilMap
        List<String> queryMaterialList = queryList.stream().map(WCMBOMLatest::getComponentItemNumber).collect(Collectors.toList());
        WCItemLatestExample wcItemLatestExample = new WCItemLatestExample();
        WCItemLatestExample.Criteria cItem = wcItemLatestExample.createCriteria();
        cItem.andItemNumberIn(queryMaterialList);
        List<WCItemLatest> materialStatusList = wcItemLatestMapper.selectByExample(wcItemLatestExample);
        Map<String, String> qualifyStatusMaterilMap = materialStatusList.stream().collect(Collectors.toMap(key -> key.getItemNumber(), value -> value.getItemStatus(), (v1, v2) -> v2));
        // 第二部分 status 组装完毕

        // 第三部分: start headerNumber quantitySum
        HashMap<String, Double> usageMap = new HashMap<>();// 3. headerNumber quantitySum
        example.clear();
//        List<WCMBOMLatest> allList = wcMBOMLatestMapper.selectByExample(example);
        List<WCMBOMLatest> allList = myWCMBOMLatestMapper.selectAll();

        for (WCMBOMLatest wcmbomLatest : queryList) {
            ArrayList<Double> quantityList = Lists.newArrayList();
            getChild(wcmbomLatest, allList, quantityList);
            double sum = quantityList.stream().mapToDouble(ele -> ele).sum();
            // 3. headerNumber quantitySum
            usageMap.put(wcmbomLatest.getHeaderNumber(), sum);
        }
        // 第三部分: end headerNumber quantitySum

        // 第四部分:start Planned_Delivery_Time
        HashMap<String, String> initalMaterialMap = new HashMap<>();
        WCMEPExample wcmepExample = new WCMEPExample();
        WCMEPExample.Criteria mepC = wcmepExample.createCriteria();
        mepC.andItemNumberIn(queryMaterialList);
        List<WCMEP> mepList = wcmepMapper.selectByExample(wcmepExample);
        Map<String, List<WCMEP>> deliveryTimeMap = mepList.stream().collect(Collectors.groupingBy(bean -> bean.getItemNumber()));
        deliveryTimeMap.entrySet().stream().forEach(map -> {
            List<Double> list2 = map.getValue().stream().filter(bean->StringUtils.isNotBlank(bean.getPlannedDeliveryTime())).map(bean -> Double.parseDouble(bean.getPlannedDeliveryTime())).collect(Collectors.toList());
            Double maxValue = list2.stream().max((o1, o2) -> o1.compareTo(o2)).get();
            initalMaterialMap.put(map.getKey(), String.valueOf(maxValue));
        });
        // 第四部分: end Planned_Delivery_Time

        // 第五部分: NPI LT / MP LTQ
        NpiMpLtExample npiMpLtExample = new NpiMpLtExample();
        NpiMpLtExample.Criteria c_npi = npiMpLtExample.createCriteria();
        c_npi.andMaterialIn(queryMaterialList);
        List<NpiMpLt> npiMpLtList = npiMpLtMapper.selectByExample(npiMpLtExample);
        Map<String, String> npiLtMap = npiMpLtList.stream().collect(Collectors.toMap(key -> key.getMaterial(), value -> value.getNpiLt(), (v1, v2) -> v2));
        Map<String, String> mpLtMap = npiMpLtList.stream().collect(Collectors.toMap(key -> key.getMaterial(), value -> value.getMpLt(), (v1, v2) -> v2));
        // 第五部分： 获取两个字段结束

        try {
            InputStream input = NpiMpLtController.class.getClassLoader()
                    .getResourceAsStream(Constants.NPIMPLT_PATH);
            Workbook workbook = new XSSFWorkbook(input);
            Sheet sheet = workbook.getSheetAt(0);
            //add table title
            LOGGER.info("npimplt getTableTitle begin=====");

            int colNum = 0;
            int rowNum = 0;
            Row row = sheet.createRow(rowNum++);

            CellStyle style = workbook.createCellStyle();
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            style.setFillForegroundColor(HSSFColorPredefined.GREEN.getIndex());
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

            for(Map.Entry<String,List<String>> map :materialHeadNumberMap.entrySet()){
                String headNumberKey = map.getKey();
                for(String material: map.getValue()){
                    int colNum1 = 0;
                    Row row1 = sheet.createRow(rowNum++);
                    Cell cell11 = row1.createCell(colNum1++);
                    cell11.setCellValue(headNumberKey);// item code
                    Cell cell22 = row1.createCell(colNum1++);
                    cell22.setCellValue(material);// material
                    Cell cell33 = row1.createCell(colNum1++);
                    cell33.setCellValue(qualifyStatusMaterilMap.getOrDefault(material, ""));// qualify status
                    Cell cell44 = row1.createCell(colNum1++);
                    cell44.setCellValue(usageMap.get(headNumberKey));// usage
                    Cell cell55 = row1.createCell(colNum1++);
                    cell55.setCellValue(initalMaterialMap.getOrDefault(material, ""));// initial lt
                    Cell cell66 = row1.createCell(colNum1++);
                    cell66.setCellValue(npiLtMap.getOrDefault(material, ""));//npi lt
                    Cell cell77 = row1.createCell(colNum1++);
                    cell77.setCellValue(mpLtMap.getOrDefault(material, ""));// mp lt
                }
            }
            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + Constants.NPIMPLT_FULL_REPORT);
            OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
            workbook.write(outputStream);
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            e.printStackTrace(new PrintStream(baos));
            LOGGER.error(baos);
            LOGGER.error("npiMpLt catch:",e);
        }
        return apiResponse;
    }
    // 获取每个HeaderNumber 对应的ComponentQuantity 总和
    public  void getChild(WCMBOMLatest root, List<WCMBOMLatest> allList, List<Double> quantityList) {
        ArrayList<WCMBOMLatest> childList = Lists.newArrayList();
        quantityList.add(Double.parseDouble(root.getComponentQuantity()));
        for (WCMBOMLatest bom : allList) {
            System.out.println("material:======" + bom.getComponentItemNumber());
            if (StringUtils.isNoneBlank(bom.getComponentItemNumber())&&bom.getComponentItemNumber().equals(root.getHeaderNumber())) {
                WCMBOMLatestExample example = new WCMBOMLatestExample();
                WCMBOMLatestExample.Criteria c = example.createCriteria();
                c.andHeaderNumberEqualTo(root.getHeaderNumber());// headNumber
                List<WCMBOMLatest> list = wcMBOMLatestMapper.selectByExample(example);
                // 获取每个headerNumber-所有的版本集合
                List<String> eachHeaderAllVersionList = list.stream().map(WCMBOMLatest::getItemVersion).collect(Collectors.toList());
                if(!CollectionUtils.isEmpty(eachHeaderAllVersionList)){
                    // 获取每个hader的最大/最新版本
                    String maxVersion = getMaxValue(eachHeaderAllVersionList);
                    if(maxVersion.equals(bom.getComponentVersion())){
                        childList.add(bom);
                        quantityList.add(Double.parseDouble(bom.getComponentQuantity()));
                    }
                }
            }
        }
        if (childList.isEmpty()) {
            return;
        }
        for (WCMBOMLatest b : childList) {
            getChild(b, allList, quantityList);
        }
    }


    @PostMapping(value = "/upload")
    @ResponseBody
    public String uploadExcel(HttpServletRequest request,@RequestParam(value = "file", required = false) MultipartFile file) throws Exception {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        if (file.isEmpty()) {
            return "file not empty";
        }
        InputStream inputStream = file.getInputStream();
        List<List<Object>> list = getExcelContent(inputStream, file.getOriginalFilename());
        inputStream.close();
        for (int i = 0; i < list.size(); i++) {
            List<Object> lo = list.get(i);
            List<String> result = new ArrayList<>();
            if (lo instanceof ArrayList<?>) {
                for (Object o : (List<?>) lo) {
                    result.add(String.class.cast(o));
                }
            }
            NpiMpLt npiMpLt = new NpiMpLt();
            npiMpLt.setMaterial(result.get(0));
            npiMpLt.setNpiLt(result.get(1));
            npiMpLt.setMpLt(result.get(2));
            npiMpLtMapper.insert(npiMpLt);
        }
        return "{\"result\":\"上传成功\"}";
    }


    public List getExcelContent(InputStream in, String fileName) throws Exception {
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
                    li.add(getStringValueFromCell(cell));
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
    public APIResponse<Object> downloadSheetTemplate(HttpServletRequest request, HttpServletResponse response) {
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

            Cell cell1 = row.createCell(colNum++);
            cell1.setCellValue("Material");
            Cell cell2 = row.createCell(colNum++);
            cell2.setCellValue("NPI LT");
            Cell cell3 = row.createCell(colNum++);
            cell3.setCellValue("MP LT");

            response.reset();
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/vnd.ms-excel;charset=utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + Constants.NPIMPLT_REPORT);
            OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
            workbook.write(outputStream);
            outputStream.flush();
            outputStream.close();
        } catch (IOException e) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            e.printStackTrace(new PrintStream(baos));
            LOGGER.error(baos);
            LOGGER.error("npiMpLt catch2:",e);
        }
        return apiResponse;
    }


    public  String getStringValueFromCell(Cell cell) {
        SimpleDateFormat sFormat = new SimpleDateFormat("MM/dd/yyyy");
        DecimalFormat decimalFormat = new DecimalFormat("#.#");
        String cellValue = "";
        if(cell == null) {
            return cellValue;
        }
        else if(cell.getCellType() == Cell.CELL_TYPE_STRING) {
            cellValue = cell.getStringCellValue();
        }

        else if(cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC) {
            if(HSSFDateUtil.isCellDateFormatted(cell)) {
                double d = cell.getNumericCellValue();
                Date date = HSSFDateUtil.getJavaDate(d);
                cellValue = sFormat.format(date);
            }
            else {
                cellValue = decimalFormat.format((cell.getNumericCellValue()));
            }
        }
        else if(cell.getCellType() == Cell.CELL_TYPE_BLANK) {
            cellValue = "";
        }
        else if(cell.getCellType() == Cell.CELL_TYPE_BOOLEAN) {
            cellValue = String.valueOf(cell.getBooleanCellValue());
        }
        else if(cell.getCellType() == Cell.CELL_TYPE_ERROR) {
            cellValue = "";
        }
        else if(cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
            cellValue = cell.getCellFormula().toString();
        }
        return cellValue;
    }


    public String  getMaxValue(List<String> allList){
        ArrayList<String> firstXList = Lists.newArrayList();
        ArrayList<String> WordList = Lists.newArrayList();

        // 存储首字母集合
        allList.stream().forEach(x -> {
            String substring = x.substring(0, 1);
            firstXList.add(substring);
        });
        // 排序首字母集合
        firstXList.sort(String.CASE_INSENSITIVE_ORDER);

        String maxValue = firstXList.get(firstXList.size() - 1);
        //["D.3 (LC)","D.2 (LC)"]
        List<String> worthList = allList.stream().filter(x -> x.contains(maxValue)).collect(Collectors.toList());
        worthList.stream().forEach(x->{
            //D.3  D.2
            WordList.add(x.split("\\(")[0].trim());
        });
//        WordList.stream().forEach(System.out::println);
        String s = WordList.stream().max((o1, o2) -> o1.substring(o1.length()-1).compareTo(o2.substring(o1.length()-1))).get();
//		System.out.println("maxvalue:=====" + s);

        List<String> maxList = allList.stream().filter(x -> x.contains(s)).distinct().collect(Collectors.toList());
        if(CollectionUtils.isEmpty(maxList)){
            return "";
        }else{
            return maxList.get(0);
        }
    }




}
