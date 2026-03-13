package com.bots.hackathon.security.crypto;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AesEncryptionUtil {

  private final String initVector =
      "encryptionIntVec"; // Expected 16 bytes for AES/CBC/PKCS5PADDING
  private final String key;

  public AesEncryptionUtil(
      @Value("${security.encryption.key:default1234567890123456789012345}") String key) {
    // Enforce 32 bytes for AES-256
    if (key.length() != 32) {
      throw new IllegalArgumentException(
          "Encryption key must be exactly 32 characters for AES-256");
    }
    this.key = key;
  }

  public String encrypt(String value) {
    if (value == null) return null;
    try {
      IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
      SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

      Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
      cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

      byte[] encrypted = cipher.doFinal(value.getBytes());
      return Base64.getEncoder().encodeToString(encrypted);
    } catch (Exception ex) {
      throw new RuntimeException("Error while encrypting data", ex);
    }
  }

  public String decrypt(String encrypted) {
    if (encrypted == null) return null;
    try {
      IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
      SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

      Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
      cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

      byte[] original = cipher.doFinal(Base64.getDecoder().decode(encrypted));
      return new String(original);
    } catch (Exception ex) {
      throw new RuntimeException("Error while decrypting data", ex);
    }
  }
}
