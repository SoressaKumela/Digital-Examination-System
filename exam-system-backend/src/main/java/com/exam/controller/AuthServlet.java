package com.exam.controller;

import com.exam.model.User;
import com.exam.service.AuthService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;

@WebServlet("/api/auth/*")
public class AuthServlet extends HttpServlet {
    
    private final AuthService authService = new AuthService();
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");
        
        // Read JSON body
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = req.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String jsonBody = buffer.toString();

        try {
            if ("/login".equals(pathInfo)) {
                handleLogin(jsonBody, resp);
            } else if ("/register".equals(pathInfo)) {
                handleRegister(jsonBody, resp);
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    private void handleLogin(String jsonBody, HttpServletResponse resp) throws IOException {
        JsonObject jsonObject = JsonParser.parseString(jsonBody).getAsJsonObject();
        String email = jsonObject.get("email").getAsString();
        String password = jsonObject.get("password").getAsString();

        User user = authService.login(email, password);

        if (user != null) {
            // Create a simple token (in production use JWT)
            String token = "mock-jwt-token-" + user.getUserId() + "-" + System.currentTimeMillis();
            
            JsonObject response = new JsonObject();
            response.addProperty("token", token);
            response.add("user", gson.toJsonTree(user));
            
            resp.getWriter().write(gson.toJson(response));
        } else {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("{\"error\": \"Invalid email or password\"}");
        }
    }

    private void handleRegister(String jsonBody, HttpServletResponse resp) throws IOException {
        User newUser = gson.fromJson(jsonBody, User.class);
        
        try {
            User createdUser = authService.register(newUser);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(createdUser));
        } catch (RuntimeException e) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
