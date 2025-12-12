import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    persona: v.union(v.literal("student"), v.literal("professional")),
    monthlyIncome: v.number(),
    avatar: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    category: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    description: v.string(),
    date: v.string(),
  }).index("by_user", ["userId"]),

  budgets: defineTable({
    userId: v.id("users"),
    category: v.string(),
    limit: v.number(),
    spent: v.number(),
    month: v.string(),
  }).index("by_user_month", ["userId", "month"]),

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
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
