'use client';

import { CalculationRecord } from '@/app/page';
import ShareButton from './ShareButton';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  loading: boolean;
  onRefresh: () => void;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CalculationHistory({ history, loading, onRefresh }: CalculationHistoryProps) {
  return (
    <div className="glass card-shadow rounded-3xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Calculation History</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500">No calculations yet</p>
            <p className="text-xs text-slate-300 dark:text-slate-600">Your history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Post header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">cc</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Calculator</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(item.createdAt)}</p>
                  </div>
                  <ShareButton expression={item.expression} result={item.result} />
                </div>

                {/* Calculation content */}
                <div className="ml-9 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl px-3 py-2 border border-violet-100 dark:border-violet-800/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.expression}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-slate-400 text-sm">=</span>
                    <p className="text-base font-bold text-violet-700 dark:text-violet-300 font-mono">{item.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
