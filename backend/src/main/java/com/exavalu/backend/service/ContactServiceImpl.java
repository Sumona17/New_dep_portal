package com.exavalu.backend.service;

import com.exavalu.backend.model.ContactDetails;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

@Service
public class ContactServiceImpl implements ContactService{
    private static final Logger logger = LogManager.getLogger(ContactServiceImpl.class);
    @Value("${spring.mail.username}")
    private String mailUsername;
    @Autowired
    JavaMailSenderImpl emailService;
    public String sendDetails(ContactDetails contactUsDetails) {
        logger.debug("Entering ContactServiceImpl sendDetails method, with ContactUsDetails = "
                + contactUsDetails);
       
        String response="";
        String firstName = contactUsDetails.getFirstName();
        String lastName = contactUsDetails.getLastName();
        String email = contactUsDetails.getEmail();
        String phoneNumber = contactUsDetails.getPhone();
        String state = contactUsDetails.getState();
        String help = contactUsDetails.getHelp();
        String message = contactUsDetails.getMessage();
        
        
        try {
            emailService.sendSimpleEmail(mailUsername, "Contact Us Details",
                    "User contact details:" + "First Name: " + firstName + "," + "Last Name: " + lastName +  "," + "Email: "
                            + email + "," + "Phone number:" + phoneNumber + "," + "Message: " + message +","
                            + "State: " + state+ "," +"Help: " + help);
            response = "Success";
        } catch (MailException mailException) {
            logger.error("Inside ContactDBServiceImpl sendDetails method: {}", mailException.getMessage());
            response = "Some error!";
        }
        return response;
    }

}
