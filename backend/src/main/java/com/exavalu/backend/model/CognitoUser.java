package com.exavalu.backend.model;

import java.util.Objects;

public class CognitoUser {
    private String userName;
    private String password;
    private String email;
    private String phone;
    private String role;
    private String status;

    public CognitoUser() {
    }

    public CognitoUser(String userName, String password, String email, String phone, String role, String status) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.status = status;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CognitoUser that = (CognitoUser) o;
        return Objects.equals(userName, that.userName) && Objects.equals(password, that.password) && Objects.equals(email, that.email) && Objects.equals(phone, that.phone) && Objects.equals(role, that.role) && Objects.equals(status, that.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userName, password, email, phone, role, status);
    }

    @Override
    public String toString() {
        return "CognitoUser{" +
                "userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role='" + role + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
