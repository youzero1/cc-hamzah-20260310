'use client';

interface CalculatorDisplayProps {
  display: string;
  expression: string;
  isDark: boolean;
}

export default function CalculatorDisplay({
  display,
  expression,
  isDark,
}: CalculatorDisplayProps) {
  const isError = display === 'Error';

  const getFontSize = () => {
    const len = display.length;
    if (len <= 6) return 'text-5xl sm:text-6xl';
    if (len <= 9) return 'text-4xl sm:text-5xl';
    if (len <= 12) return 'text-3xl sm:text-4xl';
    return 'text-2xl sm:text-3xl';
  };

  return (
    <div className={`px-6 pt-8 pb-4 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Expression */}
      <div className={`h-6 text-right text-sm truncate mb-2 ${
        isDark ? 'text-gray-400' : 'text-gray-400'
      }`}>
        {expression || '\u00A0'}
      </div>

      {/* Main display */}
      <div
        className={`text-right font-light tracking-tight transition-all duration-100 ${
          getFontSize()
        } ${
          isError
            ? 'text-red-500'
            : isDark
            ? 'text-white'
            : 'text-gray-900'
        }`}
      >
        {display}
      </div>

      {/* Divider */}
      <div className={`mt-4 h-px ${
        isDark ? 'bg-gray-800' : 'bg-gray-100'
      }`} />
    </div>
  );
}
