package com.harborflow.yard.controller;

import com.harborflow.yard.dto.PlaceContainerRequest;
import com.harborflow.yard.dto.YardSlotDto;
import com.harborflow.yard.service.YardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/yard")
@Tag(name = "Yard", description = "Yard slot management — CRUD + check-in / release workflows")
public class YardController {

    @Autowired
    private YardService service;

    @Operation(summary = "List all yard slots")
    @GetMapping("/slots")
    public List<YardSlotDto> getAll() { return service.findAll(); }

    @Operation(summary = "Get slot by id")
    @GetMapping("/slots/{id}")
    public YardSlotDto getById(@PathVariable Long id) { return service.findById(id); }

    @Operation(summary = "Create a yard slot")
    @PostMapping("/slots")
    public ResponseEntity<YardSlotDto> create(@RequestBody YardSlotDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Update slot")
    @PutMapping("/slots/{id}")
    public YardSlotDto update(@PathVariable Long id, @RequestBody YardSlotDto dto) {
        return service.update(id, dto);
    }

    @Operation(summary = "Delete slot")
    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check-in: place a container into the first available slot")
    @PostMapping("/place")
    public YardSlotDto placeContainer(@RequestBody PlaceContainerRequest request) {
        return service.placeContainer(request);
    }

    @Operation(summary = "Loading/unloading: release the slot holding a container")
    @PostMapping("/release/{containerId}")
    public YardSlotDto releaseContainer(@PathVariable Long containerId) {
        return service.releaseContainer(containerId);
    }
}
