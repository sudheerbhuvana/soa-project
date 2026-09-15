package com.harborflow.container.controller;

import com.harborflow.container.dto.ContainerDto;
import com.harborflow.container.service.ContainerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/containers")
@Tag(name = "Containers", description = "Container registry — CRUD + status workflow")
public class ContainerController {

    @Autowired
    private ContainerService service;

    @Operation(summary = "List all containers")
    @GetMapping
    public List<ContainerDto> getAll() { return service.findAll(); }

    @Operation(summary = "Get container by id")
    @GetMapping("/{id}")
    public ContainerDto getById(@PathVariable Long id) { return service.findById(id); }

    @Operation(summary = "List containers belonging to a carrier")
    @GetMapping("/carrier/{carrierId}")
    public List<ContainerDto> getByCarrier(@PathVariable Long carrierId) {
        return service.findByCarrierId(carrierId);
    }

    @Operation(summary = "Register a new container")
    @PostMapping
    public ResponseEntity<ContainerDto> create(@RequestBody ContainerDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Update container")
    @PutMapping("/{id}")
    public ContainerDto update(@PathVariable Long id, @RequestBody ContainerDto dto) {
        return service.update(id, dto);
    }

    @Operation(summary = "Change container status (IN_YARD, LOADED, DEPARTED)")
    @PatchMapping("/{id}/status")
    public ContainerDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, body.get("status"));
    }

    @Operation(summary = "Delete container")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
