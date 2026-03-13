package com.bots.hackathon.auth.service;

import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import java.security.Principal;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

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
