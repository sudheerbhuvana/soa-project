package com.harborflow.yard.config;

import com.harborflow.yard.entity.YardSlot;
import com.harborflow.yard.repository.YardSlotRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedYard(YardSlotRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                List<YardSlot> slots = new ArrayList<>();
                String[] zones = {"A", "B", "C"};
                for (String zone : zones) {
                    for (int row = 1; row <= 6; row++) {
                        YardSlot s = new YardSlot();
                        s.setZoneCode(zone);
                        s.setRowNumber(row);
                        s.setIsOccupied(false);
                        slots.add(s);
                    }
                }
                repo.saveAll(slots);
            }
        };
    }
}
