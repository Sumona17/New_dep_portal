package com.exavalu.backend.dto.Transform;

public class RiskValueDTO {
    private String risk_parameter_id;
    private Object value;

    public String getRisk_parameter_id() {
        return risk_parameter_id;
    }

    public void setRisk_parameter_id(String risk_parameter_id) {
        this.risk_parameter_id = risk_parameter_id;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "RiskValueDTO{" +
                "risk_parameter_id='" + risk_parameter_id + '\'' +
                ", value=" + value +
                '}';
    }
}
