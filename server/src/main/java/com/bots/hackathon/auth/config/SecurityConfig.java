package com.bots.hackathon.auth.config;

import com.bots.hackathon.security.exception.SecurityAccessDeniedHandler;
import com.bots.hackathon.security.exception.SecurityAuthenticationEntryPoint;
import com.bots.hackathon.security.filter.JwtAuthenticationFilter;
import com.bots.hackathon.security.filter.RateLimitingFilter;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final SecurityAuthenticationEntryPoint authenticationEntryPoint;
    private final SecurityAccessDeniedHandler accessDeniedHandler;

    private static final List<String> PUBLIC_ENDPOINTS =
            List.of(
                    "/api/auth/login",
                    "/api/auth/oauth2/**",
                    "/ai/auth/health",
                    "/api/programmes/**");

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Disabled for stateless APIs
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authorize ->
                                authorize
                                        // Allow unauthenticated access to public endpoints (if
                                        // any)
                                        .requestMatchers(
                                                "/api/auth/login",
                                                "/api/auth/signup",
                                                "/api/programmes/**",
                                                "/api/auth/oauth2/**")
                                        .permitAll()
                                        .requestMatchers("/api/admin/**")
                                        .hasRole("PLATFORM_ADMIN")
                                        .anyRequest()
                                        .authenticated())
                .httpBasic(basic -> basic.disable())
                // Add custom filters before the UsernamePasswordAuthenticationFilter
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:3000", "http://localhost:5174", "http://localhost:8086"));
        configuration.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
