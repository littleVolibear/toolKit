package com.lenovo.mbg.portal.integration.controller;

import java.awt.Color;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovo.mbg.portal.accesslog.service.AccessLogService;
import com.lenovo.mbg.portal.integration.model.SaleModelMatrixTableInfo;
import com.lenovo.mbg.portal.integration.service.SalesModelMatrixReportService;
import com.lenovo.mbg.portal.security.model.User;
import com.lenovo.mbg.portal.security.service.UserService;
import com.lenovo.mbg.util.APIResponse;
import com.lenovo.mbg.util.Constants;

import io.swagger.annotations.ApiOperation;


@RestController
@RequestMapping(value = "/saleModelMatrixModel")
public class SalesModelMatrixReportController {

    private static final Logger LOGGER = Logger.getLogger(SalesModelMatrixReportController.class.getName());

    @Autowired
    private SalesModelMatrixReportService salesModelMatrixReportService;

    @Autowired
    private UserService userService;

    @Autowired
    private AccessLogService accessLogService;

    @ApiOperation(value = "SalesModel Matrix Report", notes = "SalesModel Matrix Report")
    @RequestMapping(value = "/querydrlist", method = RequestMethod.GET)
    public APIResponse<List<String>> doDRList() {
        LOGGER.debug("Begin  doDRList=========");
        APIResponse<List<String>> apiResponse = new APIResponse<>();
        List<String> list = salesModelMatrixReportService.getDRList();
        try {
            apiResponse.setData(list);
        } catch (Exception e) {
            apiResponse.setMessage("Cannot query salesmodel by condition!");
            apiResponse.setStatus(Constants.CODE_ERROR);
        }
        return apiResponse;

    }


    @ApiOperation(value = "SalesModel Matrix Report", notes = "SalesModel Matrix Report")
    @RequestMapping(value = "/querysalesmodelbydr", method = RequestMethod.GET)
    public APIResponse<Map<String, List>> doQuerySM(String DesignResponsibility, Principal principal
    ) {
        LOGGER.debug("Begin SalesModelMatrixReportController doQuerySM=========" + DesignResponsibility);
        String[] dr = DesignResponsibility.split(";;;QQQ");
        for (int i = 0; i < dr.length; i++) {
            LOGGER.debug(i + "DR" + dr[i]);
        }
        APIResponse<Map<String, List>> apiResponse = new APIResponse<>();

        try {
            String[] drss = dr;//{"Teller AP DS XT1926-5 PAAT"};//{"SHELBY EMEA/APAC DS - QOA - XT1929-8"};//////,"Ashley NA ATT and RoNA XT1922-9 PAA3","Rugby NA SPR (8920 CA) XT1921-5 PABW"};
            Map<String, List> map = new HashMap<String, List>();
            List<String> salesModelNumber = salesModelMatrixReportService.getSalesModelNumberByDR(drss);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置时间显示格式

            List<SaleModelMatrixTableInfo> list = new ArrayList<SaleModelMatrixTableInfo>();
            //add table title
            LOGGER.debug("getTableTitle begin=====" + sdf.format(new Date()));
            list.add(salesModelMatrixReportService.getTableTitle(salesModelNumber));
            map.put("title", list);
            LOGGER.debug("getSalesModelTableListTopAttr begin=====" + sdf.format(new Date()));
//			//add chird info
            List<String> allchildparts = salesModelMatrixReportService.getAllChildParts2(salesModelNumber);
            //add sm top attribute
            List<LinkedHashMap<String, String>> listforsmtopattr = salesModelMatrixReportService.getSalesModelTableListTopAttr3(salesModelNumber, allchildparts);
//			List<SaleModelMatrixTableInfo> listtopattr = salesModelMatrixReportService.getSalesModelTableListTopAttr(salesModelNumber);
//			for(SaleModelMatrixTableInfo attr : listtopattr) {
//				list.add(attr);
//			}

            LOGGER.debug("getAllChildParts begin=====" + sdf.format(new Date()));
            //get childinfo
//			List<SaleModelMatrixTableInfo> listtochild = salesModelMatrixReportService.getChildPartInfoall(allchildparts,salesModelNumber);
            List<LinkedHashMap<String, String>> listtochild = salesModelMatrixReportService.getChildPartInfoall3(allchildparts, salesModelNumber);
//			for(SaleModelMatrixTableInfo attr : listtochild) {
//				list.add(attr);
//			}
            if (listtochild != null) {
                listforsmtopattr.addAll(listtochild);
            }

            LOGGER.debug("getSalesModelTableListBotAttr begin=====" + sdf.format(new Date()));
//			//add sm add attr
//			List<SaleModelMatrixTableInfo> listbotattr = salesModelMatrixReportService.getSalesModelTableListBotAttr(salesModelNumber);
            List<LinkedHashMap<String, String>> listbotattr = salesModelMatrixReportService.getSalesModelTableListBotAttr2(salesModelNumber);
//			for(SaleModelMatrixTableInfo attr : listbotattr) {
//				list.add(attr);
//			}
            if (listbotattr != null) {
                listforsmtopattr.addAll(listbotattr);
            }
            map.put("data", listforsmtopattr);

            LOGGER.debug("endend=====" + sdf.format(new Date()));
            apiResponse.setData(map);

            //add for LOGGER
            LOGGER.debug("principal.getName():::::::::::::" + principal.getName());
            String itCode = principal.getName();
            User user = userService.selectByName(itCode);
            accessLogService.logChange(AccessLogService.ACTIONTYPE_REPORT,
                    AccessLogService.ACTIONTYPE_MASTER_OBJECT_TYPE_USER, user.getId(),
                    AccessLogService.ACTIONTYPE_REPORT_SALESMODELMATRIX, user.getId(), "Query SalesModel Matrix Report : DesignResponsibility=" + DesignResponsibility + ",  itCode=" + itCode);

        } catch (Exception e) {
            apiResponse.setMessage("Cannot query salesmodel by condition!");
            apiResponse.setStatus(Constants.CODE_ERROR);
        }
        return apiResponse;

    }

