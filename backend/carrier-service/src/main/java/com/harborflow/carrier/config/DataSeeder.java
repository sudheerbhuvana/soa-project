package com.harborflow.carrier.config;

import com.harborflow.carrier.entity.Carrier;
import com.harborflow.carrier.repository.CarrierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCarriers(CarrierRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.saveAll(Arrays.asList(
                    make("Maersk Lines", "[email protected]", "maersk-alpha-001"),
                    make("MSC Shipping", "[email protected]", "msc-bravo-002"),
                    make("CMA CGM", "[email protected]", "cma-cgm-charlie-003"),
                    make("Hapag-Lloyd", "[email protected]", "hl-delta-004")
                ));
            }
        };
    }

    private Carrier make(String company, String email, String vessel) {
        Carrier c = new Carrier();
        c.setCompanyName(company);
        c.setEmail(email);
        c.setPassword("pass123");
        c.setVesselIdentifier(vessel);
        return c;
    }
}
