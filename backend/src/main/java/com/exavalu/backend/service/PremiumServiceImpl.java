package com.exavalu.backend.service;

import com.exavalu.backend.dto.PremiumRequestDTO;
import com.exavalu.backend.dto.PremiumResponseDTO;
import com.exavalu.backend.exceptions.RequiredFieldsException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

@Service
public class PremiumServiceImpl implements PremiumService {


    @Override
    public PremiumResponseDTO getPremium(PremiumRequestDTO premiumRequestDTO) {

        if (premiumRequestDTO.getName() == null) {
            throw new RequiredFieldsException("Premium Request should not be null");
        }
        Random random = new Random();
        PremiumResponseDTO premiumResponseDTO = new PremiumResponseDTO();
        double randomNum = random.nextDouble(20000.00);
        BigDecimal bd = new BigDecimal(randomNum).setScale(2, RoundingMode.HALF_UP);
        double newNum = bd.doubleValue();
        premiumResponseDTO.setPremium(newNum);
        return premiumResponseDTO;
    }
}
