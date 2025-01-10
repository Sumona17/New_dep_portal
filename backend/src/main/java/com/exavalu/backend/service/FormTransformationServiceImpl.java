package com.exavalu.backend.service;

import com.exavalu.backend.dto.Transform.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Service
public class FormTransformationServiceImpl implements FormTransformationService {

    private void processBasicInformation(FormDataDTO page1, TransformedDataDTO output) {


        // Process insured name
        addRiskValue(output, "rsk_m4p9_insured_name",
                getFirstValue(page1.getKeyValuePairs(), "1. Full Name of Applicant:"));

        // Process contact information
        addRiskValue(output, "rsk_t79b_insured_contact_name",
                getFirstValue(page1.getKeyValuePairs(), "Name:"));

        addRiskValue(output, "rsk_5p6w_insured_contact_email",
                getFirstValue(page1.getKeyValuePairs(), "Email Address:"));

        addRiskValue(output, "rsk_14kt_insured_contact_phone",
                getFirstValue(page1.getKeyValuePairs(), "Phone Number:"));

        // Process employee count
        String employeeCount = getFirstValue(page1.getKeyValuePairs(), "5. Total Employee Count:");
        if (employeeCount != null) {
            addRiskValue(output, "rsk_k39d_number_of_employees",
                    Integer.parseInt(employeeCount));
        }

        // Process revenue
        String revenue = getFirstValue(page1.getKeyValuePairs(), "6. Annual Gross Revenues - Most recent 12 months:");
        if (revenue != null) {
            addRiskValue(output, "rsk_vrb1_total_annual_revenue",
                    Integer.parseInt(revenue));
        }
    }

    private void processAddress(FormDataDTO page1, TransformedDataDTO output) {
        String addressStr = getFirstValue(page1.getKeyValuePairs(), "2. Principal Address:");
        if (addressStr != null) {
            String[] addressParts = addressStr.split(",");
            AddressDTO address = new AddressDTO();
            address.setLine1(addressParts[0].trim());
            address.setOrganization(getFirstValue(page1.getKeyValuePairs(), "Name:"));
            if (addressParts.length > 1) {
                address.setCity(addressParts[1].trim());
            }
            if (addressParts.length > 2) {
                String[] stateZip = addressParts[2].trim().split(" ");
                address.setState(stateZip[0]);
                if (stateZip.length > 1) {
                    address.setPostal_code(stateZip[1]);
                }
            }
            address.setCountry_code("USA");

            addRiskValue(output, "rsk_tvm3_mailing_address", address);
        }
    }

    private void processHighRiskIndustries(FormDataDTO page1, TransformedDataDTO output) {
        List<String> highRiskIndustries = new ArrayList<>();

        if (isCheckboxSelected(page1, "Adult Content")) {
            highRiskIndustries.add("Adult Content");
        }
        if (isCheckboxSelected(page1, "Gambling")) {
            highRiskIndustries.add("Gambling");
        }
        if (isCheckboxSelected(page1, "Cryptocurrency or Blockchain")) {
            highRiskIndustries.add("Cryptocurrency or Blockchain");
        }
        if (isCheckboxSelected(page1, "Cannabis")) {
            highRiskIndustries.add("Cannabis");
        }
        if (isCheckboxSelected(page1, "Debt collection agency")) {
            highRiskIndustries.add("Debt collection agency");
        }
        if (isCheckboxSelected(page1,  "Managed IT service provider (MSP or MSSP)")) {
            highRiskIndustries.add("Managed IT service provider (MSP or MSSP)");
        }
        if (isCheckboxSelected(page1,  "Payment Processing (e.g., as a payment processor, merchant acquirer, or Point of Sale system vendor)")) {
            highRiskIndustries.add("Payment Processing (e.g., as a payment processor, merchant acquirer, or Point of Sale system vendor)");
        }
        if (isCheckboxSelected(page1,  "None of the above")) {
            highRiskIndustries.add("None of the above");
        }

        if (!highRiskIndustries.isEmpty()) {
            addRiskValue(output, "rsk_h8oi_high_risk_industry_type", highRiskIndustries);
        }
    }

    private void processSecurityControls(FormDataDTO page2, TransformedDataDTO output) {

        System.out.println("output" +output.toString());
        // Process backup security
        addRiskValue(output, "rsk_d6el_secure_backup",
                isCheckboxSelected(page2, "9. Is your critical business data backed-up and stored in a secure location?"));

        // Process security training
        addRiskValue(output, "rsk_6ril_cyb_security_training",
                isCheckboxSelected(page2, "15. Are employees required to undergo annual security training?"));
    }

    private void processClaimsHistory(FormDataDTO page3, TransformedDataDTO output) {
        // Process claims history
        List<String> yesResponses = page3.getKeyValuePairs().get("Yes");
        if (yesResponses != null && !yesResponses.isEmpty()) {
            addRiskValue(output, "rsk_jb26_cyb_has_claims_history",
                    yesResponses.get(0).contains("[✓]") ? "yes" : "no");
        }
    }

    private void setDefaultCoverageValues(TransformedDataDTO output) {
        addCoverageValue(output, "cvg_agj9_cyb_aggregate_limit", 10000000);
        addCoverageValue(output, "cvg_64oi_cyb_business_income_coverage_limit", 1000000);
        addCoverageValue(output, "cvg_7fsk_cyb_aggregate_retention", 100000);
    }

    // Utility methods
    private void addRiskValue(TransformedDataDTO output, String id, Object value) {
        RiskValueDTO riskValue = new RiskValueDTO();
        riskValue.setRisk_parameter_id(id);
        riskValue.setValue(value);
        output.getRisk_values().add(riskValue);
    }

    private void addCoverageValue(TransformedDataDTO output, String id, Object value) {
        CoverageValueDTO coverageValue = new CoverageValueDTO();
        coverageValue.setCoverage_parameter_id(id);
        coverageValue.setValue(value);
        output.getCoverage_values().add(coverageValue);
    }

    private String getFirstValue(Map<String, List<String>> map, String key) {
        List<String> values = map.get(key);
        return values != null && !values.isEmpty() ? values.get(0) : null;
    }

    private boolean isCheckboxSelected(FormDataDTO page, String key) {
        String value = getFirstValue(page.getKeyValuePairs(), key);
        return value != null && value.contains("[✓]");
    }

    @Override
    public TransformedDataDTO transformFormData(List<FormDataDTO> formData, String products) {
        System.out.println("In Service");
        System.out.println("In formdata" +formData);
        TransformedDataDTO output = new TransformedDataDTO();

        // Initialize lists
        output.setCoverage_values(new ArrayList<>());
        output.setRisk_values(new ArrayList<>());
        output.setAdmin_values(new ArrayList<>());
//        output.setProducts(Arrays.asList(
//                "prd_0050_herald_cyber",
//                "prd_la3v_atbay_cyber",
//                "prd_jk0g_cowbell_cyber"
//        ));
        List<String> productsList = Arrays.asList(products.split(","));
        output.setProducts(productsList);

        // Process first page data
        FormDataDTO page1 = formData.get(0);
        processBasicInformation(page1, output);
        processAddress(page1, output);
        processHighRiskIndustries(page1, output);

        // Process second page data
        FormDataDTO page2 = formData.get(1);
        processSecurityControls(page2, output);

        // Process third page data
        FormDataDTO page3 = formData.get(2);
        processClaimsHistory(page3, output);

        // Set default coverage values
        setDefaultCoverageValues(output);
//        System.out.println("output" +output);

        return output;
    }
}
