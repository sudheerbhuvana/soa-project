package com.harborflow.carrier.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "jobs")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @Column(nullable = false)
    private Long carrierId;

    @Column(nullable = false)
    private Long containerId;

    @Column(nullable = false)
    private String truckLicense;

    @Column(nullable = false)
    private String status; // ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(nullable = false)
    private Instant assignedAt = Instant.now();

    private Instant completedAt;

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public Long getCarrierId() { return carrierId; }
    public void setCarrierId(Long carrierId) { this.carrierId = carrierId; }
    public Long getContainerId() { return containerId; }
    public void setContainerId(Long containerId) { this.containerId = containerId; }
    public String getTruckLicense() { return truckLicense; }
    public void setTruckLicense(String truckLicense) { this.truckLicense = truckLicense; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}