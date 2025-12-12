import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const categories = [
  { name: "Food", icon: "🍽️" },
  { name: "Travel", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Bills", icon: "📄" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Health", icon: "🏥" },
  { name: "Education", icon: "📚" },
  { name: "Salary", icon: "💰" },
  { name: "Other", icon: "📦" }
];

export function ExpenseTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    description: ""
  });

  const addTransaction = useMutation(api.dashboard.addTransaction);
  const transactions = useQuery(api.dashboard.getRecentTransactions);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addTransaction({
        amount: parseFloat(formData.amount),
        category: formData.category,
        type: formData.type,
        description: formData.description
      });

      toast.success(`${formData.type === "income" ? "Income" : "Expense"} added successfully!`);
      setFormData({ amount: "", category: "", type: "expense", description: "" });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add transaction");
    }
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.name === category)?.icon || "📦";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Expense Tracker</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Add Transaction
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">This Month Income</p>
          <p className="text-2xl font-bold text-green-700">
            ₹{transactions?.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0).toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">This Month Expenses</p>
          <p className="text-2xl font-bold text-red-700">
            ₹{transactions?.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0).toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        {transactions?.slice(0, 5).map((transaction, index) => (
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
      </div>

      {/* Add Transaction Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Transaction</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Selection */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "expense" }))}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.type === "expense"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: "income" }))}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    formData.type === "income"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="0"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="What was this for?"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Add {formData.type === "income" ? "Income" : "Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
