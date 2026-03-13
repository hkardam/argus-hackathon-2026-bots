package com.bots.hackathon.audit.aspect;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** Annotation to automatically trace method calls into the audit_logs table. */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LoggableAction {
    String actionType();

    String objectType() default "SYSTEM";

    // SpEL expressing evaluating arguments to determine the Object ID.
    // Examples: "#id", "#dto.applicationId"
    String objectIdExpression() default "";
}
