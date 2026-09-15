package com.harborflow.gate.dto;

import java.time.LocalDateTime;

public class GateTransactionDto {
    private Long gateTransactionId;
    private Long containerId;
    private String transactionType;
    private String truckLicense;
    private LocalDateTime timestamp;
    public Long getGateTransactionId() { return gateTransactionId; }
    public void setGateTransactionId(Long gateTransactionId) { this.gateTransactionId = gateTransactionId; }
    public Long getContainerId() { return containerId; }
    public void setContainerId(Long containerId) { this.containerId = containerId; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getTruckLicense() { return truckLicense; }
    public void setTruckLicense(String truckLicense) { this.truckLicense = truckLicense; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
