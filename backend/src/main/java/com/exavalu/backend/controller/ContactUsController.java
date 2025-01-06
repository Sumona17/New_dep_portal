package com.exavalu.backend.controller;

import com.exavalu.backend.model.ContactDetails;
import com.exavalu.backend.service.ContactService;
import com.exavalu.backend.service.ContactServiceImpl;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${apiPrefix}")
public class ContactUsController {
    private static final Logger logger = LogManager.getLogger(ContactUsController.class);
    @Autowired
    private ContactService contactService;
    @PostMapping("${securedString}" + "/contactUs")
    public String sendDetails(@RequestBody ContactDetails contactUsDetails) {
        logger.info("Entering ContactUsController sendDetails method");

        String response = "";

            response = contactService.sendDetails(contactUsDetails);

        logger.info("Exiting ContactUsController sendDetails method");
        return response;
    }
}
