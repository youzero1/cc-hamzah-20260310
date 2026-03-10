'use client';

import { useState, useEffect } from 'react';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';
import { CalculationRecord } from '@/types';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      setIsDark(true);
    }
    fetchHistory();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculation = async (expression: string, result: string) => {
    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      if (res.ok) {
        fetchHistory();
      }
    } catch (err) {
      console.error('Failed to save calculation:', err);
    }
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'cc';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gray-950 text-white'
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark
          ? 'bg-gray-950/80 border-gray-800'
          : 'bg-gray-50/80 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{appName[0].toUpperCase()}</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              {appName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>Calculator</span>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isDark ? 'bg-violet-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle theme"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 flex items-center justify-center text-xs ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}>
                {isDark ? '🌙' : '☀️'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Calculator */}
          <div className="w-full lg:w-auto flex justify-center">
            <Calculator
              isDark={isDark}
              onCalculation={handleCalculation}
            />
          </div>

          {/* History Feed */}
          <div className="w-full lg:flex-1 lg:max-w-md">
            <CalculationHistory
              history={history}
              isDark={isDark}
              isLoading={isLoading}
              onRefresh={fetchHistory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
