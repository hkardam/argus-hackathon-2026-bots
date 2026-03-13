package com.bots.hackathon.auth.controller;

import com.bots.hackathon.auth.dto.AuthResponse;
import com.bots.hackathon.auth.dto.LoginRequest;
import com.bots.hackathon.auth.dto.RegisterRequest;
import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.auth.service.AuthService;
import jakarta.validation.Valid;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        } else if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else if (principal instanceof String s) {
            email = s;
        }

        if (email == null) {
            email = authentication.getName();
        }

        Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);

        if (userEntityOptional.isPresent()) {
            UserEntity user = userEntityOptional.get();
            UserDto userDto =
                    new UserDto(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getOauth2ProviderId(),
                            user.getRole(),
                            user.getCreatedAt());
            return ResponseEntity.ok(userDto);
        }

        return ResponseEntity.ok(
                new UserDto(null, authentication.getName(), email, null, Role.APPLICANT, null));
    }
}
