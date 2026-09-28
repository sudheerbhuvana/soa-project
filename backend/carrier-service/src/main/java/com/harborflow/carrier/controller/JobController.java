package com.harborflow.carrier.controller;

import com.harborflow.carrier.dto.JobDto;
import com.harborflow.carrier.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/jobs")
@Tag(name = "Jobs", description = "Carrier–container assignment work orders")
public class JobController {

    @Autowired
    private JobService service;

    @Operation(summary = "List all jobs")
    @GetMapping
    public List<JobDto> getAll() { return service.findAll(); }

    @Operation(summary = "List jobs for a specific carrier")
    @GetMapping("/carrier/{carrierId}")
    public List<JobDto> getByCarrier(@PathVariable Long carrierId) {
        return service.findByCarrier(carrierId);
    }

    @Operation(summary = "Create a job (assign container to carrier with truck)")
    @PostMapping
    public ResponseEntity<JobDto> create(@RequestBody JobDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Update job status")
    @PatchMapping("/{id}/status")
    public JobDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.get("status"));
    }

    @Operation(summary = "Delete a job")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}