import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Suggestion {
  id: string;
  category: "Bills" | "Subscriptions" | "Goals" | "Cashback" | "Expenses" | "Debt" | "Automation";
  title: string;
  insight: string;
  reason: string;
  benefit: string;
  actionStep: string;
  expectedSaving: number;
  icon: string;
  priority: "high" | "medium" | "low";
}

export function SmartSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  // Mock data - in production, this would come from AI analysis
  const suggestions: Suggestion[] = [
    {
      id: "1",
      category: "Bills",
      title: "Optimize Phone Bill",
      insight: "Your phone bill is ₹699/month, which is 23% higher than average users",
      reason: "You're on an unlimited plan but use only 8GB data monthly",
      benefit: "Switch to ₹399 plan to save ₹300/month",
      actionStep: "Compare plans in your telecom app or visit store",
      expectedSaving: 300,
      icon: "📱",
      priority: "high"
    },
    {
      id: "2",
      category: "Subscriptions",
      title: "Cancel Unused Spotify",
      insight: "You haven't opened Spotify in 45 days",
      reason: "Your music listening shifted to YouTube Music",
      benefit: "Cancel to save ₹119/month (₹1,428/year)",
      actionStep: "Go to Spotify settings → Cancel subscription",
      expectedSaving: 119,
      icon: "🎵",
      priority: "medium"
    },
    {
      id: "3",
      category: "Goals",
      title: "Boost Laptop Savings",
      insight: "Currently saving ₹1,500/month for laptop goal",
      reason: "You have ₹2,200 extra after expenses this month",
      benefit: "Increase to ₹2,000/month → achieve goal 2 months faster",
      actionStep: "Set up auto-transfer of ₹2,000 on salary day",
      expectedSaving: 0,
      icon: "💻",
      priority: "high"
    },
    {
      id: "4",
      category: "Cashback",
      title: "Enable UPI Cashback",
      insight: "You pay ₹1,500 electricity bill via bank transfer",
      reason: "Your UPI app offers 5% cashback on utility bills",
      benefit: "Switch to UPI → earn ₹75 cashback monthly",
      actionStep: "Enable auto-pay for electricity in UPI app",
      expectedSaving: 75,
      icon: "💰",
      priority: "low"
    },
    {
      id: "5",
      category: "Expenses",
      title: "Reduce Food Delivery",
      insight: "Food delivery spending: ₹2,350/month (18% of income)",
      reason: "Ordering 12 times/month, mostly dinner",
      benefit: "Cook 2 dinners/week → reduce to ₹1,600/month",
      actionStep: "Plan Sunday meal prep for 2 weekday dinners",
      expectedSaving: 750,
      icon: "🍽️",
      priority: "high"
    },
    {
      id: "6",
      category: "Debt",
      title: "Avoid Credit Card Trap",
      insight: "You paid minimum ₹2,500 on ₹18,000 credit card bill",
      reason: "Paying only minimum costs ₹2,160 extra in interest",
      benefit: "Pay ₹4,000 extra → save ₹1,800 interest",
      actionStep: "Set reminder to pay more than minimum always",
      expectedSaving: 1800,
      icon: "💳",
      priority: "high"
    }
  ];

  const categories = ["All", "Bills", "Subscriptions", "Goals", "Cashback", "Expenses", "Debt", "Automation"];

  const filteredSuggestions = selectedCategory === "All" 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const handleApplySuggestion = (suggestionId: string) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 border-red-200 text-red-800";
      case "medium": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low": return "bg-green-50 border-green-200 text-green-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const totalPotentialSavings = filteredSuggestions
    .filter(s => !appliedSuggestions.has(s.id))
    .reduce((sum, s) => sum + s.expectedSaving, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">💡 Smart Suggestions</h2>
        <p className="text-gray-600 mb-4">
          AI-powered recommendations to optimize your finances and save more money
        </p>
        
        {/* Potential Savings */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Potential Monthly Savings</p>
              <p className="text-2xl font-bold text-green-800">₹{totalPotentialSavings.toLocaleString()}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSuggestions.map((suggestion) => {
          const isApplied = appliedSuggestions.has(suggestion.id);
          
          return (
            <div
              key={suggestion.id}
              className={`bg-white rounded-xl p-6 shadow-sm border transition-all ${
                isApplied 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 hover:shadow-md"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{suggestion.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{suggestion.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
                {suggestion.expectedSaving > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Save</p>
                    <p className="text-lg font-bold text-green-600">₹{suggestion.expectedSaving}</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">💡 Insight</h4>
                  <p className="text-sm text-gray-700">{suggestion.insight}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">🔍 Why this matters</h4>
                  <p className="text-sm text-gray-700">{suggestion.reason}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">✨ Benefit</h4>
                  <p className="text-sm text-green-700 font-medium">{suggestion.benefit}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-1">🎯 Action Step</h4>
                  <p className="text-sm text-gray-700">{suggestion.actionStep}</p>
                </div>
              </div>

              {/* Action Button */}
              {isApplied ? (
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✅</span>
                  <span className="font-medium">Applied!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplySuggestion(suggestion.id)}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Apply Suggestion
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Updates */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-xl font-semibold text-blue-800">AI-Powered Updates</h3>
        </div>
        <p className="text-blue-700 mb-4">
          New suggestions are generated every week based on your spending patterns, goals, and financial behavior.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">📊 Next Analysis</h4>
            <p className="text-sm text-blue-700">Sunday, Jan 12 - Weekly spending review</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">🎯 Focus Area</h4>
            <p className="text-sm text-blue-700">Food & Entertainment optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
