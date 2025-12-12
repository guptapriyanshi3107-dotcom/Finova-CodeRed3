import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function FinancialCertificate() {
  const personality = useQuery(api.questionnaire.getUserPersonality);
  const stats = useQuery(api.dashboard.getDashboardStats);
  const profile = useQuery(api.dashboard.getUserProfile);

  if (!personality || !stats || !profile) return null;

  const getPersonalityIcon = (type: string) => {
    const icons: Record<string, string> = {
      investor: "💼",
      spender: "🛍️",
      saver: "💰",
      ostrich: "🙈",
      debtor: "📉",
    };
    return icons[type] || "🎯";
  };

  const getPersonalityName = (type: string) => {
    const names: Record<string, string> = {
      investor: "The Investor",
      spender: "The Big Spender", 
      saver: "The Big Saver",
      ostrich: "The Ostrich",
      debtor: "The Debtor",
    };
    return names[type] || "Financial Explorer";
  };

  const getBadgeColor = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-blue-400 to-blue-600";
    if (score >= 40) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const handleShare = (platform: string) => {
    const text = `I just discovered I'm ${getPersonalityName(personality.primaryType)} with a ${stats.financialScore}/100 financial health score on Finova! 🎉`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleDownload = () => {
    // This would generate and download a certificate image
    // For now, we'll just show a toast
    alert("Certificate download feature coming soon!");
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🏅</span>
        <h2 className="text-xl font-semibold text-purple-800">Financial Health Certificate</h2>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Certificate Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{getPersonalityIcon(personality.primaryType)}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {profile.name}
          </h3>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r ${getBadgeColor(stats.financialScore)}`}>
            {getPersonalityName(personality.primaryType)}
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-teal-600">{stats.financialScore}</div>
            <div className="text-xs text-gray-600">Health Score</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{personality.confidenceScore}%</div>
            <div className="text-xs text-gray-600">Confidence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{personality.questionsAnswered}</div>
            <div className="text-xs text-gray-600">Questions</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((stats.totalSavings || 0) / stats.monthlyIncome) * 100)}%
            </div>
            <div className="text-xs text-gray-600">Savings Rate</div>
          </div>
        </div>

        {/* Personality Breakdown */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Personality Breakdown</h4>
          <div className="space-y-2">
            {[
              { type: 'Investor', score: personality.investorScore, icon: '💼' },
              { type: 'Saver', score: personality.saverScore, icon: '💰' },
              { type: 'Spender', score: personality.spenderScore, icon: '🛍️' },
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700 w-16">{item.type}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Date */}
        <div className="text-center text-sm text-gray-500 mb-4">
          Certified on {new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleShare('whatsapp')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            Share on WhatsApp
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Share on Twitter
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
