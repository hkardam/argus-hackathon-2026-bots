package com.bots.hackathon.security.masking;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.PropertyWriter;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import java.util.Arrays;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Jackson property filter that reads @MaskIfRole on DTO properties and omits them from JSON
 * serialization if the currently authenticated user's role is in the restricted list.
 */
public class RoleBasedFieldMaskingFilter extends SimpleBeanPropertyFilter {

    @Override
    public void serializeAsField(
            Object pojo, JsonGenerator jgen, SerializerProvider provider, PropertyWriter writer)
            throws Exception {
        if (include(writer)) {
            MaskIfRole maskAnnotation = writer.getAnnotation(MaskIfRole.class);
            if (maskAnnotation != null) {
                String currentRole = getCurrentRole();
                String[] restrictedRoles = maskAnnotation.restrictedRoles().split(",");
                boolean isRestricted =
                        Arrays.stream(restrictedRoles)
                                .map(String::trim)
                                .anyMatch(role -> role.equalsIgnoreCase(currentRole));

                if (isRestricted) {
                    // Skip serializing this field entirely
                    return;
                }
            }
            writer.serializeAsField(pojo, jgen, provider);
        } else if (!jgen.canOmitFields()) {
            writer.serializeAsOmittedField(pojo, jgen, provider);
        }
    }

    private String getCurrentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            for (GrantedAuthority authority : auth.getAuthorities()) {
                if (authority.getAuthority().startsWith("ROLE_")) {
                    return authority.getAuthority().substring(5);
                }
            }
        }
        return "UNKNOWN";
    }
}
