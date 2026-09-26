package com.spendwise.backend.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private final JwtService jwtService =
            new JwtService("SpendWiseSecretKeyForJWTAuthentication2026Secure", 86_400_000);

    @Test
    void generatedTokenContainsUserDetails() {
        String token = jwtService.generateToken(42L, "student@example.com");

        assertTrue(jwtService.isTokenValid(token));
        assertEquals("student@example.com", jwtService.extractEmail(token));
        assertEquals(42L, jwtService.extractUserId(token));
    }

    @Test
    void invalidTokenIsRejected() {
        assertFalse(jwtService.isTokenValid("not-a-valid-token"));
    }
}
