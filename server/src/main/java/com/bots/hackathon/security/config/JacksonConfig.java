package com.bots.hackathon.security.config;

import com.bots.hackathon.security.masking.RoleBasedFieldMaskingFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

  public static final String ROLE_FILTER_ID = "roleBasedFieldFilter";

  @Bean
  public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
    ObjectMapper objectMapper = builder.build();

    // Register the field-level security filter globally
    SimpleFilterProvider filterProvider =
        new SimpleFilterProvider().addFilter(ROLE_FILTER_ID, new RoleBasedFieldMaskingFilter());

    // This makes it so we don't throw an error if a class doesn't have
    // @JsonFilter("roleBasedFieldFilter")
    filterProvider.setFailOnUnknownId(false);

    objectMapper.setFilterProvider(filterProvider);

    return objectMapper;
  }
}
