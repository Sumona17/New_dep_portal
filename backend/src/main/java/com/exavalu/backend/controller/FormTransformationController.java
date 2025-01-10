package com.exavalu.backend.controller;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.exavalu.backend.dto.Transform.FormDataDTO;
import com.exavalu.backend.dto.Transform.TransformedDataDTO;
import com.exavalu.backend.service.FormTransformationService;
import com.exavalu.backend.service.TextractService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${apiPrefix}")
public class FormTransformationController {

    @Autowired
    private FormTransformationService formTransformationService;

    private static final Logger logger = LogManager.getLogger(FormTransformationController.class);


    @PostMapping("${securedString}/transform/")
    public ResponseEntity<TransformedDataDTO> transformFormData(@RequestBody List<FormDataDTO> formData,@RequestParam("products")String products) {

        System.out.println("product"+products);
        TransformedDataDTO transformedData = formTransformationService.transformFormData(formData,products);
        return ResponseEntity.ok(transformedData);
    }
}
