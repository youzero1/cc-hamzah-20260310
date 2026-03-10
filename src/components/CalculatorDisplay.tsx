'use client';

interface CalculatorDisplayProps {
  expression: string;
  current: string;
  justEvaluated: boolean;
}

export default function CalculatorDisplay({ expression, current, justEvaluated }: CalculatorDisplayProps) {
  const fontSize =
    current.length > 12
      ? 'text-2xl'
      : current.length > 8
      ? 'text-3xl'
      : current.length > 6
      ? 'text-4xl'
      : 'text-5xl';

  return (
    <div className="px-6 pt-6 pb-4 rounded-t-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Expression */}
      <div className="text-right min-h-[24px] mb-2">
        <p className="text-white/60 text-sm font-light truncate">
          {expression || '\u00a0'}
        </p>
      </div>

      {/* Current value */}
      <div className="text-right min-h-[64px] flex items-end justify-end">
        <p
          className={`text-white font-light tracking-tight transition-all duration-200 ${fontSize} ${
            justEvaluated ? 'text-white' : 'text-white'
          }`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {current || '0'}
        </p>
      </div>
    </div>
  );
}
