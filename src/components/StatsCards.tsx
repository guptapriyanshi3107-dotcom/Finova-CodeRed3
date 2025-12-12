import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function StatsCards() {
  const stats = useQuery(api.dashboard.getDashboardStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Monthly Income",
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      icon: "💰",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Monthly Expenses",
      value: `₹${stats.monthlyExpenses.toLocaleString()}`,
      icon: "💸",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Savings This Month",
      value: `₹${stats.savings.toLocaleString()}`,
      icon: "🏦",
      color: stats.savings >= 0 ? "text-green-600" : "text-red-600",
      bg: stats.savings >= 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Financial Score",
      value: `${stats.financialScore}/100`,
      icon: "📊",
      color: stats.financialScore >= 70 ? "text-green-600" : stats.financialScore >= 50 ? "text-yellow-600" : "text-red-600",
      bg: stats.financialScore >= 70 ? "bg-green-50" : stats.financialScore >= 50 ? "bg-yellow-50" : "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center text-xl`}>
              {card.icon}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{card.title}</h3>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
