package com.exavalu.backend.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class BulkQuoteServiceImpl implements BulkQuoteService{
    private static final Logger logger = LogManager.getLogger(BulkQuoteServiceImpl.class);
    @Value("${bulkQuoteExcelPath}")
    String bulkQuoteExcelPath;
    @Override
    public List<Map<String, String>> parseExcelToJson() {
        logger.info("Entering BulkQuoteServiceImpl parseExcelToJson method");
        List<Map<String, String>> result = new ArrayList<>();
        try {
            File fileNew = new File(bulkQuoteExcelPath);
            FileInputStream fis = new FileInputStream(fileNew);
            XSSFWorkbook wb = new XSSFWorkbook(fis);
            XSSFSheet sheet = wb.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }
            int rowIndex = 0;
            while (rowIterator.hasNext()) {
                Row dataRow = rowIterator.next();
                Map<String, String> rowData = new LinkedHashMap<>();
                rowData.put("key", String.valueOf(rowIndex++));
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = dataRow.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    rowData.put(headers.get(i), getCellValueAsString(cell));
                }
                logger.info("Exiting BulkQuoteServiceImpl parseExcelToJson method");
                result.add(rowData);
            }
        }catch(IOException e){
            throw new RuntimeException("Error parsing Excel file: " + e.getMessage(), e);
        }
        return result;
    }

    private String getCellValueAsString(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("MMM-dd-yyyy");
                    return dateFormat.format(cell.getDateCellValue());
                } else {
                    return String.valueOf((int)cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}
