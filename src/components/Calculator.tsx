'use client';

import { useState, useCallback, useEffect } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import ShareButton from './ShareButton';
import { evaluate } from '@/lib/calculator';

interface CalculatorProps {
  onCalculationSaved: () => void;
}

type ButtonConfig = {
  label: string;
  action: string;
  variant?: 'default' | 'operator' | 'special' | 'equals' | 'zero';
};

const BUTTONS: ButtonConfig[][] = [
  [
    { label: 'AC', action: 'clear', variant: 'special' },
    { label: '+/−', action: 'negate', variant: 'special' },
    { label: '%', action: '%', variant: 'special' },
    { label: '÷', action: '/', variant: 'operator' },
  ],
  [
    { label: '7', action: '7' },
    { label: '8', action: '8' },
    { label: '9', action: '9' },
    { label: '×', action: '*', variant: 'operator' },
  ],
  [
    { label: '4', action: '4' },
    { label: '5', action: '5' },
    { label: '6', action: '6' },
    { label: '−', action: '-', variant: 'operator' },
  ],
  [
    { label: '1', action: '1' },
    { label: '2', action: '2' },
    { label: '3', action: '3' },
    { label: '+', action: '+', variant: 'operator' },
  ],
  [
    { label: '0', action: '0', variant: 'zero' },
    { label: '.', action: '.' },
    { label: '=', action: '=', variant: 'equals' },
  ],
];

export default function Calculator({ onCalculationSaved }: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [current, setCurrent] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [lastExpression, setLastExpression] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const isOperator = (char: string) => ['+', '-', '*', '/'].includes(char);

  const handleButton = useCallback(
    async (action: string) => {
      if (action === 'clear') {
        setExpression('');
        setCurrent('0');
        setJustEvaluated(false);
        setLastExpression('');
        return;
      }

      if (action === 'negate') {
        if (current !== '0' && current !== '') {
          const negated = current.startsWith('-') ? current.slice(1) : '-' + current;
          setCurrent(negated);
          if (justEvaluated) {
            setExpression('');
            setJustEvaluated(false);
          }
        }
        return;
      }

      if (action === '=') {
        if (expression === '' && current === '0') return;
        const fullExpr = expression !== '' ? expression + current : current;
        if (fullExpr === '' || fullExpr === current) {
          // nothing to evaluate with operator
          if (!expression) return;
        }
        const result = evaluate(fullExpr);
        const displayExpr = fullExpr
          .replace(/\*/g, '×')
          .replace(/\//g, '÷')
          .replace(/-/g, '−');

        setLastExpression(displayExpr);
        setCurrent(result);
        setExpression('');
        setJustEvaluated(true);

        // Save to database
        if (result !== 'Error') {
          setSaving(true);
          setSaveError(false);
          try {
            await fetch('/api/calculations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ expression: displayExpr, result }),
            });
            onCalculationSaved();
          } catch {
            setSaveError(true);
          } finally {
            setSaving(false);
          }
        }
        return;
      }

      if (isOperator(action)) {
        if (justEvaluated) {
          setExpression(current + action);
          setCurrent('');
          setJustEvaluated(false);
          return;
        }
        if (current === '' && expression !== '') {
          // Replace last operator
          const trimmed = expression.slice(0, -1);
          setExpression(trimmed + action);
          return;
        }
        setExpression((prev) => prev + current + action);
        setCurrent('');
        setJustEvaluated(false);
        return;
      }

      if (action === '.') {
        if (justEvaluated) {
          setCurrent('0.');
          setExpression('');
          setJustEvaluated(false);
          return;
        }
        if (current.includes('.')) return;
        setCurrent((prev) => (prev === '' ? '0.' : prev + '.'));
        return;
      }

      if (action === '%') {
        if (current !== '') {
          const val = parseFloat(current);
          if (!isNaN(val)) {
            setCurrent(String(val / 100));
          }
        }
        return;
      }

      // Digit
      if (justEvaluated) {
        setCurrent(action);
        setExpression('');
        setJustEvaluated(false);
        return;
      }

      if (current === '0' && action !== '.') {
        setCurrent(action);
      } else {
        setCurrent((prev) => prev + action);
      }
    },
    [current, expression, justEvaluated, onCalculationSaved]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= '0' && key <= '9') handleButton(key);
      else if (key === '+') handleButton('+');
      else if (key === '-') handleButton('-');
      else if (key === '*') handleButton('*');
      else if (key === '/') { e.preventDefault(); handleButton('/'); }
      else if (key === 'Enter' || key === '=') handleButton('=');
      else if (key === 'Backspace') {
        if (current.length > 1) {
          setCurrent((prev) => prev.slice(0, -1));
        } else {
          setCurrent('0');
        }
      }
      else if (key === 'Escape') handleButton('clear');
      else if (key === '.') handleButton('.');
      else if (key === '%') handleButton('%');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleButton, current]);

  const displayExpression = justEvaluated
    ? lastExpression
    : expression
      ? expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−')
      : '';

  return (
    <div className="glass card-shadow rounded-3xl overflow-hidden animate-slide-up">
      {/* Display */}
      <CalculatorDisplay
        expression={displayExpression}
        current={current || '0'}
        justEvaluated={justEvaluated}
      />

      {/* Share bar */}
      {justEvaluated && current !== 'Error' && (
        <div className="px-5 py-2.5 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-between border-t border-white/10">
          <span className="text-white/60 text-xs">Result ready to share</span>
          <ShareButton expression={lastExpression} result={current} />
        </div>
      )}

      {/* Error/saving indicator */}
      {(saving || saveError) && (
        <div className="px-5 py-1 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center justify-end">
          {saving && <span className="text-white/50 text-xs">Saving...</span>}
          {saveError && <span className="text-red-300 text-xs">Failed to save</span>}
        </div>
      )}

      {/* Buttons */}
      <div className="p-4 grid grid-cols-4 gap-3">
        {BUTTONS.map((row, rowIndex) =>
          row.map((btn) => (
            <CalculatorButton
              key={`${rowIndex}-${btn.action}`}
              label={btn.label}
              onClick={() => handleButton(btn.action)}
              variant={btn.variant || 'default'}
              className={`h-16 ${btn.variant === 'zero' ? 'col-span-2' : ''}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
