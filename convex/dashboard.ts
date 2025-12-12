import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create or update user profile
export const createUserProfile = mutation({
  args: {
    name: v.string(),
    persona: v.union(v.literal("student"), v.literal("professional")),
    monthlyIncome: v.number(),
    monthlyExpenses: v.optional(v.number()),
    savings: v.optional(v.number()),
    existingDebts: v.optional(v.number()),
    financialGoals: v.optional(v.string()),
    age: v.optional(v.number()),
    financialScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if profile exists
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const profileData = {
      userId,
      name: args.name,
      persona: args.persona,
      monthlyIncome: args.monthlyIncome,
      monthlyExpenses: args.monthlyExpenses || 0,
      savings: args.savings || 0,
      existingDebts: args.existingDebts || 0,
      financialGoals: args.financialGoals || "",
      age: args.age || 25,
      financialScore: args.financialScore || 0,
      onboardingCompleted: true,
    };

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, profileData);
      
      // Update survival analysis
      await updateSurvivalAnalysis(ctx, userId, args.monthlyExpenses || 0, args.savings || 0);
      
      return existingProfile._id;
    } else {
      const profileId = await ctx.db.insert("userProfiles", profileData);
      
      // Create survival analysis
      await updateSurvivalAnalysis(ctx, userId, args.monthlyExpenses || 0, args.savings || 0);
      
      return profileId;
    }
  },
});

// Helper function to update survival analysis
async function updateSurvivalAnalysis(ctx: any, userId: any, monthlyExpenses: number, savings: number) {
  try {
    const survivalMonths = monthlyExpenses > 0 ? savings / monthlyExpenses : 0;
    const survivalScore = Math.min(100, Math.round(survivalMonths * 16.67)); // 6 months = 100 points
    
    let riskLevel: "low" | "medium" | "high" = "high";
    if (survivalMonths >= 6) riskLevel = "low";
    else if (survivalMonths >= 3) riskLevel = "medium";

    const existingSurvival = await ctx.db
      .query("survivalAnalysis")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();

    const survivalData = {
      userId,
      survivalMonths: Math.round(survivalMonths * 10) / 10,
      survivalScore,
      riskLevel,
      monthlyBurnRate: monthlyExpenses,
      liquidSavings: savings,
      lastCalculated: Date.now(),
    };

    if (existingSurvival) {
      await ctx.db.patch(existingSurvival._id, survivalData);
    } else {
      await ctx.db.insert("survivalAnalysis", survivalData);
    }
  } catch (error) {
    console.error("Error updating survival analysis:", error);
    // Don't throw error to prevent profile creation from failing
  }
}

// Get user profile
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Get survival analysis
export const getSurvivalAnalysis = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("survivalAnalysis")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Initialize sample data for demo
export const initializeSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Sample transactions
    const sampleTransactions = [
      { amount: 50000, category: "Salary", type: "income" as const, description: "Monthly Salary", date: "2024-01-01" },
      { amount: 15000, category: "Rent", type: "expense" as const, description: "Monthly Rent", date: "2024-01-02" },
      { amount: 5000, category: "Food", type: "expense" as const, description: "Groceries", date: "2024-01-03" },
      { amount: 3000, category: "Transport", type: "expense" as const, description: "Fuel & Transport", date: "2024-01-04" },
      { amount: 2000, category: "Entertainment", type: "expense" as const, description: "Movies & Dining", date: "2024-01-05" },
    ];

    // Sample goals
    const sampleGoals = [
      { name: "Emergency Fund", targetAmount: 300000, savedAmount: 150000, icon: "🛡️", targetDate: "2024-12-31" },
      { name: "Vacation", targetAmount: 100000, savedAmount: 25000, icon: "✈️", targetDate: "2024-06-30" },
      { name: "New Laptop", targetAmount: 80000, savedAmount: 60000, icon: "💻", targetDate: "2024-03-31" },
    ];

    // Sample insights
    const sampleInsights = [
      { type: "success" as const, message: "Great job! You saved 30% of your income this month.", date: "2024-01-15" },
      { type: "warning" as const, message: "Your entertainment spending increased by 20% this month.", date: "2024-01-14" },
      { type: "tip" as const, message: "Consider setting up an SIP to automate your investments.", date: "2024-01-13" },
    ];

    // Insert sample data
    for (const transaction of sampleTransactions) {
      await ctx.db.insert("transactions", { userId, ...transaction });
    }

    for (const goal of sampleGoals) {
      await ctx.db.insert("goals", { userId, ...goal });
    }

    for (const insight of sampleInsights) {
      await ctx.db.insert("insights", { userId, ...insight });
    }

    return { message: "Sample data initialized successfully" };
  },
});

// Get dashboard stats
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (!profile) return null;

    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
    const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

    return {
      monthlyIncome: profile.monthlyIncome,
      monthlyExpenses: profile.monthlyExpenses,
      totalSavings: profile.savings,
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      totalSaved,
      totalGoalTarget,
      goalsProgress: totalGoalTarget > 0 ? Math.round((totalSaved / totalGoalTarget) * 100) : 0,
      financialScore: profile.financialScore || 0,
    };
  },
});

// Get recent transactions
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

// Get goals
export const getGoals = query({
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

// Get insights
export const getInsights = query({
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

// Add transaction
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

    return await ctx.db.insert("transactions", {
      userId,
      ...args,
      date: new Date().toISOString().split('T')[0],
    });
  },
});

// Create goal
export const createGoal = mutation({
  args: {
    name: v.string(),
    targetAmount: v.number(),
    targetDate: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("goals", {
      userId,
      ...args,
      savedAmount: 0,
    });
  },
});

// Update goal savings
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
      throw new Error("Goal not found");
    }

    await ctx.db.patch(args.goalId, {
      savedAmount: goal.savedAmount + args.amount,
    });
  },
});

// Create budget
export const createBudget = mutation({
  args: {
    category: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const currentMonth = new Date().toISOString().slice(0, 7);

    return await ctx.db.insert("budgets", {
      userId,
      category: args.category,
      limit: args.limit,
      spent: 0,
      month: currentMonth,
    });
  },
});

// Get user budgets
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

// Get spending breakdown
export const getSpendingBreakdown = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("type"), "expense"))
      .collect();

    const breakdown = transactions.reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: 0, // Will be calculated on frontend
    }));
  },
});
