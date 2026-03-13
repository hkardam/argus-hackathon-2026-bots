package com.bots.hackathon.auth.controller;

import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.Role;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final UserRepository userRepository;

  @GetMapping("/me")
  public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(401).build();
    }

    String email = null;
    Object principal = authentication.getPrincipal();

    if (principal instanceof OAuth2User) {
      OAuth2User oauth2User = (OAuth2User) principal;
      email = oauth2User.getAttribute("email");
    } else if (principal instanceof UserDetails) {
      UserDetails userDetails = (UserDetails) principal;
      email = userDetails.getUsername(); // Basic auth generic user
    } else if (principal instanceof String) {
      email = (String) principal;
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

    // For the in-memory basic auth user, it won't be in the DB initially
    return ResponseEntity.ok(
        new UserDto(null, authentication.getName(), email, null, Role.APPLICANT, null));
  }
}
