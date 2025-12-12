import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { StatsCards } from "./components/StatsCards";
import { QuickActions } from "./components/QuickActions";
import { PersonalizedInsights } from "./components/PersonalizedInsights";
import { GoalsProgress } from "./components/GoalsProgress";
import { SpendingBreakdown } from "./components/SpendingBreakdown";
import { AITip } from "./components/AITip";
import { RecentTransactions } from "./components/RecentTransactions";
import { PageManager } from "./components/PageManager";

export function Dashboard() {
  const userProfile = useQuery(api.dashboard.getUserProfile);
  const initializeSampleData = useMutation(api.dashboard.initializeSampleData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activePage, setActivePage] = useState("Overview");

  useEffect(() => {
    if (userProfile === null && !isInitialized) {
      initializeSampleData();
      setIsInitialized(true);
    }
  }, [userProfile, initializeSampleData, isInitialized]);

  if (userProfile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (userProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    if (activePage === "Overview") {
      return (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile.name}! 👋
            </h1>
            <p className="text-gray-600">
              Your financial overview is ready — Smart decisions. Simple money. Future ready.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PersonalizedInsights />
            <GoalsProgress />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <SpendingBreakdown />
            <RecentTransactions />
          </div>

          {/* AI Tip */}
          <AITip />

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-500">
            © 2025 Finova – Finance & Innovation. Powered by AI.
          </footer>
        </>
      );
    }

    return (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {activePage}
          </h1>
          <p className="text-gray-600">
            {getPageDescription(activePage)}
          </p>
        </div>
        <PageManager activePage={activePage} />
      </>
    );
  };

  const getPageDescription = (page: string) => {
    const descriptions: Record<string, string> = {
      "Ask FinPal": "Get personalized financial advice from your AI assistant",
      "Budget Planner": "Create and manage your monthly budgets",
      "Expense Tracker": "Track your income and expenses",
      "Financial Goals": "Set and monitor your savings goals",
      "Smart Suggestions": "AI-powered recommendations to optimize your finances",
      "Insights & Reports": "Detailed analysis of your financial data",
      "Learn & Grow": "Educational content to improve your financial literacy",
      "Settings": "Manage your account and preferences"
    };
    return descriptions[page] || "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}
