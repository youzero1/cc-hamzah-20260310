'use client';

import { useState } from 'react';

interface ShareButtonProps {
  expression: string;
  result: string;
  isDark: boolean;
}

export default function ShareButton({ expression, result, isDark }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!expression || !result) return;

    const text = `🧮 ${expression} = ${result}\n\nCalculated with cc`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy to clipboard');
    }
  };

  const isDisabled = !expression || !result;

  return (
    <button
      onClick={handleShare}
      disabled={isDisabled}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200 ${
        isDisabled
          ? isDark
            ? 'text-gray-600 cursor-not-allowed'
            : 'text-gray-300 cursor-not-allowed'
          : copied
          ? 'bg-green-500 text-white'
          : isDark
          ? 'bg-gray-800 text-gray-300 hover:bg-violet-600 hover:text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700'
      }`}
    >
      {copied ? (
        <><span>✓</span><span>Copied!</span></>
      ) : (
        <><span>🔗</span><span>Share</span></>
      )}
    </button>
  );
}
