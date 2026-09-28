package com.harborflow.auth.dto;

public class CarrierAuthResponse {
    private Long carrierId;
    private String companyName;
    private String email;
    private String vesselIdentifier;

    public CarrierAuthResponse() {}
    public CarrierAuthResponse(Long carrierId, String companyName, String email, String vesselIdentifier) {
        this.carrierId = carrierId;
        this.companyName = companyName;
        this.email = email;
        this.vesselIdentifier = vesselIdentifier;
    }
    public Long getCarrierId() { return carrierId; }
    public String getCompanyName() { return companyName; }
    public String getEmail() { return email; }
    public String getVesselIdentifier() { return vesselIdentifier; }
}