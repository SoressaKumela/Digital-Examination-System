import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  isReview?: boolean;
  correctAnswer?: number;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  isReview = false,
  correctAnswer,
}: QuestionDisplayProps) {
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'EASY':
        return 'bg-success-light text-success';
      case 'MEDIUM':
        return 'bg-warning-light text-warning';
      case 'HARD':
        return 'bg-destructive-light text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getOptionStyle = (index: number) => {
    if (isReview) {
      if (index === correctAnswer) {
        return 'border-success bg-success-light text-success ring-2 ring-success/30';
      }
      if (index === selectedOption && index !== correctAnswer) {
        return 'border-destructive bg-destructive-light text-destructive ring-2 ring-destructive/30';
      }
    }
    
    if (selectedOption === index) {
      return 'border-primary bg-accent ring-2 ring-primary/30';
    }
    
    return 'border-border hover:border-primary/50 hover:bg-accent/50';
  };

  return (
    <div className="animate-fade-in">
      {/* Question header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
          <Badge variant="outline" className={getDifficultyColor()}>
            {question.difficulty}
          </Badge>
        </div>
        <Badge variant="secondary" className="font-semibold">
          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
        </Badge>
      </div>

      {/* Question text */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-soft">
        <p className="text-lg font-medium leading-relaxed">{question.questionText}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !isReview && onSelectOption(index)}
            disabled={isReview}
            className={cn(
              'w-full text-left p-4 rounded-xl border-2 transition-all duration-200',
              'flex items-center gap-4',
              getOptionStyle(index),
              !isReview && 'cursor-pointer active:scale-[0.99]'
            )}
          >
            <span
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm',
                selectedOption === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="flex-1">{option}</span>
            {isReview && index === correctAnswer && (
              <span className="text-success text-sm font-medium">Correct</span>
            )}
            {isReview && index === selectedOption && index !== correctAnswer && (
              <span className="text-destructive text-sm font-medium">Your Answer</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
