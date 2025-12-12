import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface PersonalityResultsProps {
  onContinue: () => void;
}

export function PersonalityResults({ onContinue }: PersonalityResultsProps) {
  const personality = useQuery(api.questionnaire.getUserPersonality);
  const progress = useQuery(api.questionnaire.getQuestionnaireProgress);

  if (!personality) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

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

  const getPersonalityDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      investor: "You're confident and risk-tolerant, actively managing your money with a focus on long-term wealth building through investments.",
      spender: "You live for the present moment, using money for experiences and status. You derive happiness from purchases but need to watch impulse buying.",
      saver: "You're extremely cautious with spending and derive pleasure from watching your savings grow. Security is your top priority.",
      ostrich: "You tend to avoid financial decisions and prefer not to think about money management. Small steps can lead to big improvements.",
      debtor: "You're working to get your finances organized. With the right tools and habits, you can achieve financial stability.",
    };
    return descriptions[type] || "You have a unique approach to money management.";
  };

  const getPersonalityStrengths = (type: string) => {
    const strengths: Record<string, string[]> = {
      investor: ["Long-term thinking", "Risk tolerance", "Market awareness", "Research skills"],
      spender: ["Enjoys life", "Supports economy", "Social connections", "Present-focused"],
      saver: ["Financial discipline", "Emergency preparedness", "Compound growth mindset", "Budget conscious"],
      ostrich: ["Stress avoidance", "Simplicity preference", "Trust in others", "Focus on non-financial priorities"],
      debtor: ["Resilience", "Learning opportunity", "Motivation for change", "Real-world experience"],
    };
    return strengths[type] || ["Unique perspective", "Learning mindset"];
  };

  const getPersonalityRisks = (type: string) => {
    const risks: Record<string, string[]> = {
      investor: ["Overconfidence", "Overtrading", "Ignoring diversification", "Emotional decisions"],
      spender: ["Debt accumulation", "No emergency fund", "Lifestyle inflation", "Retirement under-saving"],
      saver: ["Inflation erosion", "Missed opportunities", "Under-enjoying life", "Over-cautiousness"],
      ostrich: ["Hidden fees", "Missed payments", "No planning", "Financial surprises"],
      debtor: ["Debt spiral", "High interest", "Stress", "Limited options"],
    };
    return risks[type] || ["Needs attention", "Room for improvement"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Your Financial Personality Revealed!
          </h1>
          <p className="text-gray-600">
            Based on your 50 answers, here's your unique financial profile
          </p>
        </div>

        {/* Main Personality Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{getPersonalityIcon(personality.primaryType)}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {getPersonalityName(personality.primaryType)}
            </h2>
            <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full inline-block mb-4">
              {personality.confidenceScore}% Confidence Score
            </div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              {getPersonalityDescription(personality.primaryType)}
            </p>
          </div>

          {/* Personality Scores */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {[
              { type: 'investor', score: personality.investorScore, label: 'Investor' },
              { type: 'spender', score: personality.spenderScore, label: 'Spender' },
              { type: 'saver', score: personality.saverScore, label: 'Saver' },
              { type: 'ostrich', score: personality.ostrichScore, label: 'Ostrich' },
              { type: 'debtor', score: personality.debtorScore, label: 'Debtor' },
            ].map((item) => (
              <div key={item.type} className="text-center">
                <div className="text-2xl mb-2">{getPersonalityIcon(item.type)}</div>
                <div className="text-lg font-bold text-gray-800">{item.score}%</div>
                <div className="text-sm text-gray-600">{item.label}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Hybrid Type */}
          {personality.hybridType && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-800 mb-2">🌟 Hybrid Personality Detected!</h3>
              <p className="text-purple-700">
                You're a <strong>{personality.hybridType}</strong> - a unique combination that gives you balanced financial perspectives.
              </p>
            </div>
          )}
        </div>

        {/* Strengths & Risks */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              ✅ Your Financial Strengths
            </h3>
            <ul className="space-y-2">
              {getPersonalityStrengths(personality.primaryType).map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-green-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4 flex items-center gap-2">
              ⚠️ Areas to Watch
            </h3>
            <ul className="space-y-2">
              {getPersonalityRisks(personality.primaryType).map((risk, index) => (
                <li key={index} className="flex items-center gap-2 text-orange-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Your Assessment Stats</h3>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-600">{personality.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{progress?.totalPoints || 0}</div>
              <div className="text-sm text-gray-600">Finova Coins Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{progress?.currentStreak || 0}</div>
              <div className="text-sm text-gray-600">Question Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{personality.confidenceScore}%</div>
              <div className="text-sm text-gray-600">Accuracy Score</div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium text-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            Continue to Financial Setup →
          </button>
        </div>

        {/* Share Results */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Share your personality with friends!</p>
          <div className="flex justify-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              Share on WhatsApp
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">
              Download Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
