'use client';

import { useRef } from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'operator' | 'special' | 'equals' | 'zero';
  className?: string;
}

export default function CalculatorButton({
  label,
  onClick,
  variant = 'default',
  className = '',
}: CalculatorButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onClick();
  };

  const baseClasses =
    'calculator-btn rounded-2xl font-semibold text-lg flex items-center justify-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1';

  const variantClasses = {
    default:
      'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 shadow-sm hover:shadow-md active:shadow-sm',
    operator:
      'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800/60 shadow-sm hover:shadow-md',
    special:
      'bg-slate-200/80 dark:bg-slate-600/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 shadow-sm',
    equals:
      'bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:from-violet-400 hover:to-purple-500 shadow-lg hover:shadow-xl shadow-violet-300 dark:shadow-violet-900',
    zero: 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-600 shadow-sm hover:shadow-md col-span-2',
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className} transition-all duration-150`}
    >
      {label}
    </button>
  );
}