    @ApiOperation(value = "SalesModel Matrix Report", notes = "SalesModel Matrix Report")
    @RequestMapping(value = "/download", method = RequestMethod.GET)
//	@PostMapping
    public APIResponse<Object> downloadSMM(@RequestParam(value = "DesignResponsibility", required = false) String DesignResponsibility,
                                           HttpServletRequest request, HttpServletResponse response) {
        APIResponse<Object> apiResponse = new APIResponse<>();
        LOGGER.debug("Begin to download===" + DesignResponsibility + "*^^*");
        String[] dr = DesignResponsibility.split(";;;QQQ");
        for (int i = 0; i < dr.length; i++) {
            LOGGER.debug(i + "DR" + dr[i]);
        }
        //String[] dr = {"Teller AP DS XT1926-5 PAAT"};
        try {
            InputStream input = MBOMImpStatusReportController.class.getClassLoader()
                    .getResourceAsStream(Constants.SALESMODELMATRIX_PATH);
            Workbook workbook = new XSSFWorkbook(input);

            Sheet sheet = workbook.getSheetAt(0);


            //add table title
            LOGGER.debug("getTableTitle begin=====");
            List<String> salesModelNumber = salesModelMatrixReportService.getSalesModelNumberByDR(dr);
            SaleModelMatrixTableInfo sminfo = salesModelMatrixReportService.getTableTitle(salesModelNumber);

            int colNum = 0;
            int rowNum = 0;
            Row row = sheet.createRow(rowNum++);

            if (sminfo != null) {
                LOGGER.debug("set title======" + sminfo);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                //row.setRowStyle(style);
                Cell cell1 = row.createCell(colNum++);
                cell1.setCellValue(sminfo.gettype());
                cell1.setCellStyle(style);
                Cell cell2 = row.createCell(colNum++);
                cell2.setCellValue(sminfo.getinfo());
                cell2.setCellStyle(style);
                Cell cell3 = row.createCell(colNum++);
                cell3.setCellValue(sminfo.getcompgroupinginfo());
                cell3.setCellStyle(style);
                Cell cell4 = row.createCell(colNum++);
                cell4.setCellValue(sminfo.getsubstitute());
                cell4.setCellStyle(style);
                List<String> sms = sminfo.getsalesmodel();
                for (String asm : sms) {
                    Cell cell5 = row.createCell(colNum++);
                    cell5.setCellValue(asm);
                    cell5.setCellStyle(style);
                }
            }
            List<String> allchildparts = salesModelMatrixReportService.getAllChildParts2(salesModelNumber);
            List<LinkedHashMap<String, String>> listforsmtopattr = salesModelMatrixReportService.getSalesModelTableListTopAttr3(salesModelNumber, allchildparts);
            if (listforsmtopattr != null) {
                LOGGER.debug("listforsmtopattr====" + listforsmtopattr.size());
                for (LinkedHashMap<String, String> amap : listforsmtopattr) {
                    LOGGER.debug("set listforsmtopattr row Num======" + rowNum);
                    row = sheet.createRow(rowNum++);
                    int i = 0;
                    for (String key : amap.keySet()) {
                        if (key.equals("typeGroup") || key.equals("itemState") || key.equals("iteminfo")) {
                            continue;
                        }
                        row.createCell(i++).setCellValue(amap.get(key));
                    }
                }
            }
            List<LinkedHashMap<String, String>> listtochild = salesModelMatrixReportService.getChildPartInfoall3(allchildparts, salesModelNumber);
            if (listtochild != null) {
                LOGGER.debug("listtochild====" + listtochild.size());
                for (LinkedHashMap<String, String> amap : listtochild) {
                    LOGGER.debug("set listtochild row Num======" + rowNum);
                    row = sheet.createRow(rowNum++);
                    int i = 0;
                    CellStyle styleforchild = workbook.createCellStyle();
                    styleforchild.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                    //set yellow format for item status = 12
                    if (amap.containsKey("itemState") && "12".equals(amap.get("itemState"))) {
                        LOGGER.debug("itemState==== yellow forground");
                        styleforchild.setFillForegroundColor(HSSFColorPredefined.YELLOW.getIndex());
                    }
                    if (amap.containsKey("itemState") && "32".equals(amap.get("itemState"))) {
                        LOGGER.debug("itemState==== LIGHT_GREEN forground");
                        styleforchild.setFillForegroundColor(HSSFColorPredefined.LIGHT_GREEN.getIndex());

                    }
                    if (amap.containsKey("itemState") && "35".equals(amap.get("itemState"))) {
                        LOGGER.debug("itemState==== GREEN forground");
                        styleforchild.setFillForegroundColor(HSSFColorPredefined.GREEN.getIndex());
                    }
                    for (String key : amap.keySet()) {
                        if (key.equals("typeGroup") || key.equals("itemState") || key.equals("iteminfo")) {
                            continue;
                        }
                        Cell cell = row.createCell(i++);
                        cell.setCellValue(amap.get(key));
                        if ("x".equals(amap.get(key))) {
                            LOGGER.debug("xxx==== set color");
                            cell.setCellStyle(styleforchild);
                        }
                    }
                }
            }
            List<LinkedHashMap<String, String>> listbotattr = salesModelMatrixReportService.getSalesModelTableListBotAttr2(salesModelNumber);
            if (listbotattr != null) {
                LOGGER.debug("listbotattr====" + listbotattr.size());
                for (LinkedHashMap<String, String> amap : listbotattr) {
                    LOGGER.debug("set listbotattr row Num======" + rowNum);
                    row = sheet.createRow(rowNum++);
                    int i = 0;
                    for (String key : amap.keySet()) {
                        if (key.equals("typeGroup") || key.equals("itemState") || key.equals("iteminfo")) {
                            continue;
                        }
                        row.createCell(i++).setCellValue(amap.get(key));
                    }
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


    public static void main(String[] args) {
        Aa a1 = new Aa("aa", "1", "A.2 (LC)");
        Aa a2 = new Aa("aa", "1", "A.3 (LC)");
        Aa a3 = new Aa("aa", "1", "A.1 (LC)");
        Aa a4 = new Aa("bb", "1", "A.1 (LC)");
        Aa a5 = new Aa("bb", "1", "A.5 (LC)");

        ArrayList<Aa> list = Lists.newArrayList(a1, a2, a3, a4, a5);
        Map<String, List<Aa>> mapResult = list.stream().collect(Collectors.groupingBy(Aa::getName));
        mapResult.entrySet().stream().forEach(map -> {
            String nameKey = map.getKey();
//			List<Aa> value = map.getValue();
            List<String> sameNameVersionList = map.getValue().stream().map(Aa::getVersion).collect(Collectors.toList());
            sameNameVersionList.stream().filter(x -> StringUtils.isNotBlank(x));
//			map.getValue()

        });

        ArrayList<String> allList = Lists.newArrayList();
        allList.add("A.2 (LC)");
        allList.add("A.3 (LC)");
        allList.add("A.1 (LC)");
        allList.add("B.1 (LC)");
        allList.add("B.3 (LC)");
        allList.add("D.3 (LC)");
        allList.add("B.3 (LC)");
        allList.add("D.2 (LC)");
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
        System.out.println("maxvalue:=====" + s);

        List<String> collect = allList.stream().filter(x -> x.contains(s)).collect(Collectors.toList());
        System.out.println(JSON.toJSON(collect));


//
//        ArrayList<Integer> integers = Lists.newArrayList(1, 5, 6, 4);
//        Integer integer = integers.stream().max((o1, o2) -> o1.compareTo(o2)).get();
//        System.out.println("111:===" + integer);

    }
}
