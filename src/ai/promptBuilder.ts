interface UserContext {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
  financialScore?: number;
}

export function buildFinovaPrompt(userMessage: string, context?: UserContext): string {
  const basePrompt = `You are FinPal, the AI financial assistant for Finova - a smart financial management app. You provide personalized, practical financial advice in a friendly, encouraging tone.

**Your Personality:**
- Helpful and encouraging, never judgmental
- Use simple language, avoid complex financial jargon
- Provide actionable, specific advice
- Use Indian currency (₹) and context when relevant
- Keep responses concise but comprehensive
- Use emojis sparingly for emphasis

**Your Expertise:**
- Personal budgeting and expense tracking
- Savings strategies and emergency funds
- Investment basics (SIP, mutual funds, stocks)
- Tax planning (Indian tax system)
- Debt management and EMI planning
- Financial goal setting and achievement

**Response Guidelines:**
- Start with empathy/acknowledgment
- Provide 2-3 specific, actionable tips
- Include relevant numbers/percentages when helpful
- End with encouragement or next steps
- Keep responses under 200 words`;

  let contextPrompt = '';
  if (context) {
    contextPrompt = `\n**User's Financial Context:**`;
    if (context.monthlyIncome) contextPrompt += `\n- Monthly Income: ₹${context.monthlyIncome.toLocaleString()}`;
    if (context.monthlyExpenses) contextPrompt += `\n- Monthly Expenses: ₹${context.monthlyExpenses.toLocaleString()}`;
    if (context.savings) contextPrompt += `\n- Current Savings: ₹${context.savings.toLocaleString()}`;
    if (context.financialScore) contextPrompt += `\n- Financial Health Score: ${context.financialScore}/100`;
    
    contextPrompt += `\n\nUse this context to provide personalized advice.`;
  }

  const userPrompt = `\n\n**User Question:** ${userMessage}

**Your Response:**`;

  return basePrompt + contextPrompt + userPrompt;
}

// Pre-built prompts for common scenarios
export const commonPrompts = {
  welcome: "Welcome to Finova! I'm FinPal, your AI financial assistant. How can I help you with your finances today?",
  
  budgetHelp: "I'd love to help you create a budget! Based on your income and expenses, I can suggest a personalized budgeting strategy.",
  
  savingsGoal: "Setting savings goals is a great step! Let me help you create a realistic plan to reach your target.",
  
  investmentBasics: "Investing can seem complex, but I'll break it down into simple, actionable steps for you.",
  
  debtManagement: "Managing debt effectively is crucial for financial health. Let me share some proven strategies.",
  
  emergencyFund: "An emergency fund is your financial safety net. Here's how to build one step by step."
};

// Utility function to get context-aware suggestions
export function getContextualSuggestions(context?: UserContext): string[] {
  const suggestions = [];
  
  if (context?.monthlyIncome && context?.monthlyExpenses) {
    const savingsRate = ((context.monthlyIncome - context.monthlyExpenses) / context.monthlyIncome) * 100;
    
    if (savingsRate < 10) {
      suggestions.push("How can I increase my savings rate?");
    } else if (savingsRate > 20) {
      suggestions.push("What should I do with my extra savings?");
    }
  }
  
  if (context?.financialScore && context.financialScore < 60) {
    suggestions.push("How can I improve my financial health score?");
  }
  
  // Default suggestions
  suggestions.push(
    "Help me create a monthly budget",
    "What's the best way to start investing?",
    "How much should I save for emergencies?",
    "Tips for reducing my expenses"
  );
  
  return suggestions.slice(0, 4); // Return max 4 suggestions
}
