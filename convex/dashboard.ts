import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const createUserProfile = mutation({
  args: {
    name: v.string(),
    persona: v.union(v.literal("student"), v.literal("professional")),
    monthlyIncome: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("userProfiles", {
      userId,
      name: args.name,
      persona: args.persona,
      monthlyIncome: args.monthlyIncome,
    });
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Get current month transactions
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const currentMonthTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyIncome = profile.monthlyIncome;
    const savings = monthlyIncome - monthlyExpenses;
    const financialScore = Math.min(100, Math.max(0, 50 + (savings / monthlyIncome) * 50));

    return {
      monthlyIncome,
      monthlyExpenses,
      savings,
      financialScore: Math.round(financialScore),
    };
  },
});

export const getSpendingBreakdown = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const currentMonthExpenses = transactions.filter(t => 
      t.type === "expense" && t.date.startsWith(currentMonth)
    );

    const categoryTotals: Record<string, number> = {};
    currentMonthExpenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  },
});

export const getUserGoals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getUserInsights = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5);
  },
});

export const getRecentTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const addTransaction = mutation({
  args: {
    amount: v.number(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const transactionId = await ctx.db.insert("transactions", {
      userId,
      amount: args.amount,
      category: args.category,
      type: args.type,
      description: args.description,
      date: new Date().toISOString().split('T')[0],
    });

    // Update budget spending if it's an expense
    if (args.type === "expense") {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const budget = await ctx.db
        .query("budgets")
        .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("month", currentMonth))
        .filter((q) => q.eq(q.field("category"), args.category))
        .first();

      if (budget) {
        await ctx.db.patch(budget._id, {
          spent: budget.spent + args.amount,
        });
      }
    }

    return transactionId;
  },
});

export const createGoal = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    icon: v.string(),
    targetDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("goals", {
      userId,
      name: args.name,
      targetAmount: args.targetAmount,
      savedAmount: 0,
      icon: args.icon,
      targetDate: args.targetDate,
    });
  },
});

export const updateGoalSavings = mutation({
  args: {
    goalId: v.id("goals"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== userId) {
      throw new Error("Goal not found or unauthorized");
    }

    await ctx.db.patch(args.goalId, {
      savedAmount: goal.savedAmount + args.amount,
    });

    return null;
  },
});

export const getUserBudgets = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const currentMonth = new Date().toISOString().slice(0, 7);

    return await ctx.db
      .query("budgets")
      .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("month", currentMonth))
      .collect();
  },
});

export const createBudget = mutation({
  args: {
    category: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const currentMonth = new Date().toISOString().slice(0, 7);

    // Check if budget already exists for this category and month
    const existingBudget = await ctx.db
      .query("budgets")
      .withIndex("by_user_month", (q) => q.eq("userId", userId).eq("month", currentMonth))
      .filter((q) => q.eq(q.field("category"), args.category))
      .first();

    if (existingBudget) {
      // Update existing budget
      await ctx.db.patch(existingBudget._id, {
        limit: args.limit,
      });
      return existingBudget._id;
    } else {
      // Calculate current spending for this category
      const transactions = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      const currentMonthSpending = transactions
        .filter(t => t.type === "expense" && t.category === args.category && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0);

      // Create new budget
      return await ctx.db.insert("budgets", {
        userId,
        category: args.category,
        limit: args.limit,
        spent: currentMonthSpending,
        month: currentMonth,
      });
    }
  },
});

export const getAIResponse = action({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Simple AI responses for demo - in production, you'd use OpenAI API
    const responses = {
      "save": "Here are some great ways to save money: 1) Track your expenses daily, 2) Set up automatic transfers to savings, 3) Use the 50/30/20 rule (50% needs, 30% wants, 20% savings), 4) Cook at home more often, 5) Cancel unused subscriptions.",
      "budget": "Creating a budget is simple! Start with the 50/30/20 rule: 50% for needs (rent, groceries, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. Track your spending for a month to see where your money goes, then adjust accordingly.",
      "emergency": "A good emergency fund should cover 3-6 months of your essential expenses. Start small - even ₹500/month adds up! Keep it in a separate high-yield savings account that's easily accessible but not too tempting to spend from.",
      "invest": "If you have high-interest debt (>8% interest), pay that off first. Otherwise, start investing early! Consider SIPs in mutual funds, start with ₹1000/month. The power of compounding works best with time.",
      "income": "Passive income ideas: 1) Invest in dividend-paying stocks, 2) Create digital products or courses, 3) Rent out a room, 4) Start a blog or YouTube channel, 5) Invest in REITs, 6) Build an emergency fund that earns interest."
    };

    const message = args.message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Default response
    return "That's a great financial question! Based on your current spending patterns, I'd recommend focusing on tracking your expenses first. This will give you insights into where you can optimize. Would you like me to help you create a budget or set up a savings goal?";
  },
});

// Initialize sample data for new users
export const initializeSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has data
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) return;

    // Create sample profile
    await ctx.db.insert("userProfiles", {
      userId,
      name: "Kshitiz",
      persona: "professional",
      monthlyIncome: 45000,
    });

    // Add sample transactions
    const sampleTransactions = [
      { amount: 1200, category: "Food", type: "expense" as const, description: "Groceries" },
      { amount: 800, category: "Travel", type: "expense" as const, description: "Metro card" },
      { amount: 2500, category: "Shopping", type: "expense" as const, description: "Clothes" },
      { amount: 1500, category: "Bills", type: "expense" as const, description: "Electricity" },
      { amount: 45000, category: "Salary", type: "income" as const, description: "Monthly salary" },
    ];

    for (const transaction of sampleTransactions) {
      await ctx.db.insert("transactions", {
        userId,
        ...transaction,
        date: new Date().toISOString().split('T')[0],
      });
    }

    // Add sample goals
    await ctx.db.insert("goals", {
      userId,
      name: "Laptop Goal",
      targetAmount: 30000,
      savedAmount: 12000,
      icon: "💻",
      targetDate: "2025-06-01",
    });

    await ctx.db.insert("goals", {
      userId,
      name: "Emergency Fund",
      targetAmount: 50000,
      savedAmount: 8000,
      icon: "🛡️",
      targetDate: "2025-12-31",
    });

    // Add sample insights
    await ctx.db.insert("insights", {
      userId,
      type: "success",
      message: "You spent 12% less on food this month — great job!",
      date: new Date().toISOString().split('T')[0],
    });

    await ctx.db.insert("insights", {
      userId,
      type: "warning",
      message: "You crossed your shopping limit by ₹1,200 — consider reducing next month.",
      date: new Date().toISOString().split('T')[0],
    });

    await ctx.db.insert("insights", {
      userId,
      type: "tip",
      message: "You're on track to reach your laptop goal in 4 months.",
      date: new Date().toISOString().split('T')[0],
    });

    // Add sample budgets
    const currentMonth = new Date().toISOString().slice(0, 7);
    const sampleBudgets = [
      { category: "Food", limit: 8000, spent: 1200 },
      { category: "Travel", limit: 3000, spent: 800 },
      { category: "Shopping", limit: 5000, spent: 2500 },
      { category: "Bills", limit: 4000, spent: 1500 },
    ];

    for (const budget of sampleBudgets) {
      await ctx.db.insert("budgets", {
        userId,
        ...budget,
        month: currentMonth,
      });
    }
  },
});
