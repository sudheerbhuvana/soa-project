package com.harborflow.gate.repository;

import com.harborflow.gate.entity.GateTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GateTransactionRepository extends JpaRepository<GateTransaction, Long> {
    List<GateTransaction> findByContainerId(Long containerId);
}
