package com.exam.dao;

import com.exam.config.DBConnection;
import com.exam.model.ExamResult;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class ResultDao {
    private final MongoCollection<Document> collection;

    public ResultDao() {
        MongoDatabase database = DBConnection.getDatabase();
        this.collection = database.getCollection("results");
    }

    public void saveResult(ExamResult result) {
        if (result.getResultId() == 0) {
            result.setResultId(getNextResultId());
        }

        Document doc = new Document("resultId", result.getResultId())
                .append("examId", result.getExamId())
                .append("examTitle", result.getExamTitle())
                .append("studentId", result.getStudentId())
                .append("studentName", result.getStudentName())
                .append("studentEmail", result.getStudentEmail())
                .append("score", result.getScore())
                .append("totalMarks", result.getTotalMarks())
                .append("percentage", result.getPercentage())
                .append("submittedAt", result.getSubmittedAt());
        
        collection.insertOne(doc);
        result.setId(doc.getObjectId("_id"));
    }

    public List<ExamResult> findByStudentId(int studentId) {
        List<ExamResult> results = new ArrayList<>();
        for (Document doc : collection.find(Filters.eq("studentId", studentId))) {
            results.add(mapToResult(doc));
        }
        return results;
    }

    public List<Integer> findExamIdsByStudentId(int studentId) {
        List<Integer> examIds = new ArrayList<>();
        for (Document doc : collection.find(Filters.eq("studentId", studentId))) {
            examIds.add(doc.getInteger("examId"));
        }
        return examIds;
    }
    
    public List<ExamResult> findByExamId(int examId) {
        List<ExamResult> results = new ArrayList<>();
        for (Document doc : collection.find(Filters.eq("examId", examId))) {
            results.add(mapToResult(doc));
        }
        return results;
    }

    public ExamResult findById(int resultId) {
        Document doc = collection.find(Filters.eq("resultId", resultId)).first();
        return doc != null ? mapToResult(doc) : null;
    }

    private int getNextResultId() {
        Document lastResult = collection.find().sort(Sorts.descending("resultId")).first();
        return lastResult != null ? lastResult.getInteger("resultId") + 1 : 1;
    }

    private ExamResult mapToResult(Document doc) {
        ExamResult result = new ExamResult();
        result.setId(doc.getObjectId("_id"));
        result.setResultId(doc.getInteger("resultId"));
        result.setExamId(doc.getInteger("examId"));
        result.setExamTitle(doc.getString("examTitle"));
        result.setStudentId(doc.getInteger("studentId"));
        result.setStudentName(doc.getString("studentName"));
        result.setStudentEmail(doc.getString("studentEmail"));
        result.setScore(doc.getInteger("score"));
        result.setTotalMarks(doc.getInteger("totalMarks"));
        result.setPercentage(doc.getInteger("percentage"));
        result.setSubmittedAt(doc.getString("submittedAt"));
        return result;
    }
}
