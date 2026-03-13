package com.bots.hackathon.auth.service;

public interface TokenService {

    String generateToken(String username, String role);

    String extractUsername(String token);

    String extractRole(String token);

    boolean isTokenExpired(String token);
}
