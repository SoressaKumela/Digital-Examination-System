package com.exam.dao;

import com.exam.config.DBConnection;
import com.exam.model.User;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class UserDao {
    private final MongoCollection<Document> collection;

    public UserDao() {
        MongoDatabase database = DBConnection.getDatabase();
        this.collection = database.getCollection("users");
    }

    public User findByEmail(String email) {
        Document doc = collection.find(Filters.eq("email", email)).first();
        return doc != null ? mapToUser(doc) : null;
    }

    public User findById(int userId) {
        Document doc = collection.find(Filters.eq("userId", userId)).first();
        return doc != null ? mapToUser(doc) : null;
    }

    public void createUser(User user) {
        // Auto-increment userId logic (simple version)
        if (user.getUserId() == 0) {
            user.setUserId(getNextUserId());
        }
        
        Document doc = new Document("userId", user.getUserId())
                .append("fullName", user.getFullName())
                .append("email", user.getEmail())
                .append("password", user.getPassword())
                .append("role", user.getRole())
                .append("createdAt", user.getCreatedAt());
        
        collection.insertOne(doc);
        user.setId(doc.getObjectId("_id"));
    }

    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        for (Document doc : collection.find()) {
            users.add(mapToUser(doc));
        }
        return users;
    }

    public void updateUser(User user) {
        Document doc = new Document("fullName", user.getFullName())
                .append("email", user.getEmail())
                .append("role", user.getRole());
        
        // Only update password if it's provided (and not null/empty)
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            doc.append("password", user.getPassword());
        }
        
        collection.updateOne(Filters.eq("userId", user.getUserId()), new Document("$set", doc));
    }

    public void deleteUser(int userId) {
        collection.deleteOne(Filters.eq("userId", userId));
    }

    private int getNextUserId() {
        Document lastUser = collection.find().sort(Sorts.descending("userId")).first();
        return lastUser != null ? lastUser.getInteger("userId") + 1 : 1;
    }

    private User mapToUser(Document doc) {
        User user = new User();
        user.setId(doc.getObjectId("_id"));
        user.setUserId(doc.getInteger("userId"));
        user.setFullName(doc.getString("fullName"));
        user.setEmail(doc.getString("email"));
        user.setPassword(doc.getString("password"));
        user.setRole(doc.getString("role"));
        user.setCreatedAt(doc.getString("createdAt"));
        return user;
    }
}
