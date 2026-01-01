package com.exam.service;

import com.exam.dao.UserDao;
import com.exam.model.User;
import com.exam.util.PasswordUtils;

public class AuthService {
    private final UserDao userDao;

    public AuthService() {
        this.userDao = new UserDao();
    }

    public User login(String email, String password) {
        User user = userDao.findByEmail(email);
        
        if (user != null && PasswordUtils.checkPassword(password, user.getPassword())) {
            // Remove password before returning to controller/frontend
            user.setPassword(null);
            return user;
        }
        
        return null;
    }

    public User register(User user) {
        // Check if user already exists
        if (userDao.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("User with this email already exists");
        }

        // Hash the password
        String hashedPassword = PasswordUtils.hashPassword(user.getPassword());
        user.setPassword(hashedPassword);

        // Save to DB
        userDao.createUser(user);
        
        // Return user without password
        user.setPassword(null);
        return user;
    }
}
