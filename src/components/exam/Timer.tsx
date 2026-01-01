import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function Timer({ initialMinutes, onTimeUp, isPaused = false }: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (isPaused || totalSeconds <= 0) return;

    const interval = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, totalSeconds]);

  const isLowTime = totalSeconds <= 300; // 5 minutes
  const isCritical = totalSeconds <= 60; // 1 minute

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-all duration-300',
        isCritical
          ? 'bg-destructive text-destructive-foreground animate-pulse'
          : isLowTime
          ? 'bg-warning text-warning-foreground'
          : 'bg-card border border-border text-foreground'
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span>{formatTime(totalSeconds)}</span>
    </div>
  );
}
