package com.harborflow.carrier.controller;

import com.harborflow.carrier.dto.CarrierDto;
import com.harborflow.carrier.service.CarrierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/carriers")
@Tag(name = "Carriers", description = "Shipping line registry — CRUD")
public class CarrierController {

    @Autowired
    private CarrierService service;

    @Operation(summary = "List all carriers")
    @GetMapping
    public List<CarrierDto> getAll() { return service.findAll(); }

    @Operation(summary = "Get carrier by id")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Found"),
                   @ApiResponse(responseCode = "404", description = "Carrier not found")})
    @GetMapping("/{id}")
    public CarrierDto getById(@PathVariable Long id) { return service.findById(id); }

    @Operation(summary = "Register a new carrier")
    @PostMapping
    public ResponseEntity<CarrierDto> create(@RequestBody CarrierDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @Operation(summary = "Update carrier")
    @PutMapping("/{id}")
    public CarrierDto update(@PathVariable Long id, @RequestBody CarrierDto dto) {
        return service.update(id, dto);
    }

    @Operation(summary = "Delete carrier")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
