import { useState } from "react";
import { ExpenseTracker } from "./ExpenseTracker";
import { GoalManager } from "./GoalManager";
import { BudgetPlanner } from "./BudgetPlanner";
import { AIChat } from "./AIChat";
import { LearnAndGrow } from "./LearnAndGrow";
import { SmartSuggestions } from "./SmartSuggestions";
import { InsightsReports } from "./InsightsReports";
import { Settings } from "./Settings";
import { InvestingTrading } from "./InvestingTrading";
import { Calculators } from "./Calculators";

interface PageManagerProps {
  activePage: string;
}

export function PageManager({ activePage }: PageManagerProps) {
  switch (activePage) {
    case "Ask FinPal":
      return <AIChat />;
    case "Budget Planner":
      return <BudgetPlanner />;
    case "Expense Tracker":
      return <ExpenseTracker />;
    case "Financial Goals":
      return <GoalManager />;
    case "Investing & Trading":
      return <InvestingTrading />;
    case "Smart Suggestions":
      return <SmartSuggestions />;
    case "Insights & Reports":
      return <InsightsReports />;
    case "Calculators":
      return <Calculators />;
    case "Learn & Grow":
      return <LearnAndGrow />;
    case "Settings":
      return <Settings />;
    default:
      return null;
  }
}
