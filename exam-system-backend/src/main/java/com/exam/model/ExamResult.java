package com.exam.model;

import org.bson.types.ObjectId;
import java.util.List;

public class ExamResult {
    private transient ObjectId id;
    private int resultId;
    private int examId;
    private String examTitle;
    private int studentId;
    private String studentName;
    private String studentEmail;
    private int score;
    private int totalMarks;
    private int percentage;
    private String submittedAt;
    
    // We can store the answers as a list of simple objects or maps
    // For simplicity, let's just store the score for now, but you could add:
    // private List<StudentAnswer> answers;

    public ExamResult() {}

    public ExamResult(int resultId, int examId, String examTitle, int studentId, String studentName, int score, int totalMarks, String submittedAt) {
        this.resultId = resultId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.totalMarks = totalMarks;
        this.submittedAt = submittedAt;
        this.percentage = totalMarks > 0 ? (score * 100) / totalMarks : 0;
    }

    // Getters and Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public int getResultId() { return resultId; }
    public void setResultId(int resultId) { this.resultId = resultId; }

    public int getExamId() { return examId; }
    public void setExamId(int examId) { this.examId = examId; }

    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public int getPercentage() { return percentage; }
    public void setPercentage(int percentage) { this.percentage = percentage; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}
