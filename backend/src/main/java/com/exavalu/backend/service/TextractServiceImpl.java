package com.exavalu.backend.service;

import com.exavalu.backend.exceptions.FileStorageException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.textract.TextractClient;
import software.amazon.awssdk.services.textract.model.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

@Service
public class TextractServiceImpl implements TextractService {


    static Logger logger = LogManager.getLogger(TextractServiceImpl.class);
    Gson gson = new GsonBuilder().create();

    @Value("${awsRegion}")
    String awsRegion;

    @Value("${destinationDir}")
    String destinationDir;

    @Override
    public List<Map<String, Object>> uploadPdf(MultipartFile[] files) {
        logger.debug("Entering TextractServiceImpl uploadPdf method, with MultipartFile[] = " + Arrays.toString(files));

        List<Map<String, Object>> allPagesData = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                logger.info("Processing file: {}", file.getOriginalFilename());
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                byte[] fileContent = file.getBytes();
                File tempFile = File.createTempFile(destinationDir + fileName, "");

                try (OutputStream os = new FileOutputStream(tempFile)) {
                    os.write(fileContent);
                }

                PDDocument document = PDDocument.load(tempFile);
                PDFRenderer pdfRenderer = new PDFRenderer(document);

                for (int page = 0; page < document.getNumberOfPages(); ++page) {
                    long startTime = System.currentTimeMillis();

                    File outputFile = File.createTempFile(destinationDir + fileName + "_" + (page + 1), ".png");
                    BufferedImage bim = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
                    ImageIO.write(bim, "png", outputFile);

                    try (InputStream inputStream = new FileInputStream(outputFile)) {
                        SdkBytes imageBytes = SdkBytes.fromInputStream(inputStream);
                        Document doc = Document.builder().bytes(imageBytes).build();

                        TextractClient textractClient = TextractClient.builder().region(Region.of(awsRegion)).build();

                        AnalyzeDocumentRequest request = AnalyzeDocumentRequest.builder().featureTypes(Arrays.asList(FeatureType.FORMS, FeatureType.TABLES)).document(doc).build();

                        AnalyzeDocumentResponse response = textractClient.analyzeDocument(request);
                        List<Block> blocks = response.blocks();

                        logger.debug("Blocks received from Textract: " + gson.toJson(blocks));


                        Map<String, List<String>> keyValuePairs = processFormFields(blocks);


                        List<List<String>> tableData = extractTableData(blocks);


                        List<Map<String, String>> tableKeyValues = new ArrayList<>();
                        for (List<String> table : tableData) {
                            tableKeyValues.add(extractKeyValuesFromTable(Collections.singletonList(table)));
                        }


                        Map<String, String> fallbackKeyValues = fallbackKeyValueExtraction(blocks);


                        Map<String, Object> pageData = new LinkedHashMap<>();
                        pageData.put("keyValuePairs", keyValuePairs);
                        pageData.put("tableKeyValues", tableKeyValues);
                        pageData.put("tables", tableData);
                        pageData.put("fallbackKeyValues", fallbackKeyValues);

                        allPagesData.add(pageData);

                        textractClient.close();
                        outputFile.delete();
                    }

                    logger.info("Processed page {} in {}ms", page + 1, (System.currentTimeMillis() - startTime));
                }

                document.close();
                tempFile.delete();
            }
        } catch (IOException ex) {
            logger.error("Error in TextractServiceImpl uploadPdf method: {}", ex.getMessage());
            throw new FileStorageException("Could not process the files. Please try again!", ex);
        }

        return allPagesData;
    }

    private Map<String, List<String>> processFormFields(List<Block> blocks) {

        Map<String, Block> blockMap = new LinkedHashMap<>();
        Map<String, Block> keyMap = new LinkedHashMap<>();
        Map<String, Block> valueMap = new LinkedHashMap<>();

        for (Block block : blocks) {
            blockMap.put(block.id(), block);
            if (block.blockTypeAsString().equals("KEY_VALUE_SET")) {
                for (EntityType entityType : block.entityTypes()) {
                    if (entityType.toString().equals("KEY")) {
                        keyMap.put(block.id(), block);
                    } else if (entityType.toString().equals("VALUE")) {
                        valueMap.put(block.id(), block);
                    }
                }
            }
        }

        return getRelationships(blockMap, keyMap, valueMap);
    }

    private static Map<String, List<String>> getRelationships(Map<String, Block> blockMap, Map<String, Block> keyMap, Map<String, Block> valueMap) {
        Map<String, List<String>> result = new LinkedHashMap<>();
        for (Map.Entry<String, Block> entry : keyMap.entrySet()) {
            Block valueBlock = findValue(entry.getValue(), valueMap);
            String key = getText(entry.getValue(), blockMap);
            String value = getText(valueBlock, blockMap);

            result.putIfAbsent(key, new ArrayList<>());
            result.get(key).add(value);
        }
        return result;
    }

    private static Block findValue(Block keyBlock, Map<String, Block> valueMap) {
        Block valueBlock = null;
        for (Relationship relationship : keyBlock.relationships()) {
            if (relationship.typeAsString().equals("VALUE")) {
                for (String id : relationship.ids()) {
                    valueBlock = valueMap.get(id);
                }
            }
        }
        return valueBlock;
    }

    private static String getText(Block block, Map<String, Block> blockMap) {
        if (block == null) return "";

        StringBuilder text = new StringBuilder();
        if (block.relationships() != null) {
            for (Relationship relationship : block.relationships()) {
                if (relationship.typeAsString().equals("CHILD")) {
                    for (String id : relationship.ids()) {
                        Block child = blockMap.get(id);
                        if (child.blockTypeAsString().equals("WORD")) {
                            text.append(child.text()).append(" ");
                        } else if (child.blockTypeAsString().equals("SELECTION_ELEMENT")) {
                            text.append(child.selectionStatusAsString().equals("SELECTED") ? "[✓] " : "[ ] ");
                        }
                    }
                }
            }
        }
        return text.toString().trim();
    }

    private static List<List<String>> extractTableData(List<Block> blocks) {
        Map<String, Block> blockMap = new LinkedHashMap<>();
        List<List<String>> tableData = new ArrayList<>();

        // First pass: build block map and identify table structure
        for (Block b : blocks) {
            blockMap.put(b.id(), b);
        }


        for (Block b : blocks) {
            if (b.blockTypeAsString().equals("TABLE")) {
                List<List<String>> currentTable = new ArrayList<>();
                Map<Integer, List<String>> rowMap = new TreeMap<>(); // Use TreeMap to maintain row order
                int maxRow = 0;


                for (Relationship relationship : b.relationships()) {
                    if (relationship.typeAsString().equals("CHILD")) {
                        for (String id : relationship.ids()) {
                            Block cell = blockMap.get(id);
                            if (cell != null && cell.blockTypeAsString().equals("CELL")) {
                                int rowIndex = cell.rowIndex();
                                maxRow = Math.max(maxRow, rowIndex);

                                // Get cell content
                                String cellContent = getText(cell, blockMap);

                                // Initialize row if it doesn't exist
                                rowMap.putIfAbsent(rowIndex, new ArrayList<>());

                                // Handle column spanning if needed
                                int columnIndex = cell.columnIndex();
                                while (rowMap.get(rowIndex).size() < columnIndex) {
                                    rowMap.get(rowIndex).add("");  // Fill gaps with empty strings
                                }

                                // Add cell content
                                rowMap.get(rowIndex).add(cellContent);
                            }
                        }
                    }
                }

                // Convert rowMap to list structure
                for (int i = 1; i <= maxRow; i++) {  // Start from 1 to skip header row
                    List<String> rowData = rowMap.get(i);
                    if (rowData != null && !isEmptyRow(rowData)) {
                        currentTable.add(rowData);
                    }
                }

                if (!currentTable.isEmpty()) {
                    tableData.addAll(currentTable);
                }
            }
        }
        return tableData;
    }

    private static boolean isEmptyRow(List<String> row) {
        return row.stream().allMatch(cell -> cell == null || cell.trim().isEmpty());
    }

    private static Map<String, String> extractKeyValuesFromTable(List<List<String>> table) {
        Map<String, String> keyValues = new LinkedHashMap<>();
        if (table.size() >= 2) {
            List<String> headers = new ArrayList<>();


            for (String header : table.get(0)) {
                headers.add(header.trim().replaceAll("\\s+", " "));
            }


            for (int i = 1; i < table.size(); i++) {
                List<String> row = table.get(i);
                for (int j = 0; j < headers.size() && j < row.size(); j++) {
                    String header = headers.get(j);
                    String value = row.get(j).trim();


                    if (!header.isEmpty() && !value.isEmpty()) {

                        if (keyValues.containsKey(header)) {
                            keyValues.put(header, keyValues.get(header) + "; " + value);
                        } else {
                            keyValues.put(header, value);
                        }
                    }
                }
            }
        }
        return keyValues;
    }

    private static Map<String, String> fallbackKeyValueExtraction(List<Block> blocks) {
        Map<String, String> fallbackKeyValues = new LinkedHashMap<>();
        for (Block block : blocks) {
            if (block.blockTypeAsString().equals("LINE")) {
                String text = block.text();
                if (text.contains(":")) {
                    String[] parts = text.split(":", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        if (!key.isEmpty() && !value.isEmpty()) {
                            fallbackKeyValues.put(key, value);
                        }
                    }
                }
            }
        }
        return fallbackKeyValues;
    }
}
