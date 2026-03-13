package com.bots.hackathon.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();
    private static final long TIME_WINDOW_MS = 60000; // 1 minute
    private static final int MAX_REQUESTS = 100;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Basic rate limiting by IP
        String clientIp = request.getRemoteAddr();

        RequestCounter counter =
                requestCounts.compute(
                        clientIp,
                        (key, value) -> {
                            long now = System.currentTimeMillis();
                            if (value == null || (now - value.timestamp) > TIME_WINDOW_MS) {
                                return new RequestCounter(1, now);
                            }
                            value.count++;
                            return value;
                        });

        if (counter.count > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Rate limit exceeded. Please try again later.");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private static class RequestCounter {
        int count;
        long timestamp;

        RequestCounter(int count, long timestamp) {
            this.count = count;
            this.timestamp = timestamp;
        }
    }
}
