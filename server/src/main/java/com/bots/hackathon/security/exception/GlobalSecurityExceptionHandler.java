package com.bots.hackathon.security.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalSecurityExceptionHandler {

  @InitBinder
  public void setAllowedFields(WebDataBinder dataBinder) {
    // Prevent Mass Assignment attacks by restricting allowed fields explicitly in
    // controllers,
    // or by avoiding binding internal fields.
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
  public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
    Map<String, String> body = new HashMap<>();
    body.put("error", "Forbidden");
    body.put(
        "message", "You do not have permission to access this resource or perform this action.");
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<Map<String, String>> handleAuthenticationException(
      AuthenticationException ex) {
    Map<String, String> body = new HashMap<>();
    body.put("error", "Unauthorized");
    body.put("message", "Full authentication is required to access this resource.");
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
  }

  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<Map<String, String>> handleNotFoundExceptions(NoHandlerFoundException ex) {
    Map<String, String> body = new HashMap<>();
    body.put("error", "Not Found");
    body.put("message", ex.getMessage());
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
    Map<String, String> body = new HashMap<>();
    body.put("error", "Internal Server Error");
    body.put("message", "An unexpected error occurred.");
    // Log the actual exception in production
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
