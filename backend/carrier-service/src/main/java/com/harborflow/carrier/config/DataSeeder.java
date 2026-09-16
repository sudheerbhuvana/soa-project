package com.harborflow.carrier.config;

import com.harborflow.carrier.entity.Carrier;
import com.harborflow.carrier.repository.CarrierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Configuration
public class DataSeeder {

    @PersistenceContext
    private EntityManager em;

    @Bean
    CommandLineRunner seedCarriers(CarrierRepository repo) {
        return args -> {
            seedOne(repo, em, "Maersk Lines",  "[email protected]",    "maersk-alpha-001");
            seedOne(repo, em, "MSC Shipping",  "[email protected]",    "msc-bravo-002");
            seedOne(repo, em, "CMA CGM",       "[email protected]", "cma-cgm-charlie-003");
            seedOne(repo, em, "Hapag-Lloyd",   "[email protected]",    "hl-delta-004");
        };
    }

    void seedOne(CarrierRepository repo, EntityManager em, String company, String email, String vessel) {
        try {
            // Detach all managed entities so existsByEmail hits the DB, not L1 cache
            em.clear();
            if (!repo.existsByEmail(email)) {
                Carrier c = new Carrier();
                c.setCompanyName(company);
                c.setEmail(email);
                c.setPassword("pass123");
                c.setVesselIdentifier(vessel);
                repo.saveAndFlush(c);
                System.out.println("[DataSeeder] seeded carrier: " + email);
            } else {
                System.out.println("[DataSeeder] carrier exists, skipping: " + email);
            }
        } catch (Exception e) {
            System.err.println("[DataSeeder] FAILED seeding " + email + ": " + e.getMessage());
        }
    }
}
