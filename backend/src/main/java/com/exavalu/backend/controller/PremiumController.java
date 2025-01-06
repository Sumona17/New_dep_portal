package com.exavalu.backend.controller;

import com.exavalu.backend.dto.PremiumRequestDTO;
import com.exavalu.backend.dto.PremiumResponseDTO;
import com.exavalu.backend.service.PremiumService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${apiPrefix}")
public class PremiumController {

    @Autowired
    private PremiumService premiumService;

    @PostMapping(path="${securedString}"+"/premium", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity getDynamicPayload(@RequestBody @Valid PremiumRequestDTO request) {
        PremiumResponseDTO premium = premiumService.getPremium(request);
        return new ResponseEntity(premium, HttpStatus.OK);
    }
}
