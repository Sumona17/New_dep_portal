package com.exavalu.backend.service;

import com.exavalu.backend.dto.PremiumRequestDTO;
import com.exavalu.backend.dto.PremiumResponseDTO;

public interface PremiumService {
    PremiumResponseDTO getPremium(PremiumRequestDTO premiumRequestDTO);
}
