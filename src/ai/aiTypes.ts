// Type definitions for AI integration

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserFinancialContext {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
  financialScore?: number;
  recentTransactions?: Array<{
    type: 'income' | 'expense';
    amount: number;
    category: string;
  }>;
  goals?: Array<{
    name: string;
    targetAmount: number;
    savedAmount: number;
  }>;
}

export interface AIRequest {
  message: string;
  context?: UserFinancialContext;
  conversationHistory?: AIMessage[];
}

export interface AIResponse {
  success: boolean;
  message?: string;
  response?: string;  // Backend returns 'response' field
  suggestions?: string[];
  confidence?: number;
  source: 'granite' | 'fallback';
  error?: string;
}

export interface GraniteConfig {
  modelId: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  repetitionPenalty: number;
}

export const defaultGraniteConfig: GraniteConfig = {
  modelId: 'granite3.2:2b',
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repetitionPenalty: 1.1
};

// Backend health check response
export interface BackendHealthResponse {
  status: 'ok' | 'error' | 'warning';
  message: string;
  model?: string;
  available_models?: string[];
}

// Chat API request body
export interface ChatAPIRequest {
  message: string;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: UserFinancialContext;
}