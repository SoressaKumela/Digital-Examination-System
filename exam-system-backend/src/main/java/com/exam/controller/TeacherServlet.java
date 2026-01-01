package com.exam.controller;

import com.exam.dao.ExamDao;
import com.exam.dao.QuestionDao;
import com.exam.dao.ResultDao;
import com.exam.model.Exam;
import com.exam.model.ExamResult;
import com.exam.model.Question;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

@WebServlet("/api/teacher/*")
public class TeacherServlet extends HttpServlet {
    
    private final QuestionDao questionDao = new QuestionDao();
    private final ExamDao examDao = new ExamDao();
    private final ResultDao resultDao = new ResultDao();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if ("/questions".equals(pathInfo)) {
            List<Question> questions = questionDao.findAll();
            resp.getWriter().write(gson.toJson(questions));
        } else if ("/dashboard".equals(pathInfo)) {
            List<Exam> exams = examDao.findAll();
            List<Question> questions = questionDao.findAll();
            
            com.google.gson.JsonObject response = new com.google.gson.JsonObject();
            response.add("exams", gson.toJsonTree(exams));
            
            com.google.gson.JsonObject stats = new com.google.gson.JsonObject();
            stats.addProperty("totalExams", exams.size());
            stats.addProperty("totalQuestions", questions.size());
            stats.addProperty("upcomingExams", exams.stream().filter(e -> "UPCOMING".equals(e.getStatus())).count());
            stats.addProperty("completedExams", exams.stream().filter(e -> "COMPLETED".equals(e.getStatus())).count());
            
            response.add("stats", stats);
            resp.getWriter().write(gson.toJson(response));
        } else if (pathInfo != null && pathInfo.matches("/exams/\\d+/results")) {
            // GET /exams/{id}/results
            try {
                String[] parts = pathInfo.split("/");
                int examId = Integer.parseInt(parts[2]);
                List<ExamResult> results = resultDao.findByExamId(examId);
                resp.getWriter().write(gson.toJson(results));
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

        if ("/questions".equals(pathInfo)) {
            Question newQuestion = gson.fromJson(req.getReader(), Question.class);
            questionDao.createQuestion(newQuestion);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(newQuestion));
        } else if ("/exams".equals(pathInfo)) {
            Exam newExam = gson.fromJson(req.getReader(), Exam.class);
            examDao.createExam(newExam);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write(gson.toJson(newExam));
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        resp.setContentType("application/json");

        if (pathInfo != null && pathInfo.startsWith("/questions/")) {
            try {
                int questionId = Integer.parseInt(pathInfo.substring("/questions/".length()));
                Question updatedQuestion = gson.fromJson(req.getReader(), Question.class);
                updatedQuestion.setQuestionId(questionId);
                
                questionDao.updateQuestion(updatedQuestion);
                resp.getWriter().write(gson.toJson(updatedQuestion));
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
        
        if (pathInfo != null && pathInfo.startsWith("/questions/")) {
            try {
                int questionId = Integer.parseInt(pathInfo.substring("/questions/".length()));
                questionDao.deleteQuestion(questionId);
                resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
