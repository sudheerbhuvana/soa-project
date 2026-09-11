package com.harborflow.yard.service;

import com.harborflow.yard.dto.PlaceContainerRequest;
import com.harborflow.yard.dto.YardSlotDto;
import com.harborflow.yard.entity.YardSlot;
import com.harborflow.yard.repository.YardSlotRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class YardService {

    @Autowired
    private YardSlotRepository repository;

    public List<YardSlotDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public YardSlotDto findById(Long id) {
        return toDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yard slot not found: " + id)));
    }

    public YardSlotDto create(YardSlotDto dto) {
        YardSlot s = new YardSlot();
        BeanUtils.copyProperties(dto, s, "slotId");
        if (s.getIsOccupied() == null) s.setIsOccupied(false);
        return toDto(repository.save(s));
    }

    public YardSlotDto update(Long id, YardSlotDto dto) {
        YardSlot s = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yard slot not found"));
        s.setZoneCode(dto.getZoneCode());
        s.setRowNumber(dto.getRowNumber());
        s.setIsOccupied(dto.getIsOccupied());
        s.setContainerId(dto.getContainerId());
        return toDto(repository.save(s));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public YardSlotDto placeContainer(PlaceContainerRequest request) {
        YardSlot slot = repository.findFirstByIsOccupiedFalseOrderBySlotIdAsc()
                .orElseThrow(() -> new RuntimeException("No empty yard slots available"));
        slot.setIsOccupied(true);
        slot.setContainerId(request.getContainerId());
        if (request.getZoneCode() != null && !request.getZoneCode().isEmpty()) {
            slot.setZoneCode(request.getZoneCode());
        }
        return toDto(repository.save(slot));
    }

    public YardSlotDto releaseContainer(Long containerId) {
        YardSlot slot = repository.findByContainerId(containerId)
                .orElseThrow(() -> new RuntimeException("No slot holds container: " + containerId));
        slot.setIsOccupied(false);
        slot.setContainerId(null);
        return toDto(repository.save(slot));
    }

    private YardSlotDto toDto(YardSlot s) {
        YardSlotDto d = new YardSlotDto();
        BeanUtils.copyProperties(s, d);
        return d;
    }
}
