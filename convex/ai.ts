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
      // Make request to IBM Granite API
      const graniteEndpoint = process.env.GRANITE_ENDPOINT || 'https://bam-api.res.ibm.com/v1/text/chat';
      const graniteApiKey = process.env.GRANITE_API_KEY;

      if (!graniteApiKey) {
        throw new Error("Granite API key not configured");
      }

      const response = await fetch(graniteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${graniteApiKey}`,
        },
        body: JSON.stringify({
          model_id: 'ibm/granite-13b-chat-v2',
          messages: [
            {
              role: 'user',
              content: `You are FinPal, the AI financial assistant for Finova. User asks: ${args.message}`
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
        throw new Error(`Granite API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Optional: Store the interaction for analytics
        // await ctx.runMutation(internal.dashboard.logAIInteraction, {
        //   userId,
        //   question: args.message,
        //   response: data.results[0].generated_text,
        //   timestamp: Date.now()
        // });

        return {
          response: data.results[0].generated_text.trim(),
          source: 'granite',
          timestamp: Date.now()
        };
      } else {
        throw new Error('No response from Granite model');
      }

    } catch (error) {
      console.error('Granite AI Error:', error);
      
      // Fallback response
      return {
        response: "I'm having trouble connecting to my AI brain right now. Please try again in a moment!",
        source: 'fallback',
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
      const graniteEndpoint = process.env.GRANITE_ENDPOINT || 'https://bam-api.res.ibm.com/v1/text/chat';
      const graniteApiKey = process.env.GRANITE_API_KEY;

      if (!graniteApiKey) {
        return { status: 'error', message: 'API key not configured' };
      }

      const response = await fetch(graniteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${graniteApiKey}`,
        },
        body: JSON.stringify({
          model_id: 'ibm/granite-13b-chat-v2',
          messages: [{ role: 'user', content: 'Hello' }],
          parameters: { max_new_tokens: 10 }
        })
      });

      return {
        status: response.ok ? 'healthy' : 'error',
        message: response.ok ? 'AI service is running' : `HTTP ${response.status}`,
        timestamp: Date.now()
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'Connection failed',
        timestamp: Date.now()
      };
    }
  },
});
