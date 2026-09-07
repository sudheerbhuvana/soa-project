package com.harborflow.carrier.dto;

public class CarrierDto {
    private Long carrierId;
    private String companyName;
    private String email;
    private String password;
    private String vesselIdentifier;
    public CarrierDto() {}
    public Long getCarrierId() { return carrierId; }
    public void setCarrierId(Long carrierId) { this.carrierId = carrierId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getVesselIdentifier() { return vesselIdentifier; }
    public void setVesselIdentifier(String vesselIdentifier) { this.vesselIdentifier = vesselIdentifier; }
}
