'use client';

import { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';

export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory) {
      fetchHistory();
    }
    setShowHistory((prev) => !prev);
  };

  const handleCalculationSaved = () => {
    if (showHistory) {
      fetchHistory();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="w-full max-w-md mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">cc</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            {process.env.NEXT_PUBLIC_APP_NAME || 'cc'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-white/30 dark:border-slate-700/50 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
          <button
            onClick={() => setIsDark((d) => !d)}
            className="w-8 h-8 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur border border-white/30 dark:border-slate-700/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061l-1.591 1.59z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <Calculator onCalculationSaved={handleCalculationSaved} />
        {showHistory && (
          <CalculationHistory
            history={history}
            loading={historyLoading}
            onRefresh={fetchHistory}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
        <p>Made with ❤️ · cc calculator</p>
      </footer>
    </main>
  );
}
