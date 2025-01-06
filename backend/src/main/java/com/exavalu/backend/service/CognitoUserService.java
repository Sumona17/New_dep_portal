package com.exavalu.backend.service;

import com.exavalu.backend.model.CognitoUser;

import java.util.List;


public interface CognitoUserService {
    List<CognitoUser> getUserList();
    String deleteUser(String username);
    String signupUser(CognitoUser cognitoUser);
    String updateUser(CognitoUser cognitoUserDetails);
    String createAdminUser(CognitoUser cognitoUserDetails);
}
