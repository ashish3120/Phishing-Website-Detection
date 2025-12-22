
export enum PredictionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface PredictionResult {
  url: string;
  isPhishing: boolean;
  confidence?: number;
  message?: string;
}

export interface AIAnalysis {
  summary: string;
  threatLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recommendation: string;
}
