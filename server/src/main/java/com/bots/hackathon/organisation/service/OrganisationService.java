package com.bots.hackathon.organisation.service;

import com.bots.hackathon.audit.aspect.LoggableAction;
import com.bots.hackathon.common.exception.ResourceNotFoundException;
import com.bots.hackathon.organisation.dto.CreateOrganisationRequest;
import com.bots.hackathon.organisation.dto.OrganisationResponse;
import com.bots.hackathon.organisation.dto.UpdateOrganisationRequest;
import com.bots.hackathon.organisation.model.Organisation;
import com.bots.hackathon.organisation.repo.OrganisationRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrganisationService {

  private final OrganisationRepository organisationRepository;

  @Transactional
  @LoggableAction(actionType = "CREATE", objectType = "ORGANISATION")
  public OrganisationResponse create(CreateOrganisationRequest request, Long ownerUserId) {
    Organisation org =
        Organisation.builder()
            .name(request.name())
            .registrationNumber(request.registrationNumber())
            .address(request.address())
            .contactEmail(request.contactEmail())
            .contactPhone(request.contactPhone())
            .ownerUserId(ownerUserId)
            .build();
    return toResponse(organisationRepository.save(org));
  }

  @Transactional
  @LoggableAction(
      actionType = "UPDATE",
      objectType = "ORGANISATION",
      objectIdExpression = "#id.toString()")
  public OrganisationResponse update(UUID id, UpdateOrganisationRequest request) {
    Organisation org =
        organisationRepository
            .findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organisation", id));

    if (request.name() != null) org.setName(request.name());
    if (request.registrationNumber() != null)
      org.setRegistrationNumber(request.registrationNumber());
    if (request.address() != null) org.setAddress(request.address());
    if (request.contactEmail() != null) org.setContactEmail(request.contactEmail());
    if (request.contactPhone() != null) org.setContactPhone(request.contactPhone());

    return toResponse(organisationRepository.save(org));
  }

  @Transactional(readOnly = true)
  public OrganisationResponse getById(UUID id) {
    Organisation org =
        organisationRepository
            .findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("Organisation", id));
    return toResponse(org);
  }

  @Transactional(readOnly = true)
  public List<OrganisationResponse> getByOwnerUserId(Long ownerUserId) {
    return organisationRepository.findByOwnerUserIdAndDeletedFalse(ownerUserId).stream()
        .map(this::toResponse)
        .toList();
  }

  private OrganisationResponse toResponse(Organisation org) {
    return new OrganisationResponse(
        org.getId(),
        org.getName(),
        org.getRegistrationNumber(),
        org.getAddress(),
        org.getContactEmail(),
        org.getContactPhone(),
        org.getOwnerUserId(),
        org.getIsVerified(),
        org.getCreatedAt(),
        org.getUpdatedAt());
  }
}
