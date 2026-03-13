package com.bots.hackathon.auth.service;

import com.bots.hackathon.auth.dto.AdminUserRequest;
import com.bots.hackathon.auth.dto.UserDto;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserDto createUser(AdminUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        UserEntity user = new UserEntity();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setIsEmailVerified(true);
        user.setIsActive(true);

        UserEntity saved = userRepository.save(user);
        return authService.toDto(saved);
    }

    public void deactivateUser(Long id) {
        UserEntity user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "User not found"));

        user.setIsActive(false);
        userRepository.save(user);
    }
}
