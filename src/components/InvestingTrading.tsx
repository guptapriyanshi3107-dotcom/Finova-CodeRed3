import { useState } from "react";

export function InvestingTrading() {
  const [activeTab, setActiveTab] = useState("mutual-funds");

  const mutualFunds = [
    {
      name: "Large Cap Equity Funds",
      description: "Invest in top 100 companies by market cap",
      riskLevel: "Low to Moderate",
      expectedReturn: "10-12%",
      minInvestment: "₹500",
      icon: "🏢"
    },
    {
      name: "Mid Cap Equity Funds",
      description: "Invest in companies ranked 101-250 by market cap",
      riskLevel: "Moderate to High",
      expectedReturn: "12-15%",
      minInvestment: "₹500",
      icon: "🏭"
    },
    {
      name: "Small Cap Equity Funds",
      description: "Invest in companies ranked 251+ by market cap",
      riskLevel: "High",
      expectedReturn: "15-18%",
      minInvestment: "₹500",
      icon: "🏪"
    },
    {
      name: "ELSS Tax Saver Funds",
      description: "Equity funds with 3-year lock-in and tax benefits",
      riskLevel: "Moderate",
      expectedReturn: "12-15%",
      minInvestment: "₹500",
      icon: "💰"
    },
    {
      name: "Debt Funds",
      description: "Invest in bonds, government securities",
      riskLevel: "Low",
      expectedReturn: "6-8%",
      minInvestment: "₹1000",
      icon: "📋"
    },
    {
      name: "Hybrid Funds",
      description: "Mix of equity and debt investments",
      riskLevel: "Moderate",
      expectedReturn: "8-12%",
      minInvestment: "₹500",
      icon: "⚖️"
    }
  ];

  const stockBasics = [
    {
      title: "What are Stocks?",
      content: "Stocks represent ownership in a company. When you buy stocks, you become a shareholder.",
      icon: "📈"
    },
    {
      title: "How Stock Market Works",
      content: "Companies list shares on exchanges (BSE/NSE). Investors buy/sell through brokers.",
      icon: "🏛️"
    },
    {
      title: "Types of Analysis",
      content: "Fundamental (company financials) vs Technical (price patterns) analysis.",
      icon: "🔍"
    },
    {
      title: "Risk Management",
      content: "Never invest more than you can afford to lose. Diversify your portfolio.",
      icon: "🛡️"
    }
  ];

  const [sipData, setSipData] = useState({
    monthlyAmount: 5000,
    years: 10,
    expectedReturn: 12
  });

  // Mock stock data for the chart
  const [selectedStock, setSelectedStock] = useState("RELIANCE");
  const stockData = {
    RELIANCE: [
      { time: "9:15", price: 2450, volume: 1200 },
      { time: "9:30", price: 2465, volume: 1800 },
      { time: "9:45", price: 2440, volume: 2100 },
      { time: "10:00", price: 2475, volume: 1600 },
      { time: "10:15", price: 2480, volume: 1900 },
      { time: "10:30", price: 2470, volume: 1400 },
      { time: "10:45", price: 2485, volume: 2200 },
      { time: "11:00", price: 2490, volume: 1700 }
    ],
    TCS: [
      { time: "9:15", price: 3850, volume: 800 },
      { time: "9:30", price: 3865, volume: 1200 },
      { time: "9:45", price: 3840, volume: 1500 },
      { time: "10:00", price: 3875, volume: 1100 },
      { time: "10:15", price: 3880, volume: 1300 },
      { time: "10:30", price: 3870, volume: 900 },
      { time: "10:45", price: 3885, volume: 1600 },
      { time: "11:00", price: 3890, volume: 1000 }
    ],
    INFY: [
      { time: "9:15", price: 1650, volume: 1500 },
      { time: "9:30", price: 1665, volume: 2000 },
      { time: "9:45", price: 1640, volume: 2300 },
      { time: "10:00", price: 1675, volume: 1800 },
      { time: "10:15", price: 1680, volume: 2100 },
      { time: "10:30", price: 1670, volume: 1600 },
      { time: "10:45", price: 1685, volume: 2400 },
      { time: "11:00", price: 1690, volume: 1900 }
    ]
  };

  const calculateSIP = () => {
    const monthlyRate = sipData.expectedReturn / 100 / 12;
    const months = sipData.years * 12;
    const futureValue = sipData.monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = sipData.monthlyAmount * months;
    const returns = futureValue - totalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      totalInvested,
      returns: Math.round(returns)
    };
  };

  const sipResults = calculateSIP();

  const tabs = [
    { id: "mutual-funds", label: "Mutual Funds", icon: "📊" },
    { id: "sip-planner", label: "SIP Planner", icon: "📈" },
    { id: "trading-chart", label: "Trading Chart", icon: "📉" },
    { id: "stock-basics", label: "Stock Basics", icon: "📚" },
    { id: "risk-education", label: "Risk Education", icon: "⚠️" }
  ];

  const currentData = stockData[selectedStock as keyof typeof stockData];
  const currentPrice = currentData[currentData.length - 1].price;
  const previousPrice = currentData[0].price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📈 Investing & Trading</h2>
        <p className="text-gray-600">
          Learn about investments, mutual funds, and build wealth for your future
        </p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Disclaimer:</strong> This is for educational purposes only. Not financial advice. 
            Consult a certified financial advisor before investing.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Mutual Funds Tab */}
          {activeTab === "mutual-funds" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Types of Mutual Funds</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mutualFunds.map((fund, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{fund.icon}</span>
                      <h4 className="font-semibold text-gray-800">{fund.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{fund.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium">{fund.riskLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Return:</span>
                        <span className="font-medium text-green-600">{fund.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Investment:</span>
                        <span className="font-medium">{fund.minInvestment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIP Planner Tab */}
          {activeTab === "sip-planner" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">SIP Calculator</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Investment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={sipData.monthlyAmount}
                      onChange={(e) => setSipData(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min="500"
                      step="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investment Period (Years)
                    </label>
                    <input
                      type="number"
                      value={sipData.years}
                      onChange={(e) => setSipData(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min="1"
                      max="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Annual Return (%)
                    </label>
                    <input
                      type="number"
                      value={sipData.expectedReturn}
                      onChange={(e) => setSipData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      min="1"
                      max="25"
                      step="0.5"
                    />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Investment Results</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Invested:</span>
                      <span className="font-bold text-blue-600">₹{sipResults.totalInvested.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Returns:</span>
                      <span className="font-bold text-green-600">₹{sipResults.returns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-800 font-medium">Future Value:</span>
                      <span className="font-bold text-teal-600 text-xl">₹{sipResults.futureValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trading Chart Tab */}
          {activeTab === "trading-chart" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Live Stock Chart (Demo)</h3>
              
              {/* Stock Selector */}
              <div className="flex gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Select Stock:</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="RELIANCE">Reliance Industries</option>
                  <option value="TCS">Tata Consultancy Services</option>
                  <option value="INFY">Infosys</option>
                </select>
              </div>

              {/* Stock Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{selectedStock}</h4>
                    <p className="text-2xl font-bold text-gray-900">₹{currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceChange >= 0 ? '+' : ''}₹{priceChange.toFixed(2)}
                    </p>
                    <p className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ({priceChange >= 0 ? '+' : ''}{priceChangePercent}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Price Chart (Intraday)</h4>
                <div className="relative h-64">
                  <svg className="w-full h-full" viewBox="0 0 800 200">
                    {/* Grid lines */}
                    <defs>
                      <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Price line */}
                    <polyline
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2"
                      points={currentData.map((point, index) => {
                        const x = (index / (currentData.length - 1)) * 780 + 10;
                        const minPrice = Math.min(...currentData.map(p => p.price));
                        const maxPrice = Math.max(...currentData.map(p => p.price));
                        const y = 180 - ((point.price - minPrice) / (maxPrice - minPrice)) * 160;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data points */}
                    {currentData.map((point, index) => {
                      const x = (index / (currentData.length - 1)) * 780 + 10;
                      const minPrice = Math.min(...currentData.map(p => p.price));
                      const maxPrice = Math.max(...currentData.map(p => p.price));
                      const y = 180 - ((point.price - minPrice) / (maxPrice - minPrice)) * 160;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#14b8a6"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Time labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    {currentData.map((point, index) => (
                      <span key={index}>{point.time}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Chart */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Volume</h4>
                <div className="flex items-end justify-between h-20 gap-2">
                  {currentData.map((point, index) => {
                    const maxVolume = Math.max(...currentData.map(p => p.volume));
                    const height = (point.volume / maxVolume) * 80;
                    return (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t flex-1"
                        style={{ height: `${height}px` }}
                        title={`${point.time}: ${point.volume}`}
                      ></div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This is a demo chart with simulated data for educational purposes. 
                  Real trading requires a registered broker and involves financial risk.
                </p>
              </div>
            </div>
          )}

          {/* Stock Basics Tab */}
          {activeTab === "stock-basics" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Stock Market Fundamentals</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {stockBasics.map((basic, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{basic.icon}</span>
                      <h4 className="font-semibold text-gray-800">{basic.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{basic.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">🎯 Getting Started with Stocks</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• Open a Demat account with a registered broker</p>
                  <p>• Start with blue-chip companies (Nifty 50)</p>
                  <p>• Invest only surplus money, not emergency funds</p>
                  <p>• Learn to read annual reports and financial statements</p>
                  <p>• Consider starting with mutual funds before direct stocks</p>
                </div>
              </div>
            </div>
          )}

          {/* Risk Education Tab */}
          {activeTab === "risk-education" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Understanding Investment Risk</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🟢 Low Risk</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Fixed deposits, government bonds, debt funds
                  </p>
                  <p className="text-xs text-green-600">Expected Return: 4-8%</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">🟡 Moderate Risk</h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Large cap mutual funds, hybrid funds
                  </p>
                  <p className="text-xs text-yellow-600">Expected Return: 8-12%</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">🔴 High Risk</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Small cap funds, individual stocks, crypto
                  </p>
                  <p className="text-xs text-red-600">Expected Return: 12-20%+</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">💡 Risk Management Tips</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Diversification</h5>
                    <p className="text-sm text-gray-600">Don't put all money in one investment. Spread across different asset classes.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Asset Allocation</h5>
                    <p className="text-sm text-gray-600">Age-based rule: Equity % = 100 - your age. Rest in debt/gold.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Emergency Fund First</h5>
                    <p className="text-sm text-gray-600">Keep 6 months expenses in savings before investing.</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Regular Review</h5>
                    <p className="text-sm text-gray-600">Review and rebalance your portfolio annually.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
