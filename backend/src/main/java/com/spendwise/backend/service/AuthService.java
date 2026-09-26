package com.spendwise.backend.service;
import com.spendwise.backend.security.JwtService;
import com.spendwise.backend.dto.LoginRequest;
import com.spendwise.backend.dto.RegisterRequest;
import com.spendwise.backend.entity.User;
import com.spendwise.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }
}