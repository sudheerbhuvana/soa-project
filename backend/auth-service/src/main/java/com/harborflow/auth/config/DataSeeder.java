package com.harborflow.auth.config;

import com.harborflow.auth.entity.User;
import com.harborflow.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            seedIfMissing(repo, encoder,
                "[email protected]",
                "sudheer",
                "HarborFlow Admin",
                "ADMIN");
        };
    }

    private void seedIfMissing(UserRepository repo, PasswordEncoder encoder,
                               String email, String rawPassword, String company, String role) {
        if (!repo.existsByEmail(email)) {
            User u = new User();
            u.setEmail(email);
            u.setPassword(encoder.encode(rawPassword));
            u.setCompanyName(company);
            u.setRole(role);
            repo.save(u);
            System.out.println("[DataSeeder] seeded admin: " + email);
        }
    }
}
