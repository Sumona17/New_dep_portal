package com.exavalu.backend.dto.Transform;

import java.util.List;

public class TransformedDataDTO {
    private List<CoverageValueDTO> coverage_values;
    private List<RiskValueDTO> risk_values;
    private List<String> admin_values;
    private List<String> products;

    public List<CoverageValueDTO> getCoverage_values() {
        return coverage_values;
    }

    public void setCoverage_values(List<CoverageValueDTO> coverage_values) {
        this.coverage_values = coverage_values;
    }

    public List<RiskValueDTO> getRisk_values() {
        return risk_values;
    }

    public void setRisk_values(List<RiskValueDTO> risk_values) {
        this.risk_values = risk_values;
    }

    public List<String> getAdmin_values() {
        return admin_values;
    }

    public void setAdmin_values(List<String> admin_values) {
        this.admin_values = admin_values;
    }

    public List<String> getProducts() {
        return products;
    }

    public void setProducts(List<String> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "TransformedDataDTO{" +
                "coverage_values=" + coverage_values +
                ", risk_values=" + risk_values +
                ", admin_values=" + admin_values +
                ", products=" + products +
                '}';
    }
}
