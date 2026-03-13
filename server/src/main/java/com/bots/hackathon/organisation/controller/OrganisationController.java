package com.bots.hackathon.organisation.controller;

import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.organisation.dto.CreateOrganisationRequest;
import com.bots.hackathon.organisation.dto.OrganisationResponse;
import com.bots.hackathon.organisation.dto.UpdateOrganisationRequest;
import com.bots.hackathon.organisation.service.OrganisationService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organisations")
@RequiredArgsConstructor
public class OrganisationController {

  private final OrganisationService organisationService;
  private final UserRepository userRepository;

  @PostMapping
  @PreAuthorize("hasRole('APPLICANT') or @securityGuard.isStaff()")
  public ResponseEntity<ApiResponse<OrganisationResponse>> create(
      @Valid @RequestBody CreateOrganisationRequest request, Principal principal) {
    Long userId = resolveUserId(principal);
    OrganisationResponse response = organisationService.create(request, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('APPLICANT') or @securityGuard.isStaff()")
  public ResponseEntity<ApiResponse<OrganisationResponse>> update(
      @PathVariable UUID id, @Valid @RequestBody UpdateOrganisationRequest request) {
    // TODO: Verify current user owns this organisation or is staff
    return ResponseEntity.ok(ApiResponse.ok(organisationService.update(id, request)));
  }

  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<OrganisationResponse>> getById(@PathVariable UUID id) {
    return ResponseEntity.ok(ApiResponse.ok(organisationService.getById(id)));
  }

  @GetMapping("/me")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<List<OrganisationResponse>>> getCurrentUserOrganisations(
      Principal principal) {
    Long userId = resolveUserId(principal);
    return ResponseEntity.ok(ApiResponse.ok(organisationService.getByOwnerUserId(userId)));
  }

  private Long resolveUserId(Principal principal) {
    return userRepository
        .findByEmail(principal.getName())
        .map(UserEntity::getId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));
  }
}
