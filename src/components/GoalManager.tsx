import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

const goalIcons = [
  "💻", "🏠", "🚗", "✈️", "🎓", "💍", "🛡️", "📱", "🎯", "💰"
];

export function GoalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    icon: "🎯",
    targetDate: ""
  });

  const createGoal = useMutation(api.dashboard.createGoal);
  const updateGoalSavings = useMutation(api.dashboard.updateGoalSavings);
  const goals = useQuery(api.dashboard.getUserGoals);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createGoal({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        icon: formData.icon,
        targetDate: formData.targetDate
      });

      toast.success("Goal created successfully!");
      setFormData({ name: "", targetAmount: "", icon: "🎯", targetDate: "" });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to create goal");
    }
  };

  const handleAddSavings = async (goalId: any, amount: number) => {
    try {
      await updateGoalSavings({ goalId, amount });
      toast.success("Savings added to goal!");
    } catch (error) {
      toast.error("Failed to update goal");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Financial Goals</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          New Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        {goals?.map((goal, index) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          const monthlyNeeded = daysLeft > 0 ? (goal.targetAmount - goal.savedAmount) / (daysLeft / 30) : 0;
          
          return (
            <div key={goal._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{goal.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                    <p className="text-sm text-gray-600">
                      ₹{goal.savedAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{Math.round(progress)}%</p>
                  <p className="text-xs text-gray-500">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-teal-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              {/* Goal Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Monthly Needed</p>
                  <p className="text-lg font-bold text-blue-700">
                    ₹{monthlyNeeded > 0 ? Math.ceil(monthlyNeeded).toLocaleString() : 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Target Date</p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Quick Add Savings */}
              <div className="flex gap-2">
                {[500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAddSavings(goal._id, amount)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    +₹{amount}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {goals?.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 mb-4">No goals set yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Set your first financial goal and start saving with purpose!
            </p>
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Goal</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., New Laptop, Emergency Fund"
                  required
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="50000"
                  required
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {goalIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                        formData.icon === icon
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
