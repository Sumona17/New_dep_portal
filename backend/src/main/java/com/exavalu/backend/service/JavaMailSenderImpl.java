package com.exavalu.backend.service;

import com.exavalu.backend.controller.CognitoUserController;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
@Service
public class JavaMailSenderImpl {
    private static final Logger logger = LogManager.getLogger(JavaMailSenderImpl.class);
    @Autowired
    public JavaMailSender emailSender;

    public void sendSimpleEmail(String toAddress, String subject, String message) {
        logger.debug("Entering JavaMailSenderImpl sendSimpleEmail method, with toAddress = " + toAddress + " , "
                + "subject = " + subject + " , " + "message = " + message);
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(toAddress);
        simpleMailMessage.setSubject(subject);
        simpleMailMessage.setText(message);
        emailSender.send(simpleMailMessage);
    }
}
