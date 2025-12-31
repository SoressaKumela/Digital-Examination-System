import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/api/adminService';
import { DashboardStats } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  FileQuestion, 
  ClipboardList,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <PageLoader text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'bg-primary/10 text-primary',
      trend: '+12% this month',
    },
    {
      title: 'Total Teachers',
      value: stats?.totalTeachers || 0,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-success/10 text-success',
      trend: '+2 this month',
    },
    {
      title: 'Total Exams',
      value: stats?.totalExams || 0,
      icon: <ClipboardList className="h-6 w-6" />,
      color: 'bg-warning/10 text-warning',
      trend: '+5 this week',
    },
    {
      title: 'Question Bank',
      value: stats?.totalQuestions || 0,
      icon: <FileQuestion className="h-6 w-6" />,
      color: 'bg-accent text-accent-foreground',
      trend: '+23 questions',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of the examination system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card 
            key={card.title} 
            className="border-border shadow-soft hover:shadow-elevated transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
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
              <div className="flex items-center gap-1 mt-2 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                {card.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="font-display">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/users">
            <Button 
              variant="outline" 
              className="w-full justify-between h-auto py-4 hover:border-primary hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full justify-between h-auto py-4 hover:border-primary hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <ClipboardList className="h-5 w-5 text-success" />
              </div>
              <div className="text-left">
                <p className="font-semibold">View All Exams</p>
                <p className="text-sm text-muted-foreground">Monitor exam activities</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
