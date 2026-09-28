package com.harborflow.carrier.dto;

public class JobDto {
    private Long jobId;
    private Long carrierId;
    private Long containerId;
    private String truckLicense;
    private String status;
    private String assignedAt;
    private String completedAt;

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
    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }
    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
}