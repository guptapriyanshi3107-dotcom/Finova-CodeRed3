import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Sidebar } from "./components/Sidebar";
import { PageManager } from "./components/PageManager";
import { StatsCards } from "./components/StatsCards";
import { SurvivalScoreCard } from "./components/SurvivalScoreCard";
import { FinancialCertificate } from "./components/FinancialCertificate";
import { RecentTransactions } from "./components/RecentTransactions";
import { PersonalizedInsights } from "./components/PersonalizedInsights";

export function Dashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profile = useQuery(api.dashboard.getUserProfile);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const renderDashboardContent = () => (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
        <p className="text-teal-100">
          Here's your financial overview for today. Keep up the great work!
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Survival Analysis */}
      <SurvivalScoreCard />

      {/* Financial Certificate */}
      <FinancialCertificate />

      {/* Recent Activity & Insights */}
      <div className="grid lg:grid-cols-2 gap-8">
        <RecentTransactions />
        <PersonalizedInsights />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activePage === "Overview" ? (
              renderDashboardContent()
            ) : (
              <PageManager activePage={activePage} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
