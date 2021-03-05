package com.lenovo.mbg.portal.integration.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.lenovo.mbg.portal.accesslog.service.AccessLogService;
import com.lenovo.mbg.portal.integration.dao.WCEBOMLatestMapper;
import com.lenovo.mbg.portal.integration.dao.WCMBOMLatestMapper;
import com.lenovo.mbg.portal.integration.model.SaleModelMatrixTableInfo;
import com.lenovo.mbg.portal.integration.model.WCMBOMLatest;
import com.lenovo.mbg.portal.integration.model.WCMBOMLatestExample;
import com.lenovo.mbg.portal.integration.service.SalesModelMatrixReportService;
import com.lenovo.mbg.portal.security.model.User;
import com.lenovo.mbg.portal.security.service.UserService;
import com.lenovo.mbg.util.APIResponse;
import com.lenovo.mbg.util.Constants;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

        HashMap<String, List<String>> materialHeadNumberMap = new HashMap<>();
        HashMap<String, String> qualifyStatusMaterilMap = new HashMap<>();
        HashMap<String, Double> usageMaterialMap = new HashMap<>();
        HashMap<String, String> initalMaterialMap = new HashMap<>();
        HashMap<String, String> nplLtMap = new HashMap<>();
        HashMap<String, String> mpLtMap = new HashMap<>();


        WCMBOMLatestExample example = new WCMBOMLatestExample();
        WCMBOMLatestExample.Criteria c = example.createCriteria();
        c.andHeaderNumberIn(Arrays.asList(dr));
        List<WCMBOMLatest> wcmbomLatests = wcMBOMLatestMapper.selectByExample(example);

        Map<String, List<WCMBOMLatest>> wcmbomLatestsMap = wcmbomLatests.stream().collect(Collectors.groupingBy(WCMBOMLatest::getHeaderNumber, Collectors.toList()));
        wcmbomLatestsMap.entrySet().stream().forEach(map->{
            materialHeadNumberMap.put(map.getKey(),map.getValue().stream().map(WCMBOMLatest::getHeaderNumber).distinct().collect(Collectors.toList()));
        });
        // usageMaterialMap  hearNumber # material  value:list
        Map<String, String> usageMap = wcmbomLatests.stream().collect(Collectors.toMap(key -> key.getHeaderNumber() + "#" + key.getComponentItemNumber(), value -> value.getComponentQuantity(), (v1, v2) -> v1));
        usageMap.entrySet().stream().forEach(map->{
            String componentNumber = map.getKey().split("#")[1];
            // 检查是否有子项
            example.clear();
            c.andHeaderNumberEqualTo(componentNumber);
            List<WCMBOMLatest> checkHasChildList = wcMBOMLatestMapper.selectByExample(example);
            if(!checkHasChildList.isEmpty()){
                double sum = checkHasChildList.stream().mapToDouble(bean -> Integer.parseInt(bean.getComponentQuantity())).sum();
                Double oldUsage = usageMaterialMap.getOrDefault(map.getKey(), 0.0);
                usageMaterialMap.put(map.getKey(), oldUsage + sum);

            }

        });





        try {
            InputStream input = MBOMImpStatusReportController.class.getClassLoader()
                    .getResourceAsStream(Constants.NPIMPLT_PATH);
            Workbook workbook = new XSSFWorkbook(input);
            Sheet sheet = workbook.getSheetAt(0);
            //add table title
            LOGGER.debug("npimplt getTableTitle begin=====");


//			List<String> salesModelNumber = salesModelMatrixReportService.getSalesModelNumberByDR(dr);
//			SaleModelMatrixTableInfo sminfo = salesModelMatrixReportService.getTableTitle(salesModelNumber);

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
                ArrayList<String> emptyList = Lists.newArrayList();
                List<String> materialsList = materialHeadNumberMap.getOrDefault(headeNumberEle, emptyList);
                for (String material : materialsList) {
                    row = sheet.createRow(rowNum++);
                    int i = 0;
                    row.createCell(i).setCellValue(headeNumberEle);// headeNumber/Item Code
                    row.createCell(i).setCellValue(material);//Material
                    row.createCell(i).setCellValue(qualifyStatusMaterilMap.getOrDefault(material, ""));//qualify status
                    row.createCell(i).setCellValue(usageMaterialMap.getOrDefault(material, ""));//qualify status
                    row.createCell(i).setCellValue(initalMaterialMap.getOrDefault(material, ""));//usage
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
    public void checkHasChildItemAndAddUsage(String componentNumber,Map<String, Double> usageMaterialMap){

    }
}
