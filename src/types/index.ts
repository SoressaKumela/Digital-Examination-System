export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Question {
  questionId: number;
  questionText: string;
  options: string[];
  correctAnswer?: number;
  subject: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: number;
}

export interface Exam {
  examId: number;
  title: string;
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  scheduledAt: string;
  createdBy?: string;
  questionIds?: number[];
}

export interface ExamResult {
  resultId: number;
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  studentEmail?: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  answers: ExamAnswer[];
}

export interface ExamAnswer {
  questionId: number;
  selectedOption: number | null;
  isCorrect: boolean;
}

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalExams?: number;
  totalQuestions?: number;
  upcomingExams?: number;
  completedExams?: number;
}
