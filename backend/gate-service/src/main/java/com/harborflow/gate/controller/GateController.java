package com.harborflow.gate.controller;

import com.harborflow.gate.dto.GateTransactionDto;
import com.harborflow.gate.service.GateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gate")
@Tag(name = "Gate", description = "Gate transactions — truck check-in / check-out")
public class GateController {

    @Autowired
    private GateService service;

    @Operation(summary = "List gate transactions (newest first)")
    @GetMapping("/transactions")
    public List<GateTransactionDto> getAll() { return service.findAll(); }

    @Operation(summary = "Get transaction by id")
    @GetMapping("/transactions/{id}")
    public GateTransactionDto getById(@PathVariable Long id) { return service.findById(id); }

    @Operation(summary = "List all transactions for a specific container")
    @GetMapping("/transactions/container/{containerId}")
    public List<GateTransactionDto> getByContainer(@PathVariable Long containerId) {
        return service.findByContainerId(containerId);
    }

    @Operation(summary = "Log a gate transaction (CHECK_IN / CHECK_OUT)")
    @PostMapping("/transactions")
    public ResponseEntity<GateTransactionDto> create(@RequestBody GateTransactionDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Delete transaction")
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
