package com.exavalu.backend.dto.Transform;

public class CoverageValueDTO {
    private String coverage_parameter_id;
    private Object value;

    public String getCoverage_parameter_id() {
        return coverage_parameter_id;
    }

    public void setCoverage_parameter_id(String coverage_parameter_id) {
        this.coverage_parameter_id = coverage_parameter_id;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
