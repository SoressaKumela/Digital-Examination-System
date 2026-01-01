import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '@/api/studentService';
import { Exam } from '@/types';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  FileQuestion, 
  Award,
  AlertTriangle,
  ArrowLeft,
  Play,
  CheckCircle
} from 'lucide-react';

export function ExamInstructionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await studentService.getExamDetails(parseInt(examId || '0'));
        setExam(data);
      } catch (error) {
        console.error('Failed to fetch exam:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleStartExam = () => {
    navigate(`/student/exam/${examId}/take`);
  };

  if (isLoading) {
    return <PageLoader text="Loading exam details..." />;
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not found</p>
        <Link to="/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const instructions = [
    'Read each question carefully before answering.',
    'You can navigate between questions using the question palette.',
    'You can mark questions for review and come back to them later.',
    'The exam will automatically submit when the time runs out.',
    'Once submitted, you cannot change your answers.',
    'Ensure you have a stable internet connection throughout the exam.',
    'Do not refresh the page during the exam.',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground mt-1">{exam.subject}</p>
        </div>
      </div>

      {/* Exam Info */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-display">{exam.duration}</p>
            <p className="text-sm text-muted-foreground">Minutes</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <FileQuestion className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold font-display">{exam.totalQuestions}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-soft">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold font-display">{exam.totalMarks}</p>
            <p className="text-sm text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Important Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{instruction}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Agreement & Start */}
      <Card className="border-border shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <label 
              htmlFor="terms" 
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              I have read and understood all the instructions. I agree to follow the examination rules and understand that any violation may result in disqualification.
            </label>
          </div>
          
          <div className="flex justify-end gap-3">
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </Link>
            <Button
              onClick={handleStartExam}
              disabled={!agreedToTerms}
              className="bg-gradient-success hover:opacity-90"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Exam
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
