package com.exavalu.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TextractService {
    List uploadPdf(MultipartFile[] files);
}
