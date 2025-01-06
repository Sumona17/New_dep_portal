package com.exavalu.backend.service;

import com.exavalu.backend.model.CognitoUser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.List;

@Service
public class CognitoUserServiceImpl implements CognitoUserService {

    private static final Logger logger = LogManager.getLogger(CognitoUserServiceImpl.class);

    @Value("${userPoolId}")
    String userPoolId;

    @Value("${clientId}")
    String clientIdValue;

    @Value("${awsRegion}")
    String awsRegion;

    @Value("${cognitoPassword}")
    String cognitoPassword;

    public String signupUser(CognitoUser cognitoUserDetails) {
        logger.debug("Entering CognitoUserServiceImpl signupUser method, with CognitoUser = "
                + cognitoUserDetails.toString());

        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(awsRegion)).build();
        String result = "";
        String userName = cognitoUserDetails.getUserName();
        String password = cognitoUserDetails.getPassword();
        String email = cognitoUserDetails.getEmail();
        String phone = cognitoUserDetails.getPhone();
        String role = cognitoUserDetails.getRole();
        String newPhone = phone.replaceAll("-", "");
        AttributeType userAttr1 = AttributeType.builder().name("email").value(email).build();
        AttributeType userAttr2 = AttributeType.builder().name("phone_number").value(newPhone).build();

        AttributeType userAttr3 = AttributeType.builder().name("custom:role").value(role).build();
        AttributeType userAttr4 = AttributeType.builder().name("custom:status").value("active").build();

        List<AttributeType> userAttrsList = new ArrayList<>();
        userAttrsList.add(userAttr1);
        userAttrsList.add(userAttr2);
        userAttrsList.add(userAttr3);
        userAttrsList.add(userAttr4);
        try {
            SignUpRequest signUpRequest = SignUpRequest.builder().userAttributes(userAttrsList).username(userName)
                    .clientId(clientIdValue).password(password).build();

            cognitoClient.signUp(signUpRequest);
            result = "Success";
        } catch (CognitoIdentityProviderException e) {
            logger.error("Inside CognitoUserServiceImpl signupUser method: {}", e.awsErrorDetails().errorMessage());
            result = e.awsErrorDetails().errorMessage();
        }

