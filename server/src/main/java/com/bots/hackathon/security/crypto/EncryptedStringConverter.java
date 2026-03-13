package com.bots.hackathon.security.crypto;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Autowired;

@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

  @Autowired private AesEncryptionUtil encryptionUtil;

  @Override
  public String convertToDatabaseColumn(String attribute) {
    if (attribute == null) {
      return null;
    }
    // Fallback or static injection can be tricky in older versions, but spring boot automatically
    // wires Beans that implement AttributeConverter
    if (encryptionUtil != null) {
      return encryptionUtil.encrypt(attribute);
    }
    return attribute; // If not wired, fallback safely (unit test case scenario)
  }

  @Override
  public String convertToEntityAttribute(String dbData) {
    if (dbData == null) {
      return null;
    }
    if (encryptionUtil != null) {
      return encryptionUtil.decrypt(dbData);
    }
    return dbData;
  }
}
