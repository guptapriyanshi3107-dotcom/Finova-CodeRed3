import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const budgetCategories = [
  { name: "Food", icon: "🍽️", suggested: 8000 },
  { name: "Travel", icon: "🚗", suggested: 3000 },
  { name: "Shopping", icon: "🛍️", suggested: 5000 },
  { name: "Bills", icon: "📄", suggested: 4000 },
  { name: "Entertainment", icon: "🎬", suggested: 2000 },
  { name: "Health", icon: "🏥", suggested: 2000 },
  { name: "Education", icon: "📚", suggested: 1000 },
  { name: "Other", icon: "📦", suggested: 2000 }
];

export function BudgetPlanner() {
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [isEditing, setIsEditing] = useState(false);

  const createBudget = useMutation(api.dashboard.createBudget);
  const userBudgets = useQuery(api.dashboard.getUserBudgets);

  const handleSaveBudgets = async () => {
    try {
      for (const [category, limit] of Object.entries(budgets)) {
        if (limit > 0) {
          await createBudget({ category, limit });
        }
      }
      toast.success("Budgets saved successfully!");
      setIsEditing(false);
      setBudgets({});
    } catch (error) {
      toast.error("Failed to save budgets");
    }
  };

  const getBudgetStatus = (category: string, spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { color: "text-red-600 bg-red-50 border-red-200", status: "Over Budget" };
    if (percentage >= 80) return { color: "text-orange-600 bg-orange-50 border-orange-200", status: "Near Limit" };
    return { color: "text-green-600 bg-green-50 border-green-200", status: "On Track" };
  };

  const totalBudget = userBudgets?.reduce((sum, b) => sum + b.limit, 0) || 0;
  const totalSpent = userBudgets?.reduce((sum, b) => sum + b.spent, 0) || 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Budget Planner</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Budget"}
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Budget</p>
          <p className="text-2xl font-bold text-blue-700">₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Spent</p>
          <p className="text-2xl font-bold text-red-700">₹{totalSpent.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg border ${
          totalSpent <= totalBudget 
            ? "bg-green-50 border-green-200" 
            : "bg-red-50 border-red-200"
        }`}>
          <p className={`text-sm font-medium ${
            totalSpent <= totalBudget ? "text-green-600" : "text-red-600"
          }`}>
            Remaining
          </p>
          <p className={`text-2xl font-bold ${
            totalSpent <= totalBudget ? "text-green-700" : "text-red-700"
          }`}>
            ₹{(totalBudget - totalSpent).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {isEditing ? (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Set Monthly Budget Limits</h3>
            {budgetCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">Suggested: ₹{category.suggested.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">₹</span>
                  <input
                    type="number"
                    value={budgets[category.name] || ""}
                    onChange={(e) => setBudgets(prev => ({
                      ...prev,
                      [category.name]: parseFloat(e.target.value) || 0
                    }))}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder={category.suggested.toString()}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleSaveBudgets}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Save Budget Plan
            </button>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Current Month Budget Status</h3>
            {userBudgets?.map((budget) => {
              const status = getBudgetStatus(budget.category, budget.spent, budget.limit);
              const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
              
              return (
                <div key={budget._id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {budgetCategories.find(c => c.name === budget.category)?.icon || "📦"}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{budget.category}</h4>
                        <p className="text-sm text-gray-600">
                          ₹{budget.spent.toLocaleString()} of ₹{budget.limit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        {status.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {Math.round(percentage)}% used
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        percentage >= 100 ? "bg-red-500" :
                        percentage >= 80 ? "bg-orange-500" : "bg-green-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {userBudgets?.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 mb-4">No budget set yet</p>
                <p className="text-sm text-gray-400 mb-4">
                  Create your first budget to track spending limits!
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Create Budget Plan
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
