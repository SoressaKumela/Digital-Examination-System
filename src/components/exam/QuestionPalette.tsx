import React from 'react';
import { cn } from '@/lib/utils';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  markedForReview: Set<number>;
  onQuestionSelect: (questionNumber: number) => void;
}

export function QuestionPalette({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  markedForReview,
  onQuestionSelect,
}: QuestionPaletteProps) {
  const getQuestionStatus = (questionNumber: number) => {
    const isCurrentQuestion = questionNumber === currentQuestion;
    const isAnswered = answeredQuestions.has(questionNumber);
    const isMarked = markedForReview.has(questionNumber);

    if (isCurrentQuestion) {
      return 'current';
    }
    if (isMarked && isAnswered) {
      return 'marked-answered';
    }
    if (isMarked) {
      return 'marked';
    }
    if (isAnswered) {
      return 'answered';
    }
    return 'not-visited';
  };

  const getButtonStyle = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2';
      case 'answered':
        return 'bg-success text-success-foreground';
      case 'marked':
        return 'bg-warning text-warning-foreground';
      case 'marked-answered':
        return 'bg-gradient-to-br from-success to-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
      <h3 className="font-display font-semibold text-sm mb-4">Question Navigator</h3>
      
      {/* Question grid */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
          const status = getQuestionStatus(num);
          return (
            <button
              key={num}
              onClick={() => onQuestionSelect(num)}
              className={cn(
                'w-9 h-9 rounded-lg font-semibold text-sm transition-all duration-200',
                'hover:scale-105 active:scale-95',
                getButtonStyle(status)
              )}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success" />
          <span className="text-muted-foreground">Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning" />
          <span className="text-muted-foreground">Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary" />
          <span className="text-muted-foreground">Not Visited</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Answered</span>
          <span className="font-semibold text-success">{answeredQuestions.size}/{totalQuestions}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Marked</span>
          <span className="font-semibold text-warning">{markedForReview.size}</span>
        </div>
      </div>
    </div>
  );
}
