export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'equals';

export interface ButtonConfig {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}
