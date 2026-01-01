package com.exam.model;

import org.bson.types.ObjectId;

public class Exam {
    private transient ObjectId id;
    private int examId;
    private String title;
    private String subject;
    private int duration; // in minutes
    private int totalQuestions;
    private int totalMarks;
    private String status; // UPCOMING, ONGOING, COMPLETED
    private String scheduledAt;
    private String createdBy; // Teacher's name or ID
    private java.util.List<Integer> questionIds; // List of Question IDs included in this exam

    public Exam() {}

    public Exam(int examId, String title, String subject, int duration, int totalQuestions, int totalMarks, String status, String scheduledAt, String createdBy) {
        this.examId = examId;
        this.title = title;
        this.subject = subject;
        this.duration = duration;
        this.totalQuestions = totalQuestions;
        this.totalMarks = totalMarks;
        this.status = status;
        this.scheduledAt = scheduledAt;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public int getExamId() { return examId; }
    public void setExamId(int examId) { this.examId = examId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public java.util.List<Integer> getQuestionIds() { return questionIds; }
    public void setQuestionIds(java.util.List<Integer> questionIds) { this.questionIds = questionIds; }
}
