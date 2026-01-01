import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teacherService } from '@/api/teacherService';
import { Exam, DashboardStats } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileQuestion,
  ClipboardList,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  Eye
} from 'lucide-react';

export function TeacherDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await teacherService.getDashboardStats();
        setExams(data.exams);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: Exam['status']) => {
    switch (status) {
      case 'UPCOMING':
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Upcoming</Badge>;
      case 'ONGOING':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Ongoing</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Exams',
      value: stats?.totalExams || 0,
      icon: <ClipboardList className="h-6 w-6" />,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Question Bank',
      value: stats?.totalQuestions || 0,
      icon: <FileQuestion className="h-6 w-6" />,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Upcoming',
      value: stats?.upcomingExams || 0,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Completed',
      value: stats?.completedExams || 0,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-accent text-accent-foreground',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your exams and question bank
          </p>
        </div>
        <Link to="/teacher/create-exam">
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Create Exam
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-border shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/teacher/questions">
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-4 hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileQuestion className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Question Bank</p>
                <p className="text-sm text-muted-foreground">Manage your questions</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </Link>

        <Link to="/teacher/create-exam">
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-4 hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Plus className="h-5 w-5 text-success" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Create New Exam</p>
                <p className="text-sm text-muted-foreground">Set up a new examination</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </Link>
      </div>

      {/* Recent Exams */}
      <Card className="border-border shadow-soft overflow-hidden">
        <CardHeader>
          <CardTitle className="font-display">Your Exams</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.examId} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell className="text-muted-foreground">{exam.subject}</TableCell>
                    <TableCell>{exam.duration} min</TableCell>
                    <TableCell>{exam.totalQuestions}</TableCell>
                    <TableCell>{getStatusBadge(exam.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/teacher/exams/${exam.examId}/results`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Results
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
