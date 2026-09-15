package com.harborflow.carrier.repository;

import com.harborflow.carrier.entity.Carrier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CarrierRepository extends JpaRepository<Carrier, Long> {
    Optional<Carrier> findByEmail(String email);
    boolean existsByEmail(String email);
}
