import { useState } from "react";

export function Calculators() {
  const [activeCalculator, setActiveCalculator] = useState("emi");
  
  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    principal: 500000,
    rate: 8.5,
    tenure: 20
  });

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    monthlyAmount: 5000,
    years: 15,
    expectedReturn: 12
  });

  // Tax Calculator State
  const [taxData, setTaxData] = useState({
    income: 800000,
    regime: "new",
    investments: 150000
  });

  // FD Calculator State
  const [fdData, setFdData] = useState({
    principal: 100000,
    rate: 6.5,
    tenure: 5
  });

  const calculators = [
    { id: "emi", label: "EMI Calculator", icon: "🏠" },
    { id: "sip", label: "SIP Calculator", icon: "📈" },
    { id: "tax", label: "Tax Calculator", icon: "💰" },
    { id: "fd", label: "FD Calculator", icon: "🏦" },
    { id: "retirement", label: "Retirement Planner", icon: "👴" },
    { id: "insurance", label: "Insurance Calculator", icon: "🛡️" }
  ];

  // EMI Calculation
  const calculateEMI = () => {
    const monthlyRate = emiData.rate / 100 / 12;
    const months = emiData.tenure * 12;
    const emi = (emiData.principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - emiData.principal;
    
    return {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    };
  };

  // SIP Calculation
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

  // Tax Calculation (Simplified)
  const calculateTax = () => {
    let taxableIncome = taxData.income;
    
    if (taxData.regime === "old") {
      taxableIncome -= Math.min(taxData.investments, 150000); // 80C deduction
    }
    
    let tax = 0;
    
    if (taxData.regime === "new") {
      // New tax regime slabs
      if (taxableIncome > 300000) tax += Math.min(taxableIncome - 300000, 300000) * 0.05;
      if (taxableIncome > 600000) tax += Math.min(taxableIncome - 600000, 300000) * 0.10;
      if (taxableIncome > 900000) tax += Math.min(taxableIncome - 900000, 300000) * 0.15;
      if (taxableIncome > 1200000) tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
      if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
    } else {
      // Old tax regime slabs
      if (taxableIncome > 250000) tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
      if (taxableIncome > 500000) tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
      if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
    }
    
    const cess = tax * 0.04; // 4% cess
    const totalTax = tax + cess;
    
    return {
      taxableIncome: Math.round(taxableIncome),
      tax: Math.round(tax),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
      netIncome: Math.round(taxData.income - totalTax)
    };
  };

  // FD Calculation
  const calculateFD = () => {
    const maturityAmount = fdData.principal * Math.pow(1 + fdData.rate / 100, fdData.tenure);
    const interest = maturityAmount - fdData.principal;
    
    return {
      maturityAmount: Math.round(maturityAmount),
      interest: Math.round(interest)
    };
  };

  const emiResults = calculateEMI();
  const sipResults = calculateSIP();
  const taxResults = calculateTax();
  const fdResults = calculateFD();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🧮 Financial Calculators</h2>
        <p className="text-gray-600">
          Plan your finances with our comprehensive set of calculators
        </p>
      </div>

      {/* Calculator Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Calculator</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-4 rounded-lg border-2 transition-colors text-center ${
                activeCalculator === calc.id
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">{calc.icon}</div>
              <div className="text-sm font-medium">{calc.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {/* EMI Calculator */}
        {activeCalculator === "emi" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">🏠 EMI Calculator</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={emiData.principal}
                    onChange={(e) => setEmiData(prev => ({ ...prev, principal: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={emiData.rate}
                    onChange={(e) => setEmiData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={emiData.tenure}
                    onChange={(e) => setEmiData(prev => ({ ...prev, tenure: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">EMI Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="font-bold text-blue-600">₹{emiResults.emi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-red-600">₹{emiResults.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-bold text-orange-600">₹{emiResults.totalInterest.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIP Calculator */}
        {activeCalculator === "sip" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">📈 SIP Calculator</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={sipData.monthlyAmount}
                    onChange={(e) => setSipData(prev => ({ ...prev, monthlyAmount: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Return (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sipData.expectedReturn}
                    onChange={(e) => setSipData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">SIP Results</h4>
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

        {/* Tax Calculator */}
        {activeCalculator === "tax" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">💰 Income Tax Calculator</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={taxData.income}
                    onChange={(e) => setTaxData(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Regime
                  </label>
                  <select
                    value={taxData.regime}
                    onChange={(e) => setTaxData(prev => ({ ...prev, regime: e.target.value as "old" | "new" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="new">New Tax Regime</option>
                    <option value="old">Old Tax Regime</option>
                  </select>
                </div>
                {taxData.regime === "old" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      80C Investments (₹)
                    </label>
                    <input
                      type="number"
                      value={taxData.investments}
                      onChange={(e) => setTaxData(prev => ({ ...prev, investments: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Tax Calculation</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Income:</span>
                    <span className="font-bold text-blue-600">₹{taxResults.taxableIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Income Tax:</span>
                    <span className="font-bold text-red-600">₹{taxResults.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cess (4%):</span>
                    <span className="font-bold text-orange-600">₹{taxResults.cess.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">Total Tax:</span>
                    <span className="font-bold text-red-600 text-xl">₹{taxResults.totalTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-medium">Net Income:</span>
                    <span className="font-bold text-green-600 text-xl">₹{taxResults.netIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FD Calculator */}
        {activeCalculator === "fd" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">🏦 Fixed Deposit Calculator</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principal Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={fdData.principal}
                    onChange={(e) => setFdData(prev => ({ ...prev, principal: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fdData.rate}
                    onChange={(e) => setFdData(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    value={fdData.tenure}
                    onChange={(e) => setFdData(prev => ({ ...prev, tenure: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">FD Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal:</span>
                    <span className="font-bold text-blue-600">₹{fdData.principal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Earned:</span>
                    <span className="font-bold text-green-600">₹{fdResults.interest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-800 font-medium">Maturity Amount:</span>
                    <span className="font-bold text-purple-600 text-xl">₹{fdResults.maturityAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon for other calculators */}
        {["retirement", "insurance"].includes(activeCalculator) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon!</h3>
            <p className="text-gray-600">
              This calculator is under development and will be available soon.
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💡</span>
          <h3 className="text-xl font-semibold text-indigo-800">Financial Tips</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-indigo-800 mb-2">📊 EMI Planning</h4>
            <p className="text-sm text-indigo-700">Keep your EMI under 40% of your monthly income for healthy finances.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-indigo-800 mb-2">📈 SIP Strategy</h4>
            <p className="text-sm text-indigo-700">Start SIP early to benefit from compounding. Even ₹1000/month helps!</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-indigo-800 mb-2">💰 Tax Saving</h4>
            <p className="text-sm text-indigo-700">Compare both tax regimes annually to choose the most beneficial one.</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-indigo-800 mb-2">🏦 FD vs SIP</h4>
            <p className="text-sm text-indigo-700">FDs are safe but SIPs can potentially give higher long-term returns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
