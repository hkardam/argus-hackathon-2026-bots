package com.bots.hackathon.security.masking;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Annotation used to mark fields that should be dynamically masked based on role. */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MaskIfRole {
    /** Comma separated list of roles that WILL NOT see this field. e.g., "APPLICANT,REVIEWER" */
    String restrictedRoles();
}
