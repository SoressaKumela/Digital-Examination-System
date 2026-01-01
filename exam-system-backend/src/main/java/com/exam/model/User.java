package com.exam.model;

import org.bson.types.ObjectId;

public class User {
    private transient ObjectId id; // MongoDB internal ID - transient to exclude from Gson
    private int userId;  // Public ID for frontend compatibility
    private String fullName;
    private String email;
    private String password; // Hashed password
    private String role;     // ADMIN, TEACHER, STUDENT
    private String createdAt;

    public User() {}

    public User(int userId, String fullName, String email, String password, String role, String createdAt) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
