package com.harborflow.yard.config;

import com.harborflow.yard.entity.YardSlot;
import com.harborflow.yard.repository.YardSlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedYard(YardSlotRepository repo) {
        return args -> {
            String[] zones = {"A", "B", "C"};
            for (String zone : zones) {
                for (int row = 1; row <= 6; row++) {
                    final String fZone = zone;
                    final int fRow = row;
                    boolean already = repo.findAll().stream()
                        .anyMatch(s -> fZone.equals(s.getZoneCode()) && fRow == s.getRowNumber());
                    if (!already) {
                        YardSlot s = new YardSlot();
                        s.setZoneCode(fZone);
                        s.setRowNumber(fRow);
                        s.setIsOccupied(false);
                        repo.save(s);
                    }
                }
            }
        };
    }
}
