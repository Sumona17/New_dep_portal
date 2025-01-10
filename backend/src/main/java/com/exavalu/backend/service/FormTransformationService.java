package com.exavalu.backend.service;

import com.exavalu.backend.dto.Transform.FormDataDTO;
import com.exavalu.backend.dto.Transform.TransformedDataDTO;

import java.util.List;

public interface FormTransformationService {
    TransformedDataDTO transformFormData(List<FormDataDTO> formData, String products);
}
