package com.exam.controller;

import com.exam.dao.ExamDao;
import com.exam.dao.QuestionDao;
import com.exam.dao.ResultDao;
import com.exam.model.Exam;
import com.exam.model.ExamResult;
import com.exam.model.Question;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

@WebServlet("/api/student/*")
public class StudentServlet extends HttpServlet {
    
    private final ExamDao examDao = new ExamDao();
    private final QuestionDao questionDao = new QuestionDao();
    private final ResultDao resultDao = new ResultDao();
    private final com.exam.dao.UserDao userDao = new com.exam.dao.UserDao();
    private final Gson gson = new Gson();

    private int getUserIdFromToken(HttpServletRequest req) {
        String authHeader = req.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (token.startsWith("mock-jwt-token-")) {
                try {
                    return Integer.parseInt(token.substring("mock-jwt-token-".length()));
                } catch (NumberFormatException e) {
                    return 0;
                }
            }
        }
        return 0;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if ("/dashboard".equals(pathInfo)) {
            // In a real app, filter by student's enrolled courses/exams
            List<Exam> exams = examDao.findAll();
            
            // Check for exams already taken by this student
            int studentId = getUserIdFromToken(req);
            List<Integer> takenExamIds = resultDao.findExamIdsByStudentId(studentId);
            
            for (Exam exam : exams) {
                if (takenExamIds.contains(exam.getExamId())) {
                    exam.setStatus("COMPLETED");
                }
            }
            
            JsonObject response = new JsonObject();
            response.add("exams", gson.toJsonTree(exams));
            // Add dummy stats
            JsonObject stats = new JsonObject();
            stats.addProperty("upcomingExams", exams.stream().filter(e -> "UPCOMING".equals(e.getStatus()) || "ONGOING".equals(e.getStatus())).count());
            stats.addProperty("completedExams", exams.stream().filter(e -> "COMPLETED".equals(e.getStatus())).count());
            stats.addProperty("totalExams", exams.size());
            response.add("stats", stats);
            
            resp.getWriter().write(gson.toJson(response));
            
        } else if (pathInfo != null && pathInfo.startsWith("/exam/")) {
            // Extract ID and action
            String[] parts = pathInfo.split("/");
            if (parts.length >= 3) {
                try {
                    int examId = Integer.parseInt(parts[2]);
                    
                    if (parts.length == 3) {
                        // GET /exam/{id} - Exam Details
                        Exam exam = examDao.findById(examId);
                        if (exam != null) {
                            resp.getWriter().write(gson.toJson(exam));
                        } else {
                            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                        }
                    } else if (parts.length == 4 && "questions".equals(parts[3])) {
                        // GET /exam/{id}/questions
                        Exam exam = examDao.findById(examId);
                        if (exam == null) {
                            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                            return;
                        }

                        List<Question> questions;
                        if (exam.getQuestionIds() != null && !exam.getQuestionIds().isEmpty()) {
                            // Fetch specific questions selected by the teacher
                            questions = questionDao.findQuestionsByIds(exam.getQuestionIds());
                        } else {
                            // Fallback: Fetch all questions if no specific ones are linked
                            questions = questionDao.findAll();
                        }
                        
                        // Hide answers before sending to student
                        questions.forEach(q -> {
                            q.setCorrectAnswer(-1); 
                        });
                        
                        resp.getWriter().write(gson.toJson(questions));
                    }
                } catch (NumberFormatException e) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            }
        } else if (pathInfo != null && pathInfo.startsWith("/results/")) {
             // GET /results/{id}
             try {
                 int resultId = Integer.parseInt(pathInfo.substring("/results/".length()));
                 ExamResult result = resultDao.findById(resultId);
                 
                 if (result != null) {
                     resp.getWriter().write(gson.toJson(result));
                 } else {
                     resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                 }
             } catch (NumberFormatException e) {
                 resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
             }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if (pathInfo != null && pathInfo.endsWith("/submit")) {
            // Extract examId from path /exam/{id}/submit
            String[] parts = pathInfo.split("/");
            if (parts.length >= 4) {
                try {
                    int examId = Integer.parseInt(parts[2]);
                    
                    // Parse answers from body
                    JsonObject body = gson.fromJson(req.getReader(), JsonObject.class);
                    Type type = new TypeToken<Map<Integer, Integer>>(){}.getType();
                    Map<Integer, Integer> answers = gson.fromJson(body.get("answers"), type);
                    
                    // Calculate Score
                    List<Question> questions = questionDao.findAll(); // Should filter by exam
                    int score = 0;
                    int totalMarks = 0;
                    
                    for (Question q : questions) {
                        totalMarks += q.getMarks();
                        if (answers.containsKey(q.getQuestionId())) {
                            int selected = answers.get(q.getQuestionId());
                            if (selected == q.getCorrectAnswer()) {
                                score += q.getMarks();
                            }
                        }
                    }
                    
                    // Save Result
                    Exam exam = examDao.findById(examId);
                    ExamResult result = new ExamResult();
                    result.setExamId(examId);
                    result.setExamTitle(exam != null ? exam.getTitle() : "Unknown Exam");
                    
                    int studentId = getUserIdFromToken(req);
                    result.setStudentId(studentId);
                    
                    com.exam.model.User student = userDao.findById(studentId); // Assuming findById exists or implement it
                    if (student != null) {
                        result.setStudentName(student.getFullName());
                        result.setStudentEmail(student.getEmail());
                    } else {
                        result.setStudentName("Unknown Student");
                        result.setStudentEmail("unknown@example.com");
                    }

                    result.setScore(score);
                    result.setTotalMarks(totalMarks);
                    result.setPercentage(totalMarks > 0 ? (score * 100) / totalMarks : 0);
                    result.setSubmittedAt(java.time.Instant.now().toString());
                    
                    resultDao.saveResult(result);
                    
                    resp.setStatus(HttpServletResponse.SC_OK);
                    resp.getWriter().write(gson.toJson(result));
                    
                } catch (Exception e) {
                    e.printStackTrace();
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
                }
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
