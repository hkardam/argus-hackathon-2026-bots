package com.bots.hackathon.common.exception;

public class DuplicateRegistrationException extends RuntimeException {

  public DuplicateRegistrationException(String message) {
    super(message);
  }
}
