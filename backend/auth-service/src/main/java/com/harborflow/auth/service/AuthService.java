package com.harborflow.auth.service;

import com.harborflow.auth.client.CarrierServiceClient;
import com.harborflow.auth.dto.AuthRequest;
import com.harborflow.auth.dto.AuthResponse;
import com.harborflow.auth.dto.CarrierAuthResponse;
import com.harborflow.auth.dto.RegisterRequest;
import com.harborflow.auth.entity.User;
import com.harborflow.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CarrierServiceClient carrierClient;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        user.setCompanyName(request.getCompanyName());
        user.setRole("ADMIN");
        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    /**
     * Carrier login: credentials live in carrier-service (separate DB).
     * We verify via HTTP and issue a JWT with role=CARRIER.
     */
    public AuthResponse loginCarrier(String email, String password) {
        CarrierAuthResponse carrier = carrierClient.verifyCredentials(email, password);
        if (carrier == null) {
            throw new RuntimeException("Invalid carrier credentials");
        }
        String token = jwtService.generateToken(carrier.getEmail(), "CARRIER");
        return new AuthResponse(token, carrier.getEmail(), "CARRIER");
    }
}
