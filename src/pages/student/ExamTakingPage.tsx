import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '@/api/studentService';
import { Question, Exam } from '@/types';
import { PageLoader, FullPageLoader } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { Timer } from '@/components/exam/Timer';
import { QuestionDisplay } from '@/components/exam/QuestionDisplay';
import { QuestionPalette } from '@/components/exam/QuestionPalette';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  Send,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export function ExamTakingPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const [examData, questionsData] = await Promise.all([
          studentService.getExamDetails(parseInt(examId || '0')),
          studentService.getExamQuestions(parseInt(examId || '0')),
        ]);
        setExam(examData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Failed to fetch exam:', error);
        toast.error('Failed to load exam');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [examId, navigate]);

  const handleSelectOption = useCallback(async (optionIndex: number) => {
    const questionId = questions[currentQuestionIndex].questionId;
    setAnswers(prev => new Map(prev).set(questionId, optionIndex));
    
    // Auto-save
    try {
      await studentService.saveAnswer(parseInt(examId || '0'), questionId, optionIndex);
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  }, [currentQuestionIndex, questions, examId]);

  const handleToggleReview = useCallback(() => {
    const questionNumber = currentQuestionIndex + 1;
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionNumber)) {
        newSet.delete(questionNumber);
      } else {
        newSet.add(questionNumber);
      }
      return newSet;
    });
  }, [currentQuestionIndex]);

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);
    
    try {
      const result = await studentService.submitExam(parseInt(examId || '0'), answers);
      toast.success('Exam submitted successfully!');
      navigate(`/student/result/${result.resultId}`);
    } catch (error) {
      toast.error('Failed to submit exam');
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = useCallback(() => {
    toast.warning('Time is up! Submitting your exam...');
    handleSubmitExam();
  }, []);

  const goToQuestion = (questionNumber: number) => {
    setCurrentQuestionIndex(questionNumber - 1);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = new Set(
    Array.from(answers.keys()).map(qId => 
      questions.findIndex(q => q.questionId === qId) + 1
    ).filter(n => n > 0)
  );

  if (isLoading) {
    return <PageLoader text="Loading exam..." />;
  }

  if (isSubmitting) {
    return <FullPageLoader />;
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Exam not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] animate-fade-in">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30 py-4 px-4 lg:px-6 -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg lg:text-xl">{exam.title}</h1>
            <p className="text-sm text-muted-foreground">{exam.subject}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Timer 
              initialMinutes={exam.duration} 
              onTimeUp={handleTimeUp}
            />
            <Button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gradient-success hover:opacity-90 hidden sm:flex"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-6">
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={answers.get(currentQuestion.questionId) ?? null}
            onSelectOption={handleSelectOption}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant={markedForReview.has(currentQuestionIndex + 1) ? 'secondary' : 'outline'}
              onClick={handleToggleReview}
            >
              <Flag className={`h-4 w-4 mr-2 ${markedForReview.has(currentQuestionIndex + 1) ? 'text-warning' : ''}`} />
              {markedForReview.has(currentQuestionIndex + 1) ? 'Marked' : 'Mark for Review'}
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => setShowSubmitModal(true)}
                className="bg-gradient-success hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Exam
              </Button>
            )}
          </div>
        </div>

        {/* Question Palette */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <QuestionPalette
              totalQuestions={questions.length}
              currentQuestion={currentQuestionIndex + 1}
              answeredQuestions={answeredQuestions}
              markedForReview={markedForReview}
              onQuestionSelect={goToQuestion}
            />
            
            <Button
              onClick={() => setShowSubmitModal(true)}
              className="w-full mt-4 bg-gradient-success hover:opacity-90"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Exam
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Submit Button */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden">
        <Button
          onClick={() => setShowSubmitModal(true)}
          className="w-full bg-gradient-success hover:opacity-90 shadow-elevated"
        >
          <Send className="h-4 w-4 mr-2" />
          Submit Exam ({answeredQuestions.size}/{questions.length} answered)
        </Button>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Exam?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-light">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Are you sure you want to submit?</p>
              <p className="text-sm text-muted-foreground mt-1">
                You won't be able to change your answers after submission.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-success-light">
              <p className="text-2xl font-bold text-success">{answeredQuestions.size}</p>
              <p className="text-sm text-muted-foreground">Answered</p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-muted-foreground">
                {questions.length - answeredQuestions.size}
              </p>
              <p className="text-sm text-muted-foreground">Unanswered</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Continue Exam
            </Button>
            <Button
              onClick={handleSubmitExam}
              className="bg-gradient-success hover:opacity-90"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
