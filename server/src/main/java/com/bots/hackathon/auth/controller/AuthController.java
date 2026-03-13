package com.bots.hackathon.auth.controller;

import com.bots.hackathon.auth.dto.AuthResponse;
import com.bots.hackathon.auth.dto.LoginRequest;
import com.bots.hackathon.auth.dto.RegisterRequest;
import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.security.util.JwtUtil;
import jakarta.validation.Valid;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
    }

    UserEntity user = new UserEntity();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(request.role() != null ? request.role() : Role.APPLICANT);

    UserEntity saved = userRepository.save(user);
    String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());

    UserDto userDto =
        new UserDto(
            saved.getId(),
            saved.getName(),
            saved.getEmail(),
            saved.getOauth2ProviderId(),
            saved.getRole(),
            saved.getCreatedAt());

    return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userDto));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    UserEntity user =
        userRepository
            .findByEmail(request.email())
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"));

    if (user.getPasswordHash() == null
        || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

    UserDto userDto =
        new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getOauth2ProviderId(),
            user.getRole(),
            user.getCreatedAt());

    return ResponseEntity.ok(new AuthResponse(token, userDto));
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
