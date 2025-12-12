import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function RecentTransactions() {
  const transactions = useQuery(api.dashboard.getRecentTransactions);

  if (!transactions) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
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
      "Salary": "💰",
      "Other": "📦"
    };
    return icons[category] || "📦";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
              }`}>
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No transactions yet</p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
