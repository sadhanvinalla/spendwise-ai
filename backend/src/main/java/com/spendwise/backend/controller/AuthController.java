package com.spendwise.backend.controller;
import com.spendwise.backend.security.JwtService;
import com.spendwise.backend.dto.LoginRequest;
import com.spendwise.backend.dto.RegisterRequest;
import com.spendwise.backend.entity.User;
import com.spendwise.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
    this.authService = authService;
    this.jwtService = jwtService;
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.register(request);

            return ResponseEntity.ok(Map.of(
                "message", "Registered successfully",
                "userId", user.getId(),
                "email", user.getEmail()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

           String token = jwtService.generateToken(user.getId(), user.getEmail());

return ResponseEntity.ok(Map.of(
    "message", "Login successful",
    "token", token,
    "userId", user.getId(),
    "email", user.getEmail()
));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}