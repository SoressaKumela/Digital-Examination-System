import { Question, Exam, ExamResult, DashboardStats } from '@/types';
import { API_BASE_URL, getHeaders, handleResponse } from './config';

export const teacherService = {
  async getDashboardStats(): Promise<{ exams: Exam[]; stats: DashboardStats }> {
    const response = await fetch(`${API_BASE_URL}/teacher/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/teacher/questions`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async createQuestion(questionData: Omit<Question, 'questionId'>): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/teacher/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(questionData),
    });
    return handleResponse(response);
  },

  async updateQuestion(questionId: number, questionData: Partial<Question>): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/teacher/questions/${questionId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(questionData),
    });
    return handleResponse(response);
  },

  async deleteQuestion(questionId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/teacher/questions/${questionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async createExam(examData: Omit<Exam, 'examId' | 'status'>): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/teacher/exams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(examData),
    });
    return handleResponse(response);
  },

  async getExamResults(examId: number): Promise<ExamResult[]> {
    const response = await fetch(`${API_BASE_URL}/teacher/exams/${examId}/results`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
