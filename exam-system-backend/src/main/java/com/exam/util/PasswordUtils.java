package com.exam.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtils {
    
    // Hash a password for the first time
    public static String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }

    // Check that a plain text password matches a previously hashed one
    public static boolean checkPassword(String plainTextPassword, String hashedPassword) {
        if (hashedPassword == null || !hashedPassword.startsWith("$2a$")) {
            return false;
        }
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}
