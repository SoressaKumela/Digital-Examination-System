import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '@/api/teacherService';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ClipboardList,
  Clock,
  FileQuestion,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export function ExamCreationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    scheduledAt: '',
    questionIds: [] as number[],
  });

  // Calculate totals based on selected questions
  const selectedQuestions = availableQuestions.filter(q => formData.questionIds.includes(q.questionId));
  const totalQuestions = selectedQuestions.length;
  const totalMarks = selectedQuestions.reduce((sum, q) => sum + q.marks, 0);

  useEffect(() => {
    if (step === 2) {
      fetchQuestions();
    }
  }, [step]);

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const data = await teacherService.getQuestions();
      setAvailableQuestions(data);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionToggle = (questionId: number) => {
    setFormData(prev => {
      const currentIds = prev.questionIds;
      if (currentIds.includes(questionId)) {
        return { ...prev, questionIds: currentIds.filter(id => id !== questionId) };
      } else {
        return { ...prev, questionIds: [...currentIds, questionId] };
      }
    });
  };

  const handleSubmit = async () => {
    if (totalQuestions === 0) {
      toast.error('Please select at least one question');
      return;
    }

    setIsSubmitting(true);
    try {
      await teacherService.createExam({
        title: formData.title,
        subject: formData.subject,
        duration: formData.duration,
        scheduledAt: formData.scheduledAt,
        totalQuestions: totalQuestions,
        totalMarks: totalMarks,
        questionIds: formData.questionIds,
        createdBy: 'Current Teacher',
      });
      toast.success('Exam created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Create New Exam</h1>
        <p className="text-muted-foreground mt-1">
          Step {step} of 2: {step === 1 ? 'Exam Details' : 'Select Questions'}
        </p>
      </div>

      <Card className="border-border shadow-soft">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            {step === 1 ? <ClipboardList className="h-5 w-5 text-primary" /> : <FileQuestion className="h-5 w-5 text-primary" />}
            {step === 1 ? 'Basic Information' : 'Question Selection'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? 'Set the title, timing, and subject for the exam' : 'Choose questions from your bank to include'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 ? (
            // Step 1: Basic Details
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Exam Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Mathematics Midterm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="10"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduledAt" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Scheduled Date & Time
                  </Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Question Selection
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                <div className="flex gap-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Selected: </span>
                    <span className="font-bold">{totalQuestions}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total Marks: </span>
                    <span className="font-bold text-primary">{totalMarks}</span>
                  </div>
                </div>
              </div>

              {isLoadingQuestions ? (
                <div className="py-8 flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {availableQuestions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No questions found in the question bank.
                      </p>
                    ) : (
                      availableQuestions.map((q) => (
                        <div
                          key={q.questionId}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.questionIds.includes(q.questionId)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent'
                            }`}
                          onClick={() => handleQuestionToggle(q.questionId)}
                        >
                          <Checkbox
                            checked={formData.questionIds.includes(q.questionId)}
                            onCheckedChange={() => handleQuestionToggle(q.questionId)}
                          />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-sm">{q.questionText}</p>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">{q.subject}</Badge>
                              <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                              <span>{q.marks} marks</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border pt-6">
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!formData.title || !formData.scheduledAt) {
                    toast.error('Please fill in required fields');
                    return;
                  }
                  setStep(2);
                }}
                className="bg-gradient-primary"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || totalQuestions === 0}
                className="bg-gradient-primary"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : 'Create Exam'}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
