'use client';

import { CalculationRecord } from '@/types';

interface CalculationHistoryProps {
  history: CalculationRecord[];
  isDark: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
}

export default function CalculationHistory({
  history,
  isDark,
  isLoading,
  onRefresh,
}: CalculationHistoryProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl ${
      isDark
        ? 'bg-gray-900 shadow-black/30'
        : 'bg-white shadow-gray-200/80'
    }`}>
      {/* Header */}
      <div className={`px-5 py-4 flex items-center justify-between border-b ${
        isDark ? 'border-gray-800' : 'border-gray-100'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
          <h2 className={`font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Calculation Feed</h2>
          {history.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-gray-800 text-gray-400'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {history.length}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
            isDark
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          disabled={isLoading}
        >
          {isLoading ? '...' : '↻ Refresh'}
        </button>
      </div>

      {/* Feed */}
      <div className="h-96 lg:h-[500px] overflow-y-auto scrollbar-thin">
        {isLoading && history.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-sm ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Loading...
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="text-4xl">🧮</div>
            <div className={`text-sm ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              No calculations yet
            </div>
            <div className={`text-xs ${
              isDark ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Start calculating to see your feed!
            </div>
          </div>
        ) : (
          <div className="divide-y divide-opacity-50">
            {history.map((item, index) => (
              <div
                key={item.id}
                className={`px-5 py-4 transition-colors group animate-fade-in ${
                  isDark
                    ? 'divide-gray-800 hover:bg-gray-800/50'
                    : 'divide-gray-100 hover:bg-gray-50'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {/* Post header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">∑</span>
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>Calculator</span>
                    <span className={`text-xs ml-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      · {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Expression */}
                <div className={`text-sm mb-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.expression}
                </div>

                {/* Result */}
                <div className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  = {item.result}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => copyToClipboard(`${item.expression} = ${item.result}`)}
                    className={`text-xs flex items-center gap-1 transition-colors ${
                      isDark
                        ? 'text-gray-500 hover:text-violet-400'
                        : 'text-gray-400 hover:text-violet-600'
                    }`}
                  >
                    <span>📋</span>
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(item.result)}
                    className={`text-xs flex items-center gap-1 transition-colors ${
                      isDark
                        ? 'text-gray-500 hover:text-pink-400'
                        : 'text-gray-400 hover:text-pink-600'
                    }`}
                  >
                    <span>🔗</span>
                    <span>Share result</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
