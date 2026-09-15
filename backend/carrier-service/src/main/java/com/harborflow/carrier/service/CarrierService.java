package com.harborflow.carrier.service;

import com.harborflow.carrier.dto.CarrierDto;
import com.harborflow.carrier.entity.Carrier;
import com.harborflow.carrier.repository.CarrierRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarrierService {

    @Autowired
    private CarrierRepository repository;

    public List<CarrierDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public CarrierDto findById(Long id) {
        return repository.findById(id).map(this::toDto)
                .orElseThrow(() -> new RuntimeException("Carrier not found: " + id));
    }

    public CarrierDto create(CarrierDto dto) {
        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        Carrier c = new Carrier();
        BeanUtils.copyProperties(dto, c, "carrierId");
        return toDto(repository.save(c));
    }

    public CarrierDto update(Long id, CarrierDto dto) {
        Carrier c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carrier not found"));
        c.setCompanyName(dto.getCompanyName());
        c.setEmail(dto.getEmail());
        c.setVesselIdentifier(dto.getVesselIdentifier());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            c.setPassword(dto.getPassword());
        }
        return toDto(repository.save(c));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private CarrierDto toDto(Carrier c) {
        CarrierDto d = new CarrierDto();
        BeanUtils.copyProperties(c, d);
        d.setPassword(null);
        return d;
    }
}
