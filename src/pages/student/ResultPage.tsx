import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentService } from '@/api/studentService';
import { ExamResult } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Home,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResultPage() {
  const { resultId } = useParams<{ resultId: string }>();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await studentService.getResult(parseInt(resultId || '0'));
        setResult(data);
      } catch (error) {
        console.error('Failed to fetch result:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (isLoading) {
    return <PageLoader text="Loading your result..." />;
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Result not found</p>
        <Link to="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-success' };
    if (percentage >= 80) return { grade: 'A', color: 'text-success' };
    if (percentage >= 70) return { grade: 'B', color: 'text-primary' };
    if (percentage >= 60) return { grade: 'C', color: 'text-warning' };
    if (percentage >= 50) return { grade: 'D', color: 'text-warning' };
    return { grade: 'F', color: 'text-destructive' };
  };

  const gradeInfo = getGrade(result.percentage);
  const correctAnswers = result.answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = result.answers.filter(a => !a.isCorrect && a.selectedOption !== null).length;
  const unanswered = result.answers.filter(a => a.selectedOption === null).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
          <Trophy className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-bold">Exam Completed!</h1>
        <p className="text-muted-foreground mt-1">{result.examTitle}</p>
      </div>

      {/* Score Card */}
      <Card className="border-border shadow-elevated overflow-hidden">
        <div className="bg-gradient-primary p-6 text-center text-primary-foreground">
          <p className="text-sm opacity-80 mb-2">Your Score</p>
          <p className="text-5xl font-bold font-display">
            {result.score} / {result.totalMarks}
          </p>
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Percentage</span>
            <span className="text-2xl font-bold">{result.percentage}%</span>
          </div>
          <Progress value={result.percentage} className="h-3 mb-6" />
          
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className={cn('text-4xl font-bold font-display', gradeInfo.color)}>
                {gradeInfo.grade}
              </div>
              <p className="text-sm text-muted-foreground">Grade</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold font-display">
                {result.answers.length}
              </div>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold font-display text-success">{correctAnswers}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold font-display text-destructive">{incorrectAnswers}</p>
            <p className="text-sm text-muted-foreground">Incorrect</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold font-display">{unanswered}</p>
            <p className="text-sm text-muted-foreground">Skipped</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Message */}
      <Card className="border-border shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Award className={cn('h-8 w-8 flex-shrink-0', gradeInfo.color)} />
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">
                {result.percentage >= 70 
                  ? 'Excellent Performance!' 
                  : result.percentage >= 50 
                  ? 'Good Effort!' 
                  : 'Keep Practicing!'}
              </h3>
              <p className="text-muted-foreground">
                {result.percentage >= 70 
                  ? 'You have demonstrated a strong understanding of the subject matter. Keep up the great work!'
                  : result.percentage >= 50 
                  ? 'You passed the exam. Review the incorrect answers to improve your understanding.'
                  : 'Don\'t be discouraged. Review the material and try again. Practice makes perfect!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Link to="/dashboard">
          <Button variant="outline" size="lg">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
