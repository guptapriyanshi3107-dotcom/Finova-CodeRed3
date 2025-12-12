import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function GoalsProgress() {
  const goals = useQuery(api.dashboard.getGoals);

  if (!goals) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Goals Progress</h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Goals Progress</h2>
      <div className="space-y-6">
        {goals.map((goal, index) => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const daysLeft = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
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
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        
        {goals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No goals set yet</p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
