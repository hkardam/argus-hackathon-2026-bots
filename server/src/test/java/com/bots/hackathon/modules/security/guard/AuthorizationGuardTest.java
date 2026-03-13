package com.bots.hackathon.modules.security.guard;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bots.hackathon.security.guard.AuthorizationGuard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AuthorizationGuardTest {

  private AuthorizationGuard guard;

  @BeforeEach
  void setUp() {
    guard = new AuthorizationGuard();
  }

  @Test
  void testConflictOfInterestCheck() {
    // Different domains -> Pass
    assertTrue(
        guard.passesConflictOfInterestCheck("reviewer@university.edu", "applicant@startup.com"));

    // Same domain -> Fail
    assertFalse(
        guard.passesConflictOfInterestCheck("reviewer@company.com", "applicant@company.com"));

    // Null checks -> Fail securely
    assertFalse(guard.passesConflictOfInterestCheck(null, "applicant@company.com"));
    assertFalse(guard.passesConflictOfInterestCheck("reviewer@company.com", null));
  }
}
