package com.bots.hackathon.modules.security.crypto;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bots.hackathon.security.crypto.AesEncryptionUtil;
import org.junit.jupiter.api.Test;

class AesEncryptionUtilTest {

  private final String testKey = "12345678901234567890123456789012"; // 32 chars
  private final AesEncryptionUtil util = new AesEncryptionUtil(testKey);

  @Test
  void testEncryptionAndDecryption() {
    String originalText = "Sensitive Data 123!";

    String encrypted = util.encrypt(originalText);
    assertNotNull(encrypted);
    assertNotEquals(originalText, encrypted);

    String decrypted = util.decrypt(encrypted);
    assertEquals(originalText, decrypted);
  }

  @Test
  void testInvalidKeyLength() {
    assertThrows(IllegalArgumentException.class, () -> new AesEncryptionUtil("shortkey"));
  }

  @Test
  void testNullInputs() {
    assertEquals(null, util.encrypt(null));
    assertEquals(null, util.decrypt(null));
  }
}
