package com.exavalu.backend.configuration;

import com.exavalu.backend.exceptions.ErrorResponse;
import com.exavalu.backend.exceptions.RequiredFieldsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class CustomControllerAdvice {
    @ExceptionHandler(RequiredFieldsException.class)
    public ResponseEntity<ErrorResponse> handleRequiredFieldsException(Exception exception) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        return new ResponseEntity<>(new ErrorResponse(status, exception.getMessage()), status);

    }
}
