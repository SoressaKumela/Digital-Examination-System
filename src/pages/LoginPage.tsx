import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      toast.success('Welcome back!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Mobile logo */}
      <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-xl">ExamHub</span>
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="font-display text-3xl font-bold">Welcome Back</h2>
        <p className="text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive-light border border-destructive/20 flex items-center gap-3 animate-slide-up">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size="sm" className="text-primary-foreground" />
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Demo credentials */}
      <div className="mt-8 p-4 rounded-lg bg-accent border border-border">
        <p className="text-sm font-medium mb-3">Demo Credentials</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Admin:</strong> admin@exam.com / admin123</p>
          <p><strong>Teacher:</strong> teacher@exam.com / teacher123</p>
          <p><strong>Student:</strong> student@exam.com / student123</p>
        </div>
      </div>
    </div>
  );
}
