import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SpendingBreakdown() {
  const breakdown = useQuery(api.dashboard.getSpendingBreakdown);

  if (!breakdown) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Spending Breakdown</h2>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Food": "🍽️",
      "Travel": "🚗",
      "Shopping": "🛍️",
      "Bills": "📄",
      "Entertainment": "🎬",
      "Health": "🏥",
      "Education": "📚",
      "Other": "📦"
    };
    return icons[category] || "📦";
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-teal-500",
      "bg-pink-500",
      "bg-indigo-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Spending Breakdown</h2>
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getCategoryIcon(item.category)}</span>
                <span className="font-medium text-gray-900">{item.category}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{item.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{item.percentage}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getCategoryColor(index)}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        {breakdown.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No expenses this month</p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Add Your First Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
