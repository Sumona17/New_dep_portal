package com.exavalu.backend.exceptions;

public class RequiredFieldsException extends RuntimeException {
    public RequiredFieldsException() {
        super();
    }

    public RequiredFieldsException(String message) {
        super(message);
    }
}
