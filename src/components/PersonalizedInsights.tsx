import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PersonalizedInsights() {
  const insights = useQuery(api.dashboard.getUserInsights);

  if (!insights) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Insights</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "tip": return "💡";
      default: return "ℹ️";
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600 bg-green-50 border-green-200";
      case "warning": return "text-orange-600 bg-orange-50 border-orange-200";
      case "tip": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personalized Insights</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{getInsightIcon(insight.type)}</span>
              <div>
                <p className="font-medium">{insight.message}</p>
                <p className="text-sm opacity-75 mt-1">
                  {new Date(insight.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
