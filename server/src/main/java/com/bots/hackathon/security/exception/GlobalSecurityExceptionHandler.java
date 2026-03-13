package com.bots.hackathon.security.exception;

import com.bots.hackathon.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class GlobalSecurityExceptionHandler {

  @InitBinder
  public void setAllowedFields(WebDataBinder dataBinder) {
    // Prevent Mass Assignment attacks by restricting allowed fields explicitly in controllers, or by avoiding binding internal fields.
    // A generic protective approach:
    String[] disallowedFields =
        new String[] {"id", "createdAt", "updatedAt", "role", "passwordHash"};
    dataBinder.setDisallowedFields(disallowedFields);
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, String>> handleResponseStatusException(
      ResponseStatusException ex) {
    Map<String, String> body = new HashMap<>();
    String reason = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
    body.put("error", reason);
    body.put("message", reason);
    return ResponseEntity.status(ex.getStatusCode()).body(body);
  }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("You do not have permission to access this resource."));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(
            AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Authentication required to access this resource."));
    }
}
