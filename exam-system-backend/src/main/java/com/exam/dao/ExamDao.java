package com.exam.dao;

import com.exam.config.DBConnection;
import com.exam.model.Exam;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class ExamDao {
    private final MongoCollection<Document> collection;

    public ExamDao() {
        MongoDatabase database = DBConnection.getDatabase();
        this.collection = database.getCollection("exams");
    }

    public List<Exam> findAll() {
        List<Exam> exams = new ArrayList<>();
        for (Document doc : collection.find()) {
            exams.add(mapToExam(doc));
        }
        return exams;
    }

    public Exam findById(int examId) {
        Document doc = collection.find(Filters.eq("examId", examId)).first();
        return doc != null ? mapToExam(doc) : null;
    }

    public void createExam(Exam exam) {
        if (exam.getExamId() == 0) {
            exam.setExamId(getNextExamId());
        }

        Document doc = new Document("examId", exam.getExamId())
                .append("title", exam.getTitle())
                .append("subject", exam.getSubject())
                .append("duration", exam.getDuration())
                .append("totalQuestions", exam.getTotalQuestions())
                .append("totalMarks", exam.getTotalMarks())
                .append("status", exam.getStatus())
                .append("scheduledAt", exam.getScheduledAt())
                .append("createdBy", exam.getCreatedBy());

        if (exam.getQuestionIds() != null) {
            doc.append("questionIds", exam.getQuestionIds());
        }
        
        collection.insertOne(doc);
        exam.setId(doc.getObjectId("_id"));
    }

    private int getNextExamId() {
        Document lastExam = collection.find().sort(Sorts.descending("examId")).first();
        return lastExam != null ? lastExam.getInteger("examId") + 1 : 1;
    }

    private Exam mapToExam(Document doc) {
        Exam exam = new Exam();
        exam.setId(doc.getObjectId("_id"));
        exam.setExamId(doc.getInteger("examId"));
        exam.setTitle(doc.getString("title"));
        exam.setSubject(doc.getString("subject"));
        exam.setDuration(doc.getInteger("duration"));
        exam.setTotalQuestions(doc.getInteger("totalQuestions"));
        exam.setTotalMarks(doc.getInteger("totalMarks"));
        exam.setStatus(doc.getString("status"));
        exam.setScheduledAt(doc.getString("scheduledAt"));
        exam.setCreatedBy(doc.getString("createdBy"));
        
        List<Integer> qIds = doc.getList("questionIds", Integer.class);
        exam.setQuestionIds(qIds);
        
        return exam;
    }
}
