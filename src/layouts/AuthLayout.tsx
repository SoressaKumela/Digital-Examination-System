import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FullPageLoader } from '@/components/common/LoadingSpinner';
import { GraduationCap } from 'lucide-react';

export function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-primary-foreground">
            ExamHub
          </span>
        </div>

        <div className="space-y-6">
          <h1 className="font-display text-4xl xl:text-5xl font-bold text-primary-foreground leading-tight">
            Streamline Your
            <br />
            Examination Process
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            A comprehensive digital platform for creating, managing, and taking exams with real-time analytics and seamless user experience.
          </p>
          
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">10K+</p>
              <p className="text-sm text-primary-foreground/70">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/70">Exams Conducted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">99%</p>
              <p className="text-sm text-primary-foreground/70">Uptime</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2024 ExamHub. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
