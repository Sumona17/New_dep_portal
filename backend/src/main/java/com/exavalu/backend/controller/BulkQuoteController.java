package com.exavalu.backend.controller;

import com.exavalu.backend.model.CognitoUser;
import com.exavalu.backend.service.BulkQuoteService;
import com.exavalu.backend.service.BulkQuoteServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${apiPrefix}")
public class BulkQuoteController {
    private static final Logger logger = LogManager.getLogger(BulkQuoteController.class);

    @Autowired
    BulkQuoteService bulkQuoteService;

    @GetMapping("${securedString}" + "/getBulkData")
    public ResponseEntity<List<Map<String, String>>> getBulkData() {
        logger.info("Entering BulkQuoteController getBulkData method");
        List<Map<String, String>> result = new ArrayList<>();
        result = bulkQuoteService.parseExcelToJson();
        if (result == null) {
            logger.error("Error in BulkQuoteController getBulkData method");
            return new ResponseEntity<List<Map<String, String>>>(HttpStatus.NOT_FOUND);
        } else {
            logger.info("Exiting BulkQuoteController getBulkData method");
            return new ResponseEntity<List<Map<String, String>>>(result, HttpStatus.OK);
        }
    }
}
