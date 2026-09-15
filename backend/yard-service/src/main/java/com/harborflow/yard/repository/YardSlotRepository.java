package com.harborflow.yard.repository;

import com.harborflow.yard.entity.YardSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface YardSlotRepository extends JpaRepository<YardSlot, Long> {
    List<YardSlot> findByZoneCode(String zoneCode);
    List<YardSlot> findByIsOccupied(Boolean isOccupied);
    Optional<YardSlot> findFirstByIsOccupiedFalseOrderBySlotIdAsc();
    Optional<YardSlot> findByContainerId(Long containerId);
}
