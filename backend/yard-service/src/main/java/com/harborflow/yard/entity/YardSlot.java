package com.harborflow.yard.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "yard_slots")
public class YardSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long slotId;

    @Column(nullable = false)
    private String zoneCode;

    @Column(nullable = false)
    private Integer rowNumber;

    @Column(nullable = false)
    private Boolean isOccupied = false;

    private Long containerId;

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    public String getZoneCode() { return zoneCode; }
    public void setZoneCode(String zoneCode) { this.zoneCode = zoneCode; }
    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }
    public Boolean getIsOccupied() { return isOccupied; }
    public void setIsOccupied(Boolean isOccupied) { this.isOccupied = isOccupied; }
    public Long getContainerId() { return containerId; }
    public void setContainerId(Long containerId) { this.containerId = containerId; }
}
