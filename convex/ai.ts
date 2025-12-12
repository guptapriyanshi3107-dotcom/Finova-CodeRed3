import { action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Optional: Convex action for server-side AI calls
export const getAIAdvice = action({
  args: {
    message: v.string(),
    includeContext: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user's financial context if requested
    let userContext = {};
    if (args.includeContext) {
      // You could fetch user's financial data here
      // const profile = await ctx.runQuery(internal.dashboard.getUserProfile);
      // const stats = await ctx.runQuery(internal.dashboard.getDashboardStats);
      // userContext = { ...profile, ...stats };
    }

    try {
      // Make request to Ollama (running locally)
      const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
      const ollamaModel = process.env.OLLAMA_MODEL || 'llama2'; // or mistral, codellama, etc.

      const response = await fetch(ollamaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: `You are FinPal, the AI financial assistant for Finova. You help users with financial advice, budgeting, and money management.

User asks: ${args.message}

${args.includeContext && Object.keys(userContext).length > 0 ? `User's financial context: ${JSON.stringify(userContext)}` : ''}

Provide helpful, actionable financial advice in a friendly tone.`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
            repetition_penalty: 1.1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.response) {
        // Optional: Store the interaction for analytics
        // await ctx.runMutation(internal.dashboard.logAIInteraction, {
        //   userId,
        //   question: args.message,
        //   response: data.response,
        //   timestamp: Date.now()
        // });

        return {
          response: data.response.trim(),
          source: 'ollama',
          model: ollamaModel,
          timestamp: Date.now()
        };
      } else {
        throw new Error('No response from Ollama model');
      }

    } catch (error) {
      console.error('Ollama AI Error:', error);
      
      // Fallback response
      return {
        response: "I'm having trouble connecting to my AI brain right now. Make sure Ollama is running locally (run 'ollama serve' in terminal). Please try again in a moment!",
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  },
});

// Optional: Action to check AI service health
export const checkAIHealth = action({
  args: {},
  handler: async (ctx) => {
    try {
      const ollamaEndpoint = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
      const ollamaModel = process.env.OLLAMA_MODEL || 'llama2';

      const response = await fetch(ollamaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaModel,
          prompt: 'Hello',
          stream: false,
          options: { 
            max_tokens: 10 
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'healthy',
          message: `Ollama is running with model: ${ollamaModel}`,
          model: ollamaModel,
          response: data.response || 'OK',
          timestamp: Date.now()
        };
      } else {
        return {
          status: 'error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          timestamp: Date.now()
        };
      }

    } catch (error) {
      return {
        status: 'error',
        message: 'Ollama connection failed. Make sure Ollama is running (ollama serve)',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  },
});

// Optional: List available Ollama models
export const listOllamaModels = action({
  args: {},
  handler: async (ctx) => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        models: data.models || [],
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('Failed to list Ollama models:', error);
      return {
        models: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  },
});