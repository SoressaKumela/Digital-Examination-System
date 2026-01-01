package com.exam.model;

import org.bson.types.ObjectId;
import java.util.List;

public class Question {
    private transient ObjectId id;
    private int questionId;
    private String questionText;
    private List<String> options;
    private int correctAnswer; // Index of the correct option (0-3)
    private String subject;
    private String difficulty; // EASY, MEDIUM, HARD
    private int marks;

    public Question() {}

    public Question(int questionId, String questionText, List<String> options, int correctAnswer, String subject, String difficulty, int marks) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.subject = subject;
        this.difficulty = difficulty;
        this.marks = marks;
    }

    // Getters and Setters
    public ObjectId getId() { return id; }
    public void setId(ObjectId id) { this.id = id; }

    public int getQuestionId() { return questionId; }
    public void setQuestionId(int questionId) { this.questionId = questionId; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }

    public int getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(int correctAnswer) { this.correctAnswer = correctAnswer; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }
}
