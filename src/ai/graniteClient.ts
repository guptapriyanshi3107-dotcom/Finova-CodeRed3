import { buildFinovaPrompt } from './promptBuilder';

interface GraniteResponse {
  results: Array<{
    generated_text: string;
    generated_token_count: number;
    input_token_count: number;
    stop_reason: string;
  }>;
}

interface FinovaAIRequest {
  message: string;
  userContext?: {
    monthlyIncome?: number;
    monthlyExpenses?: number;
    savings?: number;
    financialScore?: number;
  };
}

class GraniteClient {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GRANITE_API_KEY || '';
    this.endpoint = import.meta.env.VITE_GRANITE_ENDPOINT || 'https://bam-api.res.ibm.com/v1/text/chat';
    
    if (!this.apiKey) {
      console.warn('⚠️ VITE_GRANITE_API_KEY not found in environment variables');
    }
  }

  async askFinova({ message, userContext }: FinovaAIRequest): Promise<string> {
    if (!this.apiKey) {
      return "I'm sorry, but I'm not properly configured right now. Please check with your administrator about the API setup.";
    }

    try {
      const prompt = buildFinovaPrompt(message, userContext);
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model_id: 'ibm/granite-13b-chat-v2',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Granite API error: ${response.status} ${response.statusText}`);
      }

      const data: GraniteResponse = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].generated_text.trim();
      } else {
        throw new Error('No response from Granite model');
      }

    } catch (error) {
      console.error('Granite AI Error:', error);
      
      // Fallback to local responses for better UX
      return this.getFallbackResponse(message);
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    const fallbackResponses = {
      save: "Here are some great ways to save money: 1) Track your expenses daily, 2) Set up automatic transfers to savings, 3) Use the 50/30/20 rule, 4) Cook at home more often, 5) Cancel unused subscriptions.",
      budget: "Creating a budget is simple! Start with the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Track your spending for a month to see where your money goes.",
      emergency: "A good emergency fund should cover 3-6 months of essential expenses. Start small - even ₹500/month adds up! Keep it in a separate high-yield savings account.",
      invest: "If you have high-interest debt (>8%), pay that off first. Otherwise, start investing early! Consider SIPs in mutual funds, starting with ₹1000/month.",
      income: "Passive income ideas: 1) Dividend-paying stocks, 2) Digital products, 3) Rent out space, 4) Blog/YouTube, 5) REITs, 6) High-yield savings."
    };

    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (lowerMessage.includes(key)) {
        return `💡 **FinPal Tip:** ${response}`;
      }
    }

    return "That's a great financial question! I'd recommend focusing on tracking your expenses first - this gives you insights into where you can optimize. Would you like help creating a budget or setting up a savings goal?";
  }

  // Health check method
  async checkConnection(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model_id: 'ibm/granite-13b-chat-v2',
          messages: [{ role: 'user', content: 'Hello' }],
          parameters: { max_new_tokens: 10 }
        })
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const graniteClient = new GraniteClient();

// Export the main function for easy use
export const askFinova = (request: FinovaAIRequest) => graniteClient.askFinova(request);
