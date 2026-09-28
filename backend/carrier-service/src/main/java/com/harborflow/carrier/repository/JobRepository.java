package com.harborflow.carrier.repository;

import com.harborflow.carrier.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCarrierIdOrderByAssignedAtDesc(Long carrierId);
    List<Job> findByContainerIdOrderByAssignedAtDesc(Long containerId);
    List<Job> findAllByOrderByAssignedAtDesc();
}