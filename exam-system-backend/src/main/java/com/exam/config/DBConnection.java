package com.exam.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DBConnection {
    private static MongoClient mongoClient;
    private static MongoDatabase database;
    
    private static String connectionString;
    private static String dbName;

    static {
        try (InputStream input = DBConnection.class.getClassLoader().getResourceAsStream("application.properties")) {
            Properties prop = new Properties();
            if (input == null) {
                System.out.println("Sorry, unable to find application.properties");
                // Fallback defaults
                connectionString = "mongodb://localhost:27017";
                dbName = "exam_system_db";
            } else {
                prop.load(input);
                connectionString = prop.getProperty("mongodb.uri");
                dbName = prop.getProperty("mongodb.db");
            }
        } catch (IOException ex) {
            ex.printStackTrace();
            // Fallback defaults
            connectionString = "mongodb://localhost:27017";
            dbName = "exam_system_db";
        }
    }

    private DBConnection() {}

    public static MongoDatabase getDatabase() {
        if (database == null) {
            try {
                mongoClient = MongoClients.create(connectionString);
                database = mongoClient.getDatabase(dbName);
                System.out.println("Connected to MongoDB successfully");
            } catch (Exception e) {
                System.err.println("Error connecting to MongoDB: " + e.getMessage());
                throw e;
            }
        }
        return database;
    }

    public static void close() {
        if (mongoClient != null) {
            mongoClient.close();
            mongoClient = null;
            database = null;
        }
    }
}
