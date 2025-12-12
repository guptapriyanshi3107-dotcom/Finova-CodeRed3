import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Existing tables
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    persona: v.union(v.literal("student"), v.literal("professional")),
    monthlyIncome: v.number(),
    monthlyExpenses: v.optional(v.number()),
    savings: v.optional(v.number()),
    existingDebts: v.optional(v.number()),
    financialGoals: v.optional(v.string()),
    financialScore: v.optional(v.number()),
    age: v.optional(v.number()),
    onboardingCompleted: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    description: v.string(),
    date: v.string(),
  }).index("by_user", ["userId"]),

  goals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    targetAmount: v.number(),
    savedAmount: v.number(),
    icon: v.string(),
    targetDate: v.string(),
  }).index("by_user", ["userId"]),

  insights: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("success"), v.literal("warning"), v.literal("tip")),
    message: v.string(),
    date: v.string(),
  }).index("by_user", ["userId"]),

  budgets: defineTable({
    userId: v.id("users"),
    category: v.string(),
    limit: v.number(),
    spent: v.number(),
    month: v.string(),
  }).index("by_user_month", ["userId", "month"]),

  // New questionnaire tables
  questions: defineTable({
    questionNumber: v.number(),
    section: v.union(
      v.literal("investor"),
      v.literal("big_spender"),
      v.literal("big_saver"),
      v.literal("ostrich"),
      v.literal("debtor")
    ),
    scenario: v.string(),
    personalityType: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
  }).index("by_number", ["questionNumber"]),

  questionOptions: defineTable({
    questionId: v.id("questions"),
    optionLetter: v.string(),
    optionText: v.string(),
    personalityIndicator: v.string(),
    points: v.number(),
    isBestAnswer: v.boolean(),
  }).index("by_question", ["questionId"]),

  userDailyQuestions: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    selectedOption: v.string(),
    pointsEarned: v.number(),
    answeredAt: v.number(),
    streakDay: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_date", ["userId", "answeredAt"]),

  userPersonality: defineTable({
    userId: v.id("users"),
    primaryType: v.string(),
    secondaryType: v.optional(v.string()),
    hybridType: v.optional(v.string()),
    confidenceScore: v.number(),
    investorScore: v.number(),
    spenderScore: v.number(),
    saverScore: v.number(),
    ostrichScore: v.number(),
    debtorScore: v.number(),
    lastUpdated: v.number(),
    questionsAnswered: v.number(),
  }).index("by_user", ["userId"]),

  userGamification: defineTable({
    userId: v.id("users"),
    totalPoints: v.number(),
    currentLevel: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    badgesEarned: v.array(v.string()),
    lastActivityDate: v.number(),
    weeklyPoints: v.number(),
    monthlyPoints: v.number(),
  }).index("by_user", ["userId"]),

  survivalAnalysis: defineTable({
    userId: v.id("users"),
    survivalMonths: v.number(),
    survivalScore: v.number(),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    monthlyBurnRate: v.number(),
    liquidSavings: v.number(),
    lastCalculated: v.number(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
