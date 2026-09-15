package com.harborflow.container.repository;

import com.harborflow.container.entity.Container;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContainerRepository extends JpaRepository<Container, Long> {
    List<Container> findByCarrierId(Long carrierId);
    List<Container> findByCurrentStatus(String status);
}
