import { useState, useEffect } from "react";

const aiTips = [
  {
    icon: "💡",
    title: "Smart Saving Tip",
    message: "Based on your spending pattern, you could save ₹3,200 more by reducing dining out by 20%.",
    color: "bg-blue-50 border-blue-200 text-blue-800"
  },
  {
    icon: "🎯",
    title: "Goal Achievement",
    message: "You're on track to reach your laptop goal! Consider increasing your monthly savings by ₹1,000 to achieve it 2 months earlier.",
    color: "bg-green-50 border-green-200 text-green-800"
  },
  {
    icon: "⚠️",
    title: "Budget Alert",
    message: "Your shopping expenses are 15% higher than last month. Consider setting a stricter budget for next month.",
    color: "bg-orange-50 border-orange-200 text-orange-800"
  },
  {
    icon: "📊",
    title: "Investment Opportunity",
    message: "With your current savings rate, you could start a SIP of ₹5,000/month for long-term wealth building.",
    color: "bg-purple-50 border-purple-200 text-purple-800"
  }
];

export function AITip() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % aiTips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const tip = aiTips[currentTip];

  return (
    <div className="mb-8">
      <div className={`p-6 rounded-xl border-2 ${tip.color} transition-all duration-500`}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">{tip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{tip.title}</h3>
              <div className="flex gap-2">
                {aiTips.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTip(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTip ? "bg-current" : "bg-current opacity-30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed">{tip.message}</p>
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-white bg-opacity-50 rounded-lg text-sm font-medium hover:bg-opacity-70 transition-colors">
                Learn More
              </button>
              <button className="px-4 py-2 bg-white bg-opacity-50 rounded-lg text-sm font-medium hover:bg-opacity-70 transition-colors">
                Apply Tip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
