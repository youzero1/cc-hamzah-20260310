'use client';

import { useState, useCallback } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorButton from './CalculatorButton';
import ShareButton from './ShareButton';
import { ButtonConfig } from '@/types';

interface CalculatorProps {
  isDark: boolean;
  onCalculation: (expression: string, result: string) => void;
}

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', value: 'AC', type: 'action' },
  { label: '+/-', value: 'NEGATE', type: 'action' },
  { label: '%', value: '%', type: 'action' },
  { label: '÷', value: '/', type: 'operator' },
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator' },
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '−', value: '-', type: 'operator' },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator' },
  { label: '⌫', value: 'BACK', type: 'action' },
  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: '=', type: 'equals' },
];

export default function Calculator({ isDark, onCalculation }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prevResult, setPrevResult] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const [lastExpression, setLastExpression] = useState<string>('');
  const [justCalculated, setJustCalculated] = useState(false);

  const formatNumber = (num: number): string => {
    if (!isFinite(num)) return 'Error';
    if (isNaN(num)) return 'Error';
    const str = num.toString();
    if (str.length > 12) {
      return parseFloat(num.toPrecision(10)).toString();
    }
    return str;
  };

  const calculate = (a: number, op: string, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/':
        if (b === 0) return NaN;
        return a / b;
      default: return b;
    }
  };

  const getOperatorSymbol = (op: string): string => {
    switch (op) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return op;
    }
  };

  const handleButton = useCallback((value: string) => {
    switch (value) {
      case 'AC': {
        setDisplay('0');
        setExpression('');
        setPrevResult(null);
        setOperator(null);
        setFirstOperand(null);
        setWaitingForSecond(false);
        setJustCalculated(false);
        break;
      }

      case 'BACK': {
        if (justCalculated) {
          setDisplay('0');
          setJustCalculated(false);
          break;
        }
        if (display.length > 1) {
          const newDisplay = display.slice(0, -1);
          setDisplay(newDisplay || '0');
        } else {
          setDisplay('0');
        }
        break;
      }

      case 'NEGATE': {
        const negated = (parseFloat(display) * -1).toString();
        setDisplay(negated);
        break;
      }

      case '%': {
        const pct = parseFloat(display) / 100;
        setDisplay(formatNumber(pct));
        break;
      }

      case '/': 
      case '*': 
      case '+': 
      case '-': {
        const current = parseFloat(display);

        if (firstOperand !== null && operator && !waitingForSecond && !justCalculated) {
          const result = calculate(parseFloat(firstOperand), operator, current);
          const resultStr = formatNumber(result);
          const expr = `${firstOperand} ${getOperatorSymbol(operator)} ${display}`;
          setDisplay(resultStr);
          setFirstOperand(resultStr);
          setExpression(`${resultStr} ${getOperatorSymbol(value)}`);
          setPrevResult(resultStr);
        } else {
          setFirstOperand(display);
          setExpression(`${display} ${getOperatorSymbol(value)}`);
        }

        setOperator(value);
        setWaitingForSecond(true);
        setJustCalculated(false);
        break;
      }

      case '=': {
        if (operator && firstOperand !== null) {
          const a = parseFloat(firstOperand);
          const b = parseFloat(display);
          const result = calculate(a, operator, b);
          const resultStr = formatNumber(result);
          const expr = `${firstOperand} ${getOperatorSymbol(operator)} ${display}`;

          if (resultStr === 'Error' || (display === '0' && operator === '/')) {
            setDisplay('Error');
            setExpression('');
          } else {
            setDisplay(resultStr);
            setExpression(`${expr} =`);
            setLastResult(resultStr);
            setLastExpression(expr);
            onCalculation(expr, resultStr);
          }

          setFirstOperand(null);
          setOperator(null);
          setWaitingForSecond(false);
          setJustCalculated(true);
          setPrevResult(resultStr);
        }
        break;
      }

      case '.': {
        if (justCalculated) {
          setDisplay('0.');
          setJustCalculated(false);
          break;
        }
        if (waitingForSecond) {
          setDisplay('0.');
          setWaitingForSecond(false);
          break;
        }
        if (!display.includes('.')) {
          setDisplay(display + '.');
        }
        break;
      }

      default: {
        // Number
        if (justCalculated) {
          setDisplay(value);
          setFirstOperand(null);
          setOperator(null);
          setExpression('');
          setJustCalculated(false);
          break;
        }
        if (waitingForSecond) {
          setDisplay(value);
          setWaitingForSecond(false);
        } else {
          if (display === '0') {
            setDisplay(value);
          } else {
            if (display.replace('-', '').replace('.', '').length >= 12) break;
            setDisplay(display + value);
          }
        }
        break;
      }
    }
  }, [display, expression, operator, firstOperand, waitingForSecond, justCalculated, onCalculation]);

  return (
    <div className={`w-80 sm:w-96 rounded-3xl shadow-2xl overflow-hidden ${
      isDark
        ? 'bg-gray-900 shadow-black/50'
        : 'bg-white shadow-gray-200/80'
    }`}>
      {/* Display */}
      <CalculatorDisplay
        display={display}
        expression={expression}
        isDark={isDark}
      />

      {/* Share button */}
      <div className={`px-4 pb-2 flex justify-end ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <ShareButton
          expression={lastExpression}
          result={lastResult}
          isDark={isDark}
        />
      </div>

      {/* Buttons */}
      <div className={`grid grid-cols-4 gap-3 p-4 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        {BUTTONS.map((btn) => (
          <CalculatorButton
            key={btn.value + btn.label}
            config={btn}
            isDark={isDark}
            onClick={handleButton}
            currentOperator={operator}
          />
        ))}
      </div>
    </div>
  );
}
