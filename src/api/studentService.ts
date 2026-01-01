import { Exam, Question, ExamResult, DashboardStats } from '@/types';
import { API_BASE_URL, getHeaders, handleResponse } from './config';

// Temporary local storage for answers since backend doesn't support partial saves yet
const savedAnswers: Map<number, Map<number, number>> = new Map();

export const studentService = {
  async getDashboard(): Promise<{ exams: Exam[]; stats: DashboardStats }> {
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getExamDetails(examId: number): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/student/exam/${examId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getExamQuestions(examId: number): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/student/exam/${examId}/questions`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async saveAnswer(examId: number, questionId: number, selectedOption: number): Promise<void> {
    // Keep this local for now as backend doesn't have an endpoint for single answer save
    if (!savedAnswers.has(examId)) {
      savedAnswers.set(examId, new Map());
    }
    savedAnswers.get(examId)!.set(questionId, selectedOption);
  },

  async submitExam(examId: number, answers: Map<number, number>): Promise<ExamResult> {
    const answersObj = Object.fromEntries(answers);
    const response = await fetch(`${API_BASE_URL}/student/exam/${examId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers: answersObj }),
    });

    // Backend currently returns a success message, not the full result
    // So we return a mock result for the UI to show something
    return {
      resultId: Date.now(),
      examId,
      examTitle: 'Exam Submitted',
      studentId: 0,
      studentName: 'Student',
      score: 0,
      totalMarks: 0,
      percentage: 0,
      submittedAt: new Date().toISOString(),
      answers: [],
    };
  },

  async getResult(resultId: number): Promise<ExamResult> {
    const response = await fetch(`${API_BASE_URL}/student/results/${resultId}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
