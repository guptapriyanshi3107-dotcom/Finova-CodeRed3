export function LearnAndGrow() {
  const learningModules = [
    {
      title: "Personal Budgeting Basics",
      description: "Learn how to plan a monthly budget, control expenses, and increase savings",
      duration: "40 mins",
      level: "Beginner",
      category: "Budgeting",
      videoUrl: "https://www.youtube.com/watch?v=QEtoRHlv9G4",
      topics: ["50-30-20 rule", "Needs vs Wants", "Tracking expenses", "Emergency fund"],
      icon: "💰"
    },
    {
      title: "Smart Savings Strategies",
      description: "Master practical methods to save money without sacrificing lifestyle",
      duration: "50 mins",
      level: "Beginner",
      category: "Saving",
      videoUrl: "https://www.youtube.com/watch?v=1XAuGb0cexs",
      topics: ["Automated savings", "Goal-based saving", "Recurring deposits", "Mental budgeting"],
      icon: "🏦"
    },
    {
      title: "Beginner's Guide to Investments",
      description: "Understand mutual funds, SIPs, stock basics & risk-free investment options",
      duration: "60 mins",
      level: "Intermediate",
      category: "Investing",
      videoUrl: "https://www.youtube.com/watch?v=gWJRyy7ZXqY",
      topics: ["SIP", "Mutual Funds", "Risk vs Return", "Compounding"],
      icon: "📈"
    },
    {
      title: "Credit Cards & Loans Explained",
      description: "How credit cards work, how to avoid debt traps, and manage loans smartly",
      duration: "45 mins",
      level: "Beginner",
      category: "Credit Management",
      videoUrl: "https://www.youtube.com/watch?v=0v_MLZyT9G8",
      topics: ["Interest rates", "Credit score", "EMIs", "Minimum payment myth"],
      icon: "💳"
    },
    {
      title: "Taxes for Beginners",
      description: "Learn tax basics, regimes, deductions, and how to save more legally",
      duration: "50 mins",
      level: "Intermediate",
      category: "Taxation",
      videoUrl: "https://www.youtube.com/watch?v=boiFIotfQq8",
      topics: ["Old vs New regime", "80C", "80D", "Proof submission"],
      icon: "📜"
    },
    {
      title: "Retirement Planning Simplified",
      description: "Why retirement planning matters and how small monthly savings grow big",
      duration: "55 mins",
      level: "Intermediate",
      category: "Retirement",
      videoUrl: "https://www.youtube.com/watch?v=GI6kLCx3JqQ",
      topics: ["NPS", "PPF", "EPF", "Compounding"],
      icon: "🧓"
    }
  ];

  const governmentSchemes = [
    {
      name: "Public Provident Fund (PPF)",
      description: "Safe long-term savings with tax benefits",
      link: "https://www.onlinesbi.sbi",
      icon: "🏛️"
    },
    {
      name: "National Pension Scheme (NPS)",
      description: "Retirement savings + tax benefits under 80CCD",
      link: "https://enps.nsdl.com",
      icon: "📊"
    },
    {
      name: "Kisan Vikas Patra / Post Office Schemes",
      description: "Guaranteed interest & government safety",
      link: "https://www.indiapost.gov.in",
      icon: "📮"
    },
    {
      name: "Sukanya Samriddhi Yojana",
      description: "High-interest saving scheme for girl child",
      link: "https://www.onlinesbi.sbi",
      icon: "👧"
    },
    {
      name: "PM Suraksha Bima Yojana",
      description: "Accident insurance at ₹12/year",
      link: "https://jansuraksha.gov.in",
      icon: "🛡️"
    },
    {
      name: "Jan Dhan Yojana",
      description: "Zero balance bank account + insurance benefits",
      link: "https://pmjdy.gov.in",
      icon: "💼"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📘 Learn & Grow</h2>
        <p className="text-gray-600">
          Boost your financial literacy with simplified video lessons and trusted resources — Smart decisions. Simple money. Future ready.
        </p>
      </div>

      {/* Learning Modules */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{module.icon}</span>
              <div className="flex flex-col gap-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  module.level === "Beginner" ? "bg-green-100 text-green-800" :
                  module.level === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {module.level}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {module.duration}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{module.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">You'll learn:</h4>
              <div className="flex flex-wrap gap-1">
                {module.topics.map((topic, topicIndex) => (
                  <span key={topicIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={module.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors text-center"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>

      {/* Government Schemes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏛️ Government Financial Schemes & Benefits</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {governmentSchemes.map((scheme, index) => (
            <a
              key={index}
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="text-2xl mb-2">{scheme.icon}</div>
              <h4 className="font-medium text-gray-800 mb-1 group-hover:text-teal-600 transition-colors">{scheme.name}</h4>
              <p className="text-sm text-gray-600">{scheme.description}</p>
              <div className="mt-2 text-xs text-teal-600 font-medium">Learn More →</div>
            </a>
          ))}
        </div>
      </div>

      {/* Expert Tips */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Finance Tips of the Week</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔐</span>
              <h4 className="font-semibold text-gray-800">Emergency Fund Tip</h4>
            </div>
            <p className="text-sm text-gray-700">
              Aim to save 3–6 months of expenses. Start small: ₹2,000–₹3,000 per month and grow consistently.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📊</span>
              <h4 className="font-semibold text-gray-800">Investment Tip</h4>
            </div>
            <p className="text-sm text-gray-700">
              If you're new to investing, start with SIPs in mutual funds. Compounding turns small consistent amounts into long-term wealth.
            </p>
          </div>
        </div>
      </div>

      {/* Tools / Calculators */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📚 Quick Financial Tools</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="font-medium text-gray-800 mb-1">EMI Calculator</h4>
            <p className="text-sm text-gray-600">
              Estimate loan EMIs instantly
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">🧮</div>
            <h4 className="font-medium text-gray-800 mb-1">Tax Calculator</h4>
            <p className="text-sm text-gray-600">
              Compare new vs old tax regime
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">💼</div>
            <h4 className="font-medium text-gray-800 mb-1">Retirement Estimator</h4>
            <p className="text-sm text-gray-600">
              Plan future savings and returns
            </p>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
        <h3 className="text-xl font-semibold text-teal-800 mb-4">👥 Join the Finova Community</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-teal-800 mb-2">🎯 Monthly Webinars</h4>
            <p className="text-sm text-teal-700 mb-3">
              Live sessions with finance experts — Learn taxes, investing, and savings hacks
            </p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors">
              Register Now
            </button>
          </div>

          <div>
            <h4 className="font-medium text-teal-800 mb-2">💬 Finance Forum</h4>
            <p className="text-sm text-teal-700 mb-3">
              Talk with others, share strategies, ask questions, learn together
            </p>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition-colors">
              Join Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