        return result;
    }

    public String createAdminUser(CognitoUser cognitoUserDetails) {
        logger.info("Entering CognitoUserServiceImpl createAdminUser method, with CognitoUser = "
                + cognitoUserDetails.toString());

        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(awsRegion)).build();

        String result = "";
        String userName = cognitoUserDetails.getUserName();
        String email = cognitoUserDetails.getEmail();
        String phone = cognitoUserDetails.getPhone();
        String role = cognitoUserDetails.getRole();
        String newPhone = phone.replaceAll("-", "");
        int len = 8;
        String temppassword = generateRandomPassword(len) + "5!";
        try {
            AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder().userPoolId(userPoolId)
                    .username(userName).temporaryPassword(temppassword)
                    .userAttributes(AttributeType.builder().name("email").value(email).build(),
                            AttributeType.builder().name("phone_number").value(newPhone).build(),
                            AttributeType.builder().name("custom:role").value(role).build(),
                            AttributeType.builder().name("custom:status").value("active").build())
                    .desiredDeliveryMediums(DeliveryMediumType.EMAIL).build();
            AdminCreateUserResponse createUserResult = cognitoClient.adminCreateUser(createUserRequest);
            if (createUserResult.user() != null) {
                result = "Success";
            } else {
                result = "User creation failed.";
            }
        } catch (CognitoIdentityProviderException e) {
            logger.error("Inside CognitoUserServiceImpl createAdminUser method: {}",
                    e.awsErrorDetails().errorMessage());
            result = e.awsErrorDetails().errorMessage();
        }
        return result;
    }
    public static String generateRandomPassword(int len) {
        String uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        String numberChars = "0123456789";
        String specialChars = "!@#$%^&*()";

        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        String chars = uppercaseChars + lowercaseChars + numberChars + specialChars;

        // add at least one uppercase letter
        int randomIndex = random.nextInt(uppercaseChars.length());
        sb.append(uppercaseChars.charAt(randomIndex));

        // add at least one lowercase letter
        randomIndex = random.nextInt(lowercaseChars.length());
        sb.append(lowercaseChars.charAt(randomIndex));

        // add at least one number
        randomIndex = random.nextInt(numberChars.length());
        sb.append(numberChars.charAt(randomIndex));

        // add at least one special character
        randomIndex = random.nextInt(specialChars.length());
        sb.append(specialChars.charAt(randomIndex));

        // add the remaining characters
        int remainingLen = len - 4;
        for (int i = 0; i < remainingLen; i++) {
            randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }

        // shuffle the characters to make the order random
        String shuffledString = new String(sb.toString().toCharArray());
        Collections.shuffle(Arrays.asList(shuffledString));
        return shuffledString;
    }

    public List<CognitoUser> getUserList() {
        logger.info("Entering CognitoUserServiceImpl getUserList method ");
        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(awsRegion)).build();
        List<CognitoUser> cogUser = new ArrayList<>();
        try {
            ListUsersRequest usersRequest = ListUsersRequest.builder().userPoolId(userPoolId).build();
            ListUsersResponse res =null;
            try {
                res = cognitoClient.listUsers(usersRequest);
            } catch (CognitoIdentityProviderException e) {
                logger.error("Cognito error: {}", e.awsErrorDetails().errorMessage());
            } catch (SdkClientException e) {
                logger.error("SDK error: {}", e.getMessage());
            }
            for (UserType userType : res.users()) {
                CognitoUser userDetails = new CognitoUser();
                userDetails.setUserName(userType.username());
                userDetails.setStatus(userType.userStatusAsString());
                userDetails.setEmail(getAttributeValue(userType, "email"));
                userDetails.setPhone(getAttributeValue(userType, "phone_number"));
                userDetails.setPassword(getAttributeValue(userType, "password"));
                userDetails.setRole(getAttributeValue(userType, "custom:role"));
                userDetails.setStatus(getAttributeValue(userType, "custom:status"));
                cogUser.add(userDetails);
            }
        } catch (CognitoIdentityProviderException e) {
            logger.error("Cognito error: {}", e.awsErrorDetails().errorMessage());

        }
        return cogUser;
    }
    public String getAttributeValue(UserType userType, String attributeName) {
        for (AttributeType attribute : userType.attributes()) {
            if (attributeName.equals(attribute.name())) {
                return attribute.value();
            }
        }
        return null;
    }
    @Override
    public String deleteUser(String username) {
        logger.info("Entering CognitoUserServiceImpl deleteUser method with user = {}", username);
        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(awsRegion)).build();
        String result = "";
        try {

            AdminDeleteUserRequest request = AdminDeleteUserRequest.builder().userPoolId(userPoolId).username(username)
                    .build();
            AdminDeleteUserResponse response = cognitoClient.adminDeleteUser(request);
            if (response.toString().equals("AdminDeleteUserResponse()")) {
                result = "Success";
            }
        } catch (CognitoIdentityProviderException e) {
            logger.error("Cognito error: {}",e.awsErrorDetails().errorMessage());
            result = e.awsErrorDetails().errorMessage();
        }
        return result;
    }

    @Override
    public String updateUser(CognitoUser cognitoUserDetails) {
        logger.info("Entering CognitoUserServiceImpl updateUser method with user details = {}", cognitoUserDetails.toString());

        CognitoIdentityProviderClient cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.of(awsRegion)).build();

        String result = "";
        String userName = cognitoUserDetails.getUserName();
        String phone = cognitoUserDetails.getPhone();
        String role = cognitoUserDetails.getRole();
        String statusUser = cognitoUserDetails.getStatus();
        String newPhone = phone.replaceAll("-", "");

        try {

            AdminUpdateUserAttributesRequest updateUserRequest = AdminUpdateUserAttributesRequest.builder().userPoolId(userPoolId)
                    .username(userName)
                    .userAttributes(
                            AttributeType.builder().name("phone_number").value(newPhone).build(),
                            AttributeType.builder().name("custom:role").value(role).build(),
                            AttributeType.builder().name("custom:status").value(statusUser).build()).build();

            AdminUpdateUserAttributesResponse updateUserResult = cognitoClient.adminUpdateUserAttributes(updateUserRequest);

            ObjectMapper Obj = new ObjectMapper();
            String cognitoUserStr = null;
            try {

                cognitoUserDetails.setUserName(cognitoUserDetails.getUserName());
                cognitoUserDetails.setEmail(cognitoUserDetails.getEmail());
                cognitoUserDetails.setStatus(cognitoUserDetails.getStatus());
                cognitoUserDetails.setPhone(cognitoUserDetails.getPhone());
                cognitoUserDetails.setPassword(cognitoPassword);
                cognitoUserStr = Obj.writeValueAsString(cognitoUserDetails);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
            if (updateUserResult != null) {
                result = cognitoUserStr;
            } else {
                result = "User updation failed.";
            }
        } catch (CognitoIdentityProviderException e) {
            logger.error("Cognito error: {}",e.awsErrorDetails().errorMessage());
            result = e.awsErrorDetails().errorMessage();
        }
        return result;
    }
}
