import { useState, useRef, useCallback } from 'react';

export interface Session {
  startLabel: string;
  duration: string;
  durationMs: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function msToHMS(ms: number): string {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function useOfflineTimer() {
  const [isOffline, setIsOffline] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [totalTodayMs, setTotalTodayMs] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startOffline = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsOffline(true);
    setElapsedMs(0);

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 1000);
  }, []);

  const stopOffline = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const finalMs = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0;
    const now = new Date();
    const startLabel = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const duration = msToHMS(finalMs);

    const newSession: Session = { startLabel, duration, durationMs: finalMs };

    setIsOffline(false);
    setElapsedMs(0);
    setTotalTodayMs(prev => prev + finalMs);
    setSessionCount(prev => prev + 1);
    setHistory(prev => [newSession, ...prev].slice(0, 5));
    startTimeRef.current = null;

    return newSession;
  }, []);

  const toggle = useCallback(() => {
    if (isOffline) {
      return stopOffline();
    } else {
      startOffline();
      return null;
    }
  }, [isOffline, startOffline, stopOffline]);

  const invalidateSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsOffline(false);
    setElapsedMs(0);
    startTimeRef.current = null;
  }, []);

  return {
    isOffline,
    elapsedMs,
    totalTodayMs,
    sessionCount,
    history,
    toggle,
    invalidateSession,
  };
}
