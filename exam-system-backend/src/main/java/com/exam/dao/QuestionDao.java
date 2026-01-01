package com.exam.dao;

import com.exam.config.DBConnection;
import com.exam.model.Question;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class QuestionDao {
    private final MongoCollection<Document> collection;

    public QuestionDao() {
        MongoDatabase database = DBConnection.getDatabase();
        this.collection = database.getCollection("questions");
    }

    public List<Question> findAll() {
        List<Question> questions = new ArrayList<>();
        for (Document doc : collection.find()) {
            questions.add(mapToQuestion(doc));
        }
        return questions;
    }

    public Question findById(int questionId) {
        Document doc = collection.find(Filters.eq("questionId", questionId)).first();
        return doc != null ? mapToQuestion(doc) : null;
    }

    public List<Question> findQuestionsByIds(List<Integer> questionIds) {
        List<Question> questions = new ArrayList<>();
        if (questionIds == null || questionIds.isEmpty()) {
            return questions;
        }
        for (Document doc : collection.find(Filters.in("questionId", questionIds))) {
            questions.add(mapToQuestion(doc));
        }
        return questions;
    }

    public void createQuestion(Question question) {
        if (question.getQuestionId() == 0) {
            question.setQuestionId(getNextQuestionId());
        }

        Document doc = new Document("questionId", question.getQuestionId())
                .append("questionText", question.getQuestionText())
                .append("options", question.getOptions())
                .append("correctAnswer", question.getCorrectAnswer())
                .append("subject", question.getSubject())
                .append("difficulty", question.getDifficulty())
                .append("marks", question.getMarks());
        
        collection.insertOne(doc);
        question.setId(doc.getObjectId("_id"));
    }

    public void updateQuestion(Question question) {
        Document doc = new Document("questionText", question.getQuestionText())
                .append("options", question.getOptions())
                .append("correctAnswer", question.getCorrectAnswer())
                .append("subject", question.getSubject())
                .append("difficulty", question.getDifficulty())
                .append("marks", question.getMarks());
        
        collection.updateOne(Filters.eq("questionId", question.getQuestionId()), new Document("$set", doc));
    }

    public void deleteQuestion(int questionId) {
        collection.deleteOne(Filters.eq("questionId", questionId));
    }

    private int getNextQuestionId() {
        Document lastQuestion = collection.find().sort(Sorts.descending("questionId")).first();
        return lastQuestion != null ? lastQuestion.getInteger("questionId") + 1 : 1;
    }

    private Question mapToQuestion(Document doc) {
        Question q = new Question();
        q.setId(doc.getObjectId("_id"));
        q.setQuestionId(doc.getInteger("questionId"));
        q.setQuestionText(doc.getString("questionText"));
        q.setOptions(doc.getList("options", String.class));
        q.setCorrectAnswer(doc.getInteger("correctAnswer"));
        q.setSubject(doc.getString("subject"));
        q.setDifficulty(doc.getString("difficulty"));
        q.setMarks(doc.getInteger("marks"));
        return q;
    }
}
