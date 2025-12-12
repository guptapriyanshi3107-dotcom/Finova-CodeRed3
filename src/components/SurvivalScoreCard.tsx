import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function SurvivalScoreCard() {
  const survival = useQuery(api.dashboard.getSurvivalAnalysis);
  const profile = useQuery(api.dashboard.getUserProfile);

  if (!survival || !profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "low": return "🟢";
      case "medium": return "🟡";
      case "high": return "🔴";
      default: return "⚪";
    }
  };

  const getRecommendation = (months: number) => {
    if (months >= 6) return "Excellent! You have a strong financial safety net.";
    if (months >= 3) return "Good emergency fund. Consider building it to 6 months.";
    if (months >= 1) return "Basic emergency fund. Aim for 3-6 months of expenses.";
    return "Build an emergency fund to improve financial security.";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          💪 Financial Survival Analysis
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(survival.riskLevel)}`}>
          {getRiskIcon(survival.riskLevel)} {survival.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {survival.survivalMonths}
          </div>
          <div className="text-sm text-gray-600">Months Without Income</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">
            {survival.survivalScore}/100
          </div>
          <div className="text-sm text-gray-600">Survival Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            ₹{(survival.liquidSavings / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-600">Emergency Fund</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Emergency Fund Progress</span>
          <span>{Math.min(100, Math.round((survival.survivalMonths / 6) * 100))}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (survival.survivalMonths / 6) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-lg p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-800 mb-1">Recommendation</h4>
            <p className="text-blue-700 text-sm">
              {getRecommendation(survival.survivalMonths)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="text-gray-600">Monthly Expenses</div>
          <div className="font-semibold text-gray-800">₹{survival.monthlyBurnRate.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="text-gray-600">Last Updated</div>
          <div className="font-semibold text-gray-800">
            {new Date(survival.lastCalculated).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
