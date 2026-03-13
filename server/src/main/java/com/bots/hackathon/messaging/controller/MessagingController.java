package com.bots.hackathon.messaging.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.messaging.dto.CreateThreadRequest;
import com.bots.hackathon.messaging.dto.MessageResponse;
import com.bots.hackathon.messaging.dto.SendMessageRequest;
import com.bots.hackathon.messaging.dto.ThreadResponse;
import com.bots.hackathon.messaging.service.MessagingService;
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
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessagingController {

    private final MessagingService messagingService;
    private final AuthService authService;

    /** Only staff roles can create internal threads (Applicants are blocked at service level). */
    @PostMapping("/threads")
    @PreAuthorize("@securityGuard.isStaff()")
    public ResponseEntity<ApiResponse<ThreadResponse>> createThread(
            @Valid @RequestBody CreateThreadRequest request, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(messagingService.createThread(request, userId)));
    }

    /** Send a message to an existing thread (staff only). */
    @PostMapping
    @PreAuthorize("@securityGuard.isStaff()")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(messagingService.sendMessage(request, userId)));
    }

    /** Get all messages in a thread — staff only; Applicant view is blocked. */
    @GetMapping("/threads/{threadId}")
    @PreAuthorize("@securityGuard.isStaff()")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getThreadMessages(
            @PathVariable UUID threadId, Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(messagingService.getThreadMessages(threadId, userId)));
    }

    /** Get all threads for a given application (staff only). */
    @GetMapping("/application/{applicationId}/threads")
    @PreAuthorize("@securityGuard.isStaff()")
    public ResponseEntity<ApiResponse<List<ThreadResponse>>> getThreadsByApplication(
            @PathVariable UUID applicationId) {
        return ResponseEntity.ok(
                ApiResponse.ok(messagingService.getThreadsByApplication(applicationId)));
    }
}
