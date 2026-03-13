package com.bots.hackathon.audit.aspect;

import com.bots.hackathon.audit.model.AuditLogEntity;
import com.bots.hackathon.audit.repo.AuditLogRepository;
import com.bots.hackathon.auth.model.UserEntity;
import com.bots.hackathon.auth.repo.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final ExpressionParser parser = new SpelExpressionParser();

    @AfterReturning(value = "@annotation(loggableAction)", returning = "result")
    public void logAuditActivity(
            JoinPoint joinPoint, LoggableAction loggableAction, Object result) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = null;
            String role = "SYSTEM";
            Long actorId = null;

            if (authentication != null && authentication.isAuthenticated()) {
                username = authentication.getName();
                role =
                        authentication.getAuthorities().isEmpty()
                                ? role
                                : authentication.getAuthorities().iterator().next().getAuthority();

                // Extremely simplified lookup for actorId since we must parse JWT details without
                // bloat
                // In production, actorId could be extracted as a direct JWT claim instead of
                // hitting DB.
                if (username != null && !username.equals("anonymousUser")) {
                    UserEntity user = userRepository.findByEmail(username).orElse(null);
                    if (user != null) {
                        actorId = user.getId();
                    }
                }
            }

            String objectId = parseExpression(loggableAction.objectIdExpression(), joinPoint);
            String metadataJson = buildMetadata(joinPoint, result);

            AuditLogEntity logEntry =
                    AuditLogEntity.builder()
                            .actorId(actorId)
                            .role(role.replace("ROLE_", ""))
                            .actionType(loggableAction.actionType())
                            .objectType(loggableAction.objectType())
                            .objectId(objectId)
                            .metadataJson(metadataJson)
                            .build();

            auditLogRepository.save(logEntry);

        } catch (Exception e) {
            log.error("Failed to write audit log entry!", e);
        }
    }

    private String parseExpression(String expression, JoinPoint joinPoint) {
        if (expression == null || expression.isEmpty()) {
            return null;
        }
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] paramNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        EvaluationContext context = new StandardEvaluationContext();
        for (int i = 0; i < args.length; i++) {
            context.setVariable(paramNames[i], args[i]);
        }

        try {
            return parser.parseExpression(expression).getValue(context, String.class);
        } catch (Exception e) {
            return "PARSE_ERROR";
        }
    }

    private String buildMetadata(JoinPoint joinPoint, Object result)
            throws JsonProcessingException {
        Map<String, Object> meta = new HashMap<>();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        meta.put("method", signature.getName());
        return objectMapper.writeValueAsString(meta);
    }
}
