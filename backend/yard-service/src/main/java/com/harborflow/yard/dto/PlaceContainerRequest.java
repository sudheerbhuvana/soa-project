package com.harborflow.yard.dto;

public class PlaceContainerRequest {
    private Long containerId;
    private String zoneCode;
    public Long getContainerId() { return containerId; }
    public void setContainerId(Long containerId) { this.containerId = containerId; }
    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }
}
