'use client';

import { ButtonConfig } from '@/types';

interface CalculatorButtonProps {
  config: ButtonConfig;
  isDark: boolean;
  onClick: (value: string) => void;
  currentOperator: string | null;
}

export default function CalculatorButton({
  config,
  isDark,
  onClick,
  currentOperator,
}: CalculatorButtonProps) {
  const { label, value, type } = config;

  const isActiveOperator = type === 'operator' && currentOperator === value;

  const getButtonClasses = () => {
    const base = 'calculator-btn h-16 sm:h-18 text-xl font-semibold rounded-2xl transition-all duration-100 active:scale-95';

    if (type === 'equals') {
      return `${base} col-span-1 bg-gradient-to-br from-violet-500 to-pink-500 text-white hover:from-violet-400 hover:to-pink-400 shadow-lg shadow-violet-500/30`;
    }

    if (type === 'operator') {
      if (isActiveOperator) {
        return `${base} ${
          isDark
            ? 'bg-violet-400 text-gray-900'
            : 'bg-violet-600 text-white'
        }`;
      }
      return `${base} ${
        isDark
          ? 'bg-violet-600 text-white hover:bg-violet-500'
          : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
      }`;
    }

    if (type === 'action') {
      return `${base} ${
        isDark
          ? 'bg-gray-700 text-white hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`;
    }

    // number
    return `${base} ${
      isDark
        ? 'bg-gray-800 text-white hover:bg-gray-700'
        : 'bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-100'
    }`;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={() => onClick(value)}
      aria-label={label}
    >
      {label}
    </button>
  );
}
