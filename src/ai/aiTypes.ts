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
  message: string;
  suggestions?: string[];
  confidence?: number;
  source: 'granite' | 'fallback';
}

export interface GraniteConfig {
  modelId: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  repetitionPenalty: number;
}

export const defaultGraniteConfig: GraniteConfig = {
  modelId: 'ibm/granite-13b-chat-v2',
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9,
  repetitionPenalty: 1.1
};
