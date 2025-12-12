import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function InsightsReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [selectedChart, setSelectedChart] = useState("spending");

  const stats = useQuery(api.dashboard.getDashboardStats);
  const breakdown = useQuery(api.dashboard.getSpendingBreakdown);
  const transactions = useQuery(api.dashboard.getRecentTransactions);

  // Mock data for charts - in production, this would come from backend
  const monthlyTrends = [
    { month: "Oct", income: 45000, expenses: 32000, savings: 13000 },
    { month: "Nov", income: 45000, expenses: 28000, savings: 17000 },
    { month: "Dec", income: 45000, expenses: 35000, savings: 10000 },
    { month: "Jan", income: 45000, expenses: 30000, savings: 15000 },
  ];

  const financialScore = stats?.financialScore || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const periods = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "thisYear", label: "This Year" }
  ];

  const chartTypes = [
    { value: "spending", label: "Spending Categories", icon: "📊" },
    { value: "trends", label: "Monthly Trends", icon: "📈" },
    { value: "savings", label: "Savings Growth", icon: "💰" },
    { value: "score", label: "Financial Score", icon: "🎯" }
  ];

  const insights = [
    {
      type: "positive",
      message: "You spent 12% less than last month - great progress!",
      icon: "✅"
    },
    {
      type: "warning",
      message: "Shopping category is 25% of expenses, recommended <15%",
      icon: "⚠️"
    },
    {
      type: "tip",
      message: "Savings rate improved from 10% to 18% this month",
      icon: "💡"
    },
    {
      type: "alert",
      message: "3 bills were paid late this month. Enable reminders?",
      icon: "🔔"
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive": return "bg-green-50 border-green-200 text-green-800";
      case "warning": return "bg-orange-50 border-orange-200 text-orange-800";
      case "tip": return "bg-blue-50 border-blue-200 text-blue-800";
      case "alert": return "bg-red-50 border-red-200 text-red-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const exportReport = (format: string) => {
    // Mock export functionality
    alert(`Exporting ${format} report... (Feature coming soon!)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Insights & Reports</h2>
        <p className="text-gray-600">
          Detailed analysis of your financial data with AI-powered insights
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Report</label>
            <div className="flex gap-2">
              <button
                onClick={() => exportReport("PDF")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                📄 PDF
              </button>
              <button
                onClick={() => exportReport("CSV")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                📊 CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Score */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Financial Health Score</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-4xl font-bold ${getScoreColor(financialScore)}`}>
                {financialScore}
              </span>
              <span className="text-2xl text-gray-400">/100</span>
            </div>
            <p className={`text-lg font-medium ${getScoreColor(financialScore)}`}>
              {getScoreLabel(financialScore)}
            </p>
          </div>
          <div className="w-32 h-32 relative">
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={financialScore >= 80 ? "#10b981" : financialScore >= 60 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(financialScore / 100) * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Visual Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {chartTypes.map((chart) => (
            <button
              key={chart.value}
              onClick={() => setSelectedChart(chart.value)}
              className={`p-3 rounded-lg border-2 transition-colors text-center ${
                selectedChart === chart.value
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{chart.icon}</div>
              <div className="text-sm font-medium">{chart.label}</div>
            </button>
          ))}
        </div>

        {/* Chart Display */}
        <div className="bg-gray-50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
          {selectedChart === "spending" && (
            <div className="w-full">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Spending by Category</h4>
              <div className="space-y-4">
                {breakdown?.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{item.category}</span>
                      <span className="text-gray-600">₹{item.amount.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-teal-600 h-3 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedChart === "trends" && (
            <div className="w-full">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Monthly Trends</h4>
              <div className="space-y-4">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-800">{month.month}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-green-600">Income: ₹{month.income.toLocaleString()}</span>
                      <span className="text-red-600">Expenses: ₹{month.expenses.toLocaleString()}</span>
                      <span className="text-blue-600">Savings: ₹{month.savings.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedChart === "savings" && (
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Savings Growth</h4>
              <div className="text-6xl mb-4">📈</div>
              <p className="text-gray-600">Savings rate: <span className="font-bold text-green-600">18%</span></p>
              <p className="text-sm text-gray-500 mt-2">Up from 10% last month</p>
            </div>
          )}

          {selectedChart === "score" && (
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Spending Control</span>
                  <span className="font-bold text-green-600">85/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Savings Rate</span>
                  <span className="font-bold text-yellow-600">70/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Goal Progress</span>
                  <span className="font-bold text-green-600">80/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bill Management</span>
                  <span className="font-bold text-red-600">45/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🤖 AI-Generated Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{insight.icon}</span>
                <p className="text-sm font-medium">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Category</th>
                <th className="text-right py-3 px-2 font-medium text-gray-700">Amount</th>
                <th className="text-center py-3 px-2 font-medium text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.slice(0, 10).map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-2 text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-800">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-2 text-gray-600">{transaction.category}</td>
                  <td className={`py-3 px-2 text-right font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === "income" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto Reports */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📧</span>
          <h3 className="text-xl font-semibold text-purple-800">Automated Reports</h3>
        </div>
        <p className="text-purple-700 mb-4">
          Get detailed financial reports delivered to your email automatically
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">📅 Weekly Summary</h4>
            <p className="text-sm text-purple-700">Every Sunday at 9 AM</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">📊 Monthly Report</h4>
            <p className="text-sm text-purple-700">1st of every month</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎯 Goal Updates</h4>
            <p className="text-sm text-purple-700">When milestones reached</p>
          </div>
        </div>
      </div>
    </div>
  );
}
