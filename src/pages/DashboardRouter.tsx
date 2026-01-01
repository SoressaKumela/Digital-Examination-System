import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminDashboard } from './admin/AdminDashboard';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { StudentDashboard } from './student/StudentDashboard';
import { PageLoader } from '@/components/common/LoadingSpinner';

export function DashboardRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  switch (user?.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    default:
      return <StudentDashboard />;
  }
}
