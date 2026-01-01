import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import { AuthLayout } from "@/layouts/AuthLayout";
import { MainLayout } from "@/layouts/MainLayout";

// Pages
import Index from "./pages/Index";
import { LoginPage } from "./pages/LoginPage";
import { DashboardRouter } from "./pages/DashboardRouter";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { QuestionBankPage } from "./pages/teacher/QuestionBankPage";
import { ExamCreationPage } from "./pages/teacher/ExamCreationPage";
import { TeacherExamResultsPage } from "./pages/teacher/TeacherExamResultsPage";
import { ExamInstructionsPage } from "./pages/student/ExamInstructionsPage";
import { ExamTakingPage } from "./pages/student/ExamTakingPage";
import { ResultPage } from "./pages/student/ResultPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Index route */}
            <Route path="/" element={<Index />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardRouter />} />

              {/* Admin routes */}
              <Route path="/admin/users" element={<UserManagementPage />} />

              {/* Teacher routes */}
              <Route path="/teacher/questions" element={<QuestionBankPage />} />
              <Route path="/teacher/create-exam" element={<ExamCreationPage />} />
              <Route path="/teacher/exams/:examId/results" element={<TeacherExamResultsPage />} />

              {/* Student routes */}
              <Route path="/student/exams" element={<Navigate to="/dashboard" replace />} />
              <Route path="/student/results" element={<Navigate to="/dashboard" replace />} />
              <Route path="/student/exam/:examId/instructions" element={<ExamInstructionsPage />} />
              <Route path="/student/exam/:examId/take" element={<ExamTakingPage />} />
              <Route path="/student/result/:resultId" element={<ResultPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
