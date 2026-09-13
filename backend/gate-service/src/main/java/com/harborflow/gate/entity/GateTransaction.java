package com.harborflow.gate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gate_transactions")
public class GateTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gateTransactionId;

    @Column(nullable = false)
    private Long containerId;

    @Column(nullable = false)
    private String transactionType;

    @Column(nullable = false)
    private String truckLicense;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

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
