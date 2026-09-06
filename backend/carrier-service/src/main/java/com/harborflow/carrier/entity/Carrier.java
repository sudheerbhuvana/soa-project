package com.harborflow.carrier.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "carriers")
public class Carrier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carrierId;

    @Column(nullable = false)
    private String companyName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String vesselIdentifier;

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
