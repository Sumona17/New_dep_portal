package com.exavalu.backend.service;

import java.util.List;
import java.util.Map;

public interface BulkQuoteService {
    List<Map<String, String>> parseExcelToJson();
}
