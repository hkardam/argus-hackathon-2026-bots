package com.bots.hackathon.notification.controller;

import com.bots.hackathon.auth.service.AuthService;
import com.bots.hackathon.common.dto.ApiResponse;
import com.bots.hackathon.notification.model.Notification;
import com.bots.hackathon.notification.service.NotificationService;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    /** Get all notifications for the current user. */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getNotifications(userId)));
    }

    /** Get only unread notifications. */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnread(Principal principal) {
        Long userId = authService.resolveUserId(principal);
        return ResponseEntity.ok(
                ApiResponse.ok(notificationService.getUnreadNotifications(userId)));
    }

    /** Mark a specific notification as read. */
    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
