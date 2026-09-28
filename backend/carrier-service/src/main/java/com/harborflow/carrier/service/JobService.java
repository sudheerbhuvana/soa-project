package com.harborflow.carrier.service;

import com.harborflow.carrier.dto.JobDto;
import com.harborflow.carrier.entity.Job;
import com.harborflow.carrier.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository repository;

    public List<JobDto> findAll() {
        return repository.findAllByOrderByAssignedAtDesc().stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<JobDto> findByCarrier(Long carrierId) {
        return repository.findByCarrierIdOrderByAssignedAtDesc(carrierId).stream().map(this::toDto).collect(Collectors.toList());
    }

    public JobDto create(JobDto dto) {
        Job j = new Job();
        j.setCarrierId(dto.getCarrierId());
        j.setContainerId(dto.getContainerId());
        j.setTruckLicense(dto.getTruckLicense());
        j.setStatus(dto.getStatus() != null ? dto.getStatus() : "ASSIGNED");
        j.setAssignedAt(Instant.now());
        return toDto(repository.save(j));
    }

    public JobDto updateStatus(Long id, String status) {
        Job j = repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        j.setStatus(status);
        if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
            j.setCompletedAt(Instant.now());
        }
        return toDto(repository.save(j));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private JobDto toDto(Job j) {
        JobDto d = new JobDto();
        d.setJobId(j.getJobId());
        d.setCarrierId(j.getCarrierId());
        d.setContainerId(j.getContainerId());
        d.setTruckLicense(j.getTruckLicense());
        d.setStatus(j.getStatus());
        d.setAssignedAt(j.getAssignedAt() != null ? j.getAssignedAt().toString() : null);
        d.setCompletedAt(j.getCompletedAt() != null ? j.getCompletedAt().toString() : null);
        return d;
    }
}