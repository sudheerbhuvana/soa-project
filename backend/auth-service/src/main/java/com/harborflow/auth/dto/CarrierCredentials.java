package com.harborflow.auth.dto;

public class CarrierCredentials {
    private String email;
    private String password;

    public CarrierCredentials() {}
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}