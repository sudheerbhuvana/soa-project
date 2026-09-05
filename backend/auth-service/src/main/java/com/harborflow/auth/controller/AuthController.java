package com.harborflow.auth.controller;

import com.harborflow.auth.dto.AuthRequest;
import com.harborflow.auth.dto.AuthResponse;
import com.harborflow.auth.dto.RegisterRequest;
import com.harborflow.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "Operator login, registration, JWT issuance")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(summary = "Register a new operator")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Account created"),
                   @ApiResponse(responseCode = "400", description = "Email already registered")})
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Sign in", description = "Returns an HS256 JWT for use against all `/api/**` routes.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "JWT issued"),
                   @ApiResponse(responseCode = "401", description = "Invalid credentials")})
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Health check")
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("auth-service up");
    }
}
