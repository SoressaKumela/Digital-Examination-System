package com.exam.controller;

import com.exam.dao.ExamDao;
import com.exam.dao.QuestionDao;
import com.exam.dao.UserDao;
import com.exam.model.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/admin/*")
public class AdminServlet extends HttpServlet {
    
    private final UserDao userDao = new UserDao();
    private final ExamDao examDao = new ExamDao();
    private final QuestionDao questionDao = new QuestionDao();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if ("/stats".equals(pathInfo)) {
            List<User> users = userDao.findAll();
            
            JsonObject stats = new JsonObject();
            stats.addProperty("totalStudents", users.stream().filter(u -> "STUDENT".equals(u.getRole())).count());
            stats.addProperty("totalTeachers", users.stream().filter(u -> "TEACHER".equals(u.getRole())).count());
            stats.addProperty("totalExams", examDao.findAll().size());
            stats.addProperty("totalQuestions", questionDao.findAll().size());
            
            resp.getWriter().write(gson.toJson(stats));
            
        } else if ("/users".equals(pathInfo)) {
            List<User> users = userDao.findAll();
            // Remove passwords before sending
            users.forEach(u -> u.setPassword(null));
            resp.getWriter().write(gson.toJson(users));
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if (pathInfo != null && pathInfo.startsWith("/users/")) {
            try {
                int userId = Integer.parseInt(pathInfo.substring("/users/".length()));
                User updatedUser = gson.fromJson(req.getReader(), User.class);
                updatedUser.setUserId(userId);
                
                userDao.updateUser(updatedUser);
                
                // Return updated user (without password)
                updatedUser.setPassword(null);
                resp.getWriter().write(gson.toJson(updatedUser));
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        
        if (pathInfo != null && pathInfo.startsWith("/users/")) {
            try {
                int userId = Integer.parseInt(pathInfo.substring("/users/".length()));
                userDao.deleteUser(userId);
                resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
