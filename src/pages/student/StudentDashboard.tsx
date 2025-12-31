import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '@/api/studentService';
import { Exam, DashboardStats } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Calendar,
  ArrowRight,
  Play,
  Trophy,
  Lock
} from 'lucide-react';

export function StudentDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await studentService.getDashboard();
        setExams(data.exams);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Update timer every second
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExamState = (exam: Exam) => {
    const start = new Date(exam.scheduledAt).getTime();
    const end = start + exam.duration * 60 * 1000;

    if (exam.status === 'COMPLETED') return 'COMPLETED';
    if (now < start) return 'LOCKED';
    if (now > end) return 'EXPIRED'; // Or treat as missed
    return 'AVAILABLE';
  };

  const formatCountdown = (targetTime: number) => {
    const diff = targetTime - now;
    if (diff <= 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <PageLoader text="Loading your dashboard..." />;
  }

  const upcomingExams = exams.filter(e => e.status !== 'COMPLETED');
  const completedExams = exams.filter(e => e.status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          View your exams and track your progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Exams
            </CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{stats?.totalExams || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{stats?.upcomingExams || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-soft col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">{stats?.completedExams || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Upcoming & Available Exams
        </h2>

        {upcomingExams.length === 0 ? (
          <Card className="border-border shadow-soft">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming exams at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingExams.map((exam) => {
              const state = getExamState(exam);
              const start = new Date(exam.scheduledAt).getTime();

              return (
                <Card key={exam.examId} className="border-border shadow-soft hover:shadow-elevated transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      {state === 'LOCKED' && <Badge variant="outline" className="bg-muted/50 border-muted">Scheduled</Badge>}
                      {state === 'AVAILABLE' && <Badge className="bg-success/10 text-success hover:bg-success/20">Live Now</Badge>}
                      {state === 'EXPIRED' && <Badge variant="destructive">Expired</Badge>}

                      <span className="text-sm text-muted-foreground">
                        {exam.duration} min
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg mb-2">{exam.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{exam.subject}</p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{exam.totalQuestions} questions</span>
                      <span>{exam.totalMarks} marks</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        {state === 'LOCKED' ? (
                          <div className="flex items-center gap-1 text-primary font-medium">
                            <Clock className="h-3 w-3" />
                            Starts in {formatCountdown(start)}
                          </div>
                        ) : (
                          formatDate(exam.scheduledAt)
                        )}
                      </div>

                      {state === 'AVAILABLE' ? (
                        <Link to={`/student/exam/${exam.examId}/instructions`}>
                          <Button
                            size="sm"
                            className="bg-gradient-success hover:opacity-90"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start Exam
                          </Button>
                        </Link>
                      ) : state === 'LOCKED' ? (
                        <Button size="sm" disabled variant="secondary">
                          <Lock className="h-4 w-4 mr-1" />
                          Locked
                        </Button>
                      ) : (
                        <Button size="sm" disabled variant="ghost">
                          Missed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Exams */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-success" />
          Completed Exams
        </h2>

        {completedExams.length === 0 ? (
          <Card className="border-border shadow-soft">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No completed exams yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedExams.map((exam) => (
              <Card key={exam.examId} className="border-border shadow-soft hover:shadow-elevated transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-muted text-muted-foreground">Completed</Badge>
                  </div>

                  <h3 className="font-display font-semibold text-lg mb-2">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{exam.subject}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(exam.scheduledAt)}
                    </span>
                    <Link to={`/student/result/1`}> {/* TODO: Link to actual result */}
                      <Button variant="secondary" size="sm">
                        <Trophy className="h-4 w-4 mr-1" />
                        View Result
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
