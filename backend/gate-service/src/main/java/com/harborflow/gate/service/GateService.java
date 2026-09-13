package com.harborflow.gate.service;

import com.harborflow.gate.dto.GateTransactionDto;
import com.harborflow.gate.entity.GateTransaction;
import com.harborflow.gate.repository.GateTransactionRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GateService {

    @Autowired
    private GateTransactionRepository repository;

    public List<GateTransactionDto> findAll() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public GateTransactionDto findById(Long id) {
        return toDto(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found: " + id)));
    }

    public GateTransactionDto create(GateTransactionDto dto) {
        GateTransaction t = new GateTransaction();
        BeanUtils.copyProperties(dto, t, "gateTransactionId");
        if (t.getTimestamp() == null) t.setTimestamp(LocalDateTime.now());
        return toDto(repository.save(t));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<GateTransactionDto> findByContainerId(Long containerId) {
        return repository.findByContainerId(containerId).stream().map(this::toDto).collect(Collectors.toList());
    }

    private GateTransactionDto toDto(GateTransaction t) {
        GateTransactionDto d = new GateTransactionDto();
        BeanUtils.copyProperties(t, d);
        return d;
    }
}
