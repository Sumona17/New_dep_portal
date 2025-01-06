package com.exavalu.backend.controller;

import com.exavalu.backend.service.TextractService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${apiPrefix}")
public class TextractController {

    @Autowired
    private TextractService textractService;

    private static final Logger logger = LogManager.getLogger(TextractController.class);

    @PostMapping("${securedString}" + "/uploadPdf")
    public ResponseEntity<List> uploadPdf(@RequestParam("file") MultipartFile[] files)
            throws Exception {
        long startTime = System.currentTimeMillis();
        logger.info("Entering TextractController uploadPdf method");
        List responseData = null;

        for (MultipartFile name : files) {
            logger.info("NAME: %s", name.getOriginalFilename());
        }
        responseData = textractService.uploadPdf(files);

        logger.info("Exiting TextractController uploadPdf method");
        logger.info("Total execution took {}ms", (System.currentTimeMillis() - startTime));
        return new ResponseEntity<List>(responseData, HttpStatus.OK);
    }
}
