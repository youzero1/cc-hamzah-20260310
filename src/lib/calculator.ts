export function evaluate(expression: string): string {
  try {
    // Replace display operators with JS operators
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    // Safety check: only allow numbers and operators
    if (!/^[0-9+\-*/.() %]+$/.test(expr)) {
      return 'Error';
    }

    // Handle percentage
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + expr)();

    if (result === undefined || result === null) return 'Error';
    if (!isFinite(result)) return 'Error';
    if (isNaN(result)) return 'Error';

    // Format result
    const num = parseFloat(result.toFixed(10));
    return String(num);
  } catch {
    return 'Error';
  }
}

export function formatExpression(expression: string): string {
  return expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/-/g, '−');
}
