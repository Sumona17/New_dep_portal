package com.exavalu.backend.controller;

import com.exavalu.backend.model.CognitoUser;
import com.exavalu.backend.service.CognitoUserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${apiPrefix}")
public class CognitoUserController {
    private static final Logger logger = LogManager.getLogger(CognitoUserController.class);

    @Autowired
    private CognitoUserService cognitoUserService;


    @PostMapping("${securedString}" + "/userSignup")
    public String createNewUser(@RequestBody CognitoUser cognitoUser) {
        logger.info("Entering CognitoUserController createNewUser method");
        String result = "";
        result = cognitoUserService.createAdminUser(cognitoUser);
        logger.info("Exiting CognitoUserController createNewUser method");
        return result;
    }

    @GetMapping("${securedString}" + "/getCognitoUserList")
    public ResponseEntity<List<CognitoUser>> listAllUsers(@RequestHeader(value = "username") String username) {
        logger.info("Entering CognitoUserController listAllUsers method");
        List<CognitoUser> cognitoUser = new ArrayList<>();
        cognitoUser = cognitoUserService.getUserList();
        if (cognitoUser == null) {
            return new ResponseEntity<List<CognitoUser>>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<List<CognitoUser>>(cognitoUser, HttpStatus.OK);
        }

    }

    @PostMapping("${securedString}" + "/deleteCognitoUser")
    public String deleteUserFromPool(@RequestHeader(value = "username") String username) {
        logger.info("Entering CognitoUserController deleteUserFromPool method");

        String result = "";
        result = cognitoUserService.deleteUser(username);
        logger.info("Exiting CognitoUserController deleteUserFromPool method");
        return result;
    }

    @PostMapping("${securedString}" + "/userUpdate")
    public String userUpdate(@RequestBody CognitoUser userDetails,
                             @RequestHeader(value = "username") String username) {
        logger.info("Entering CognitoUserController userUpdate method");
        String result = "";
        result = cognitoUserService.updateUser(userDetails);
        logger.info("Exiting CognitoUserController userUpdate method");
        return result;
    }
}
