import { AIChat } from "./AIChat";
import { BudgetPlanner } from "./BudgetPlanner";
import { ExpenseTracker } from "./ExpenseTracker";
import { GoalManager } from "./GoalManager";
import { InvestingTrading } from "./InvestingTrading";
import { SmartSuggestions } from "./SmartSuggestions";
import { InsightsReports } from "./InsightsReports";
import { Calculators } from "./Calculators";
import { LearnAndGrow } from "./LearnAndGrow";
import { Settings } from "./Settings";
import { Questionnaire } from "./Questionnaire";

interface PageManagerProps {
  activePage: string;
}

export function PageManager({ activePage }: PageManagerProps) {
  const renderPage = () => {
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
      case "Personality Test":
        return <Questionnaire onComplete={() => {}} />;
      case "Learn & Grow":
        return <LearnAndGrow />;
      case "Settings":
        return <Settings />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {activePage}
            </h2>
            <p className="text-gray-600">
              This feature is coming soon! We're working hard to bring you the best financial tools.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}
