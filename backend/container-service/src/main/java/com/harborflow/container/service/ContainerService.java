package com.harborflow.container.service;

import com.harborflow.container.dto.ContainerDto;
import com.harborflow.container.entity.Container;
import com.harborflow.container.repository.ContainerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContainerService {

    @Autowired
    private ContainerRepository repository;

    public List<ContainerDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ContainerDto findById(Long id) {
        return toDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Container not found: " + id)));
    }

    public ContainerDto create(ContainerDto dto) {
        Container c = new Container();
        BeanUtils.copyProperties(dto, c, "containerId");
        if (c.getCurrentStatus() == null) c.setCurrentStatus("REGISTERED");
        return toDto(repository.save(c));
    }

    public ContainerDto update(Long id, ContainerDto dto) {
        Container c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Container not found"));
        c.setCarrierId(dto.getCarrierId());
        c.setWeight(dto.getWeight());
        c.setCargoType(dto.getCargoType());
        c.setCurrentStatus(dto.getCurrentStatus());
        return toDto(repository.save(c));
    }

    public ContainerDto updateStatus(Long id, String status) {
        Container c = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Container not found"));
        c.setCurrentStatus(status);
        return toDto(repository.save(c));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<ContainerDto> findByCarrierId(Long carrierId) {
        return repository.findByCarrierId(carrierId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private ContainerDto toDto(Container c) {
        ContainerDto d = new ContainerDto();
        BeanUtils.copyProperties(c, d);
        return d;
    }
}
