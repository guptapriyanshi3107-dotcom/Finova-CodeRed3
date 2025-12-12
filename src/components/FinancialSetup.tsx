import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface FinancialSetupProps {
  onComplete: () => void;
}

export function FinancialSetup({ onComplete }: FinancialSetupProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    monthlyIncome: "",
    monthlyExpenses: "",
    savings: "",
    existingDebts: "",
    financialGoals: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProfile = useMutation(api.dashboard.createUserProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateFinancialScore = () => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const savings = parseFloat(formData.savings) || 0;
    
    if (income === 0) return 0;
    
    const savingsRate = ((income - expenses) / income) * 100;
    const emergencyFundMonths = savings / (expenses || 1);
    
    // Base score from savings rate (0-50 points)
    let score = Math.min(50, Math.max(0, savingsRate * 2.5));
    
    // Emergency fund bonus (0-30 points)
    score += Math.min(30, emergencyFundMonths * 5);
    
    // Income stability bonus (0-20 points)
    if (income > 0) score += 20;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const calculateSurvivalMonths = () => {
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    const savings = parseFloat(formData.savings) || 0;
    
    if (expenses === 0) return 0;
    return Math.round((savings / expenses) * 10) / 10; // Round to 1 decimal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.monthlyIncome) {
      toast.error("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name,
        persona: "professional",
        monthlyIncome: parseFloat(formData.monthlyIncome),
        monthlyExpenses: parseFloat(formData.monthlyExpenses) || 0,
        savings: parseFloat(formData.savings) || 0,
        existingDebts: parseFloat(formData.existingDebts) || 0,
        financialGoals: formData.financialGoals,
        age: parseInt(formData.age) || 25,
        financialScore: calculateFinancialScore(),
      });

      toast.success("Financial profile created successfully!");
      onComplete();
    } catch (error) {
      toast.error("Failed to save financial profile");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const financialScore = calculateFinancialScore();
  const survivalMonths = calculateSurvivalMonths();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💰 Welcome to Finova!
          </h1>
          <p className="text-gray-600">
            Let's set up your financial profile to provide personalized insights
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Your age"
                        min="18"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (₹) *
                      </label>
                      <input
                        type="number"
                        name="monthlyIncome"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., 50000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Expenses (₹)
                      </label>
                      <input
                        type="number"
                        name="monthlyExpenses"
                        value={formData.monthlyExpenses}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., 35000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Savings (₹)
                      </label>
                      <input
                        type="number"
                        name="savings"
                        value={formData.savings}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., 100000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Existing Debts (₹)
                      </label>
                      <input
                        type="number"
                        name="existingDebts"
                        value={formData.existingDebts}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., 25000"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Financial Goals
                  </label>
                  <textarea
                    name="financialGoals"
                    value={formData.financialGoals}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., Buy a house in 5 years, Build emergency fund, Invest for retirement..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Setting up your profile...
                    </div>
                  ) : (
                    "Complete Setup & Go to Dashboard"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Health Score */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Health Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">{financialScore}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${financialScore}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {financialScore >= 80 ? "Excellent" :
                   financialScore >= 60 ? "Good" :
                   financialScore >= 40 ? "Fair" : "Needs Improvement"}
                </div>
              </div>
            </div>

            {/* Survival Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💪 Financial Survival</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {survivalMonths > 0 ? `${survivalMonths}` : "0"}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {survivalMonths > 1 ? "months" : "month"} without income
                </div>
                <div className="text-xs text-gray-500">
                  {survivalMonths >= 6 ? "🟢 Excellent emergency fund" :
                   survivalMonths >= 3 ? "🟡 Good emergency fund" :
                   survivalMonths >= 1 ? "🟠 Basic emergency fund" : "🔴 Build emergency fund"}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Quick Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-1">•</span>
                  Aim to save at least 20% of your income
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-1">•</span>
                  Build 6 months of expenses as emergency fund
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-1">•</span>
                  Track your expenses to identify spending patterns
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-teal-500 mt-1">•</span>
                  Start investing early for long-term wealth
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
