package com.bots.hackathon.security.guard;

import com.bots.hackathon.auth.model.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("securityGuard")
public class AuthorizationGuard {

    private boolean hasRole(Role role) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;

        for (GrantedAuthority authority : auth.getAuthorities()) {
            if (authority.getAuthority().equals("ROLE_" + role.name())) {
                return true;
            }
        }
        return false;
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;
        return auth.getName();
    }

    /** Checks if the user is a Platform Admin (Full read/sys access, no biz decisions) */
    public boolean isPlatformAdmin() {
        return hasRole(Role.PLATFORM_ADMIN);
    }

    /** Reusable check to allow staff to perform system tasks. */
    public boolean isStaff() {
        return hasRole(Role.PLATFORM_ADMIN)
                || hasRole(Role.PROGRAM_OFFICER)
                || hasRole(Role.FINANCE_OFFICER);
    }

    /**
     * Validates access to a specific Application. Use in
     * controllers: @PreAuthorize("@securityGuard.canAccessApplication(#id)")
     */
    public boolean canAccessApplication(Object applicationId) {
        if (isPlatformAdmin() || hasRole(Role.PROGRAM_OFFICER)) {
            return true;
        }

        String username = getCurrentUsername();
        if (username == null) return false;

        if (hasRole(Role.REVIEWER)) {
            // DB check placeholder: Evaluate if reviewer assignments table contains user for this
            // app
            return true;
        }

        if (hasRole(Role.APPLICANT)) {
            // DB check placeholder: Evaluate if the application belongs to the current applicant
            return true;
        }

        if (hasRole(Role.FINANCE_OFFICER)) {
            // DB check placeholder: Evaluate if the application is in ACTIVE state
            return true;
        }

        return false;
    }

    /** Guards for specific workflow transitions (e.g. approve, reject) */
    public boolean canMakeDecision(Long applicationId) {
        // Only Program Officers can make business decisions (Reject, Confirm Eligible, Approve)
        return hasRole(Role.PROGRAM_OFFICER);
    }

    /**
     * Validates that the reviewer being assigned does NOT have a Conflict of Interest based on
     * matching email domains with the applicant.
     */
    public boolean passesConflictOfInterestCheck(String reviewerEmail, String applicantEmail) {
        if (reviewerEmail == null || applicantEmail == null) return false;

        String reviewerDomain = reviewerEmail.substring(reviewerEmail.indexOf("@") + 1);
        String applicantDomain = applicantEmail.substring(applicantEmail.indexOf("@") + 1);

        return !reviewerDomain.equalsIgnoreCase(applicantDomain);
    }
}
