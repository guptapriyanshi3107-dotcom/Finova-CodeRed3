import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function QuickActions() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showSetGoal, setShowSetGoal] = useState(false);
  
  const addTransaction = useMutation(api.dashboard.addTransaction);
  const createGoal = useMutation(api.dashboard.createGoal);

  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    category: "Food"
  });

  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    description: "",
    source: "Salary"
  });

  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: ""
  });

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        type: "expense",
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category
      });
      toast.success("Expense added successfully!");
      setExpenseForm({ amount: "", description: "", category: "Food" });
      setShowAddExpense(false);
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        type: "income",
        amount: parseFloat(incomeForm.amount),
        description: incomeForm.description,
        category: incomeForm.source
      });
      toast.success("Income added successfully!");
      setIncomeForm({ amount: "", description: "", source: "Salary" });
      setShowAddIncome(false);
    } catch (error) {
      toast.error("Failed to add income");
    }
  };

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGoal({
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        icon: "🎯",
        targetDate: goalForm.deadline
      });
      toast.success("Goal created successfully!");
      setGoalForm({ name: "", targetAmount: "", currentAmount: "0", deadline: "" });
      setShowSetGoal(false);
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const quickActions = [
    {
      icon: "💸",
      label: "Add Expense",
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      textColor: "text-red-700",
      onClick: () => setShowAddExpense(true)
    },
    {
      icon: "💰",
      label: "Add Income",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      textColor: "text-green-700",
      onClick: () => setShowAddIncome(true)
    },
    {
      icon: "🎯",
      label: "Set Goal",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      textColor: "text-blue-700",
      onClick: () => setShowSetGoal(true)
    },
    {
      icon: "📊",
      label: "View Reports",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      textColor: "text-purple-700",
      onClick: () => toast.info("Navigate to Insights & Reports section")
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${action.color} ${action.textColor}`}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💸 Add Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Add Income</h3>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={incomeForm.source}
                  onChange={(e) => setIncomeForm(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddIncome(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Goal Modal */}
      {showSetGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Set Financial Goal</h3>
            <form onSubmit={handleSetGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                <input
                  type="text"
                  value={goalForm.name}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Emergency Fund, Vacation"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={goalForm.targetAmount}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Amount (₹)</label>
                <input
                  type="number"
                  value={goalForm.currentAmount}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSetGoal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
