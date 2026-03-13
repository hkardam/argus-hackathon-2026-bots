package com.bots.hackathon.auth.service;

import com.bots.hackathon.auth.dto.AuthResponse;
import com.bots.hackathon.auth.dto.LoginRequest;
import com.bots.hackathon.auth.dto.RegisterRequest;
import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.security.util.JwtUtil;
import java.security.Principal;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null ? request.role() : Role.APPLICANT);
        user.setIsEmailVerified(false);
        user.setIsActive(true);

        UserEntity saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());

        return new AuthResponse(token, toDto(saved));
    }

    public AuthResponse login(LoginRequest request) {
        UserEntity user =
                userRepository
                        .findByEmail(request.email())
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "Invalid email or password"));

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account deactivated");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse(token, toDto(user));
    }

    public UserEntity getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user in security context");
        }
        String email = extractEmail(auth);
        return userRepository
                .findByEmail(email)
                .orElseThrow(
                        () ->
                                new IllegalStateException(
                                        "Authenticated user not found in database"));
    }

    public Optional<UserEntity> findCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(extractEmail(auth));
    }

    public Long resolveUserId(Principal principal) {
        return userRepository
                .findByEmail(principal.getName())
                .map(UserEntity::getId)
                .orElseThrow(
                        () ->
                                new IllegalArgumentException(
                                        "User not found: " + principal.getName()));
    }

    public UserDto toDto(UserEntity user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getOauth2ProviderId(),
                user.getRole(),
                user.getCreatedAt());
    }

    public UserDto getCurrentUserDto() {
        return toDto(getCurrentUser());
    }

    private String extractEmail(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oauth2User) {
            String email = oauth2User.getAttribute("email");
            if (email != null) {
                return email;
            }
        }
        return authentication.getName();
    }
}
