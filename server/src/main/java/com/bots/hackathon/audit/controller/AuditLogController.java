package com.bots.hackathon.audit.controller;

import com.bots.hackathon.audit.model.AuditLogEntity;
import com.bots.hackathon.audit.repo.AuditLogRepository;
import com.bots.hackathon.common.dto.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Read-only audit log access, restricted to PLATFORM_ADMIN only. Audit logs are immutable by design
 * - no write endpoints.
 */
@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    /** Full audit trail - admin only. Optionally filter by objectType / objectId. */
    @GetMapping
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogEntity>>> getAll(
            @RequestParam(required = false) String objectType,
            @RequestParam(required = false) String objectId) {

        List<AuditLogEntity> logs;
        if (objectType != null && objectId != null) {
            logs =
                    auditLogRepository.findByObjectTypeAndObjectIdOrderByTimestampDesc(
                            objectType, objectId);
        } else {
            logs = auditLogRepository.findAllByOrderByTimestampDesc();
        }
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }

    /** Get audit history for a specific actor/user. */
    @GetMapping("/actor/{actorId}")
    @PreAuthorize("hasRole('PLATFORM_ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogEntity>>> getByActor(
            @PathVariable Long actorId) {
        return ResponseEntity.ok(
                ApiResponse.ok(auditLogRepository.findByActorIdOrderByTimestampDesc(actorId)));
    }
}
