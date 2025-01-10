package com.exavalu.backend.dto.Transform;

import java.util.List;
import java.util.Map;

public class FormDataDTO {
    private Map<String, List<String>> keyValuePairs;
    private List<Map<String, String>> tableKeyValues;
    private List<List<String>> tables;
    private Map<String, String> fallbackKeyValues;

    public Map<String, List<String>> getKeyValuePairs() {
        return keyValuePairs;
    }

    public void setKeyValuePairs(Map<String, List<String>> keyValuePairs) {
        this.keyValuePairs = keyValuePairs;
    }

    public List<Map<String, String>> getTableKeyValues() {
        return tableKeyValues;
    }

    public void setTableKeyValues(List<Map<String, String>> tableKeyValues) {
        this.tableKeyValues = tableKeyValues;
    }

    public List<List<String>> getTables() {
        return tables;
    }

    public void setTables(List<List<String>> tables) {
        this.tables = tables;
    }

    public Map<String, String> getFallbackKeyValues() {
        return fallbackKeyValues;
    }

    public void setFallbackKeyValues(Map<String, String> fallbackKeyValues) {
        this.fallbackKeyValues = fallbackKeyValues;
    }
}
