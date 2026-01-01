package com.exam.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/api/*")
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String path = httpRequest.getPathInfo();
        String requestURI = httpRequest.getRequestURI();
        // Allow OPTIONS requests for CORS preflight
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        // Allow public endpoints (Login/Register)
        // Note: requestURI includes context path (e.g. /exam-system/api/auth/...)
        if (requestURI.contains("/api/auth/")) {
            chain.doFilter(request, response);
            return;
        }

        // Check for Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Simple validation: check if it's our mock token format
            // In production, you would verify the JWT signature here
            if (token.startsWith("mock-jwt-token-")) {
                chain.doFilter(request, response);
                return;
            }
        }

        // If we get here, the user is not authorized
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.getWriter().write("{\"error\": \"Unauthorized access\"}");
    }
}
