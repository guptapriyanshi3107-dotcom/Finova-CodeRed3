import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { AIMessage, UserFinancialContext, ChatAPIRequest, AIResponse } from "../ai/aiTypes";

// Backend API URL - Update this to match your backend server
const BACKEND_URL = 'http://localhost:5000';

export function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm FinPal, your AI financial assistant powered by IBM Granite. I'm here to help you with budgeting, saving, investing, and all your money questions. What would you like to know?",
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's financial context for personalized advice
  const userStats = useQuery(api.dashboard.getDashboardStats);
  const userGoals = useQuery(api.dashboard.getUserGoals);
  const recentTransactions = useQuery(api.dashboard.getRecentTransactions);

  // Check backend health on mount and periodically
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
      });
      const data = await response.json();
      setIsBackendOnline(data.status === 'ok');
      
      if (data.status === 'warning') {
        console.warn('Backend warning:', data.message);
      }
    } catch (error) {
      setIsBackendOnline(false);
      console.error('Backend health check failed:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Build user financial context
  const buildUserContext = (): UserFinancialContext | undefined => {
    if (!userStats) return undefined;

    const context: UserFinancialContext = {
      monthlyIncome: userStats.monthlyIncome,
      monthlyExpenses: userStats.monthlyExpenses,
      savings: userStats.savings,
      financialScore: userStats.financialScore,
    };

    // Add goals if available
    if (userGoals && userGoals.length > 0) {
      context.goals = userGoals.map(goal => ({
        name: goal.name,
        targetAmount: goal.targetAmount,
        savedAmount: goal.savedAmount,
      }));
    }

    // Add recent transactions if available
    if (recentTransactions && recentTransactions.length > 0) {
      context.recentTransactions = recentTransactions.slice(0, 10).map(txn => ({
        type: txn.type as 'income' | 'expense',
        amount: txn.amount,
        category: txn.category,
      }));
    }

    return context;
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    if (!isBackendOnline) {
      alert('AI Backend is offline. Please check:\n\n1. Flask server is running: python server.py\n2. Backend URL is correct: ' + BACKEND_URL);
      return;
    }

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build request with full context
      const requestBody: ChatAPIRequest = {
        message: message,
        history: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        })),
        context: buildUserContext()
      };

      // Call local Ollama backend
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: AIResponse = await response.json();

      if (data.success && data.response) {
        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please make sure the AI backend is running at " + BACKEND_URL + " and try again!",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsBackendOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Contextual suggestions based on user's financial data
  const getContextualSuggestions = (): string[] => {
    if (!userStats) {
      return [
        "How can I start budgeting?",
        "Tips for saving money",
        "What's a good emergency fund?",
        "How to track expenses?"
      ];
    }

    const savingsRate = userStats.monthlyIncome > 0 
      ? ((userStats.monthlyIncome - userStats.monthlyExpenses) / userStats.monthlyIncome) * 100 
      : 0;
    
    if (savingsRate < 20) {
      return [
        "How can I save more money?",
        "Where am I overspending?",
        "Tips to reduce expenses",
        "What's the 50/30/20 rule?"
      ];
    } else if (userStats.financialScore < 60) {
      return [
        "How to improve my financial score?",
        "Best investment options for beginners",
        "Should I create an emergency fund?",
        "How to set financial goals?"
      ];
    } else {
      return [
        "Best investment strategies",
        "How to grow my wealth?",
        "Tax-saving investment options",
        "Retirement planning tips"
      ];
    }
  };

  const suggestions = getContextualSuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">🤖 Ask FinPal</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isBackendOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isBackendOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isBackendOnline ? 'AI Online' : 'AI Offline'}
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          Your AI-powered financial assistant. Ask me anything about budgeting, saving, investing, or managing your money!
        </p>
        
        {!isBackendOnline && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>⚠️ AI Backend Offline:</strong> Make sure the backend server is running:
              <code className="block mt-2 bg-red-100 p-2 rounded text-xs font-mono">
                cd backend<br/>
                python server.py
              </code>
              <span className="block mt-2 text-xs">
                Connecting to: <strong>{BACKEND_URL}</strong>
              </span>
            </p>
          </div>
        )}
        
        {isBackendOnline && userStats && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>💡 Personalized Advice:</strong> I can see your financial data 
              (Income: ₹{userStats.monthlyIncome.toLocaleString()}, 
              Score: {userStats.financialScore}/100) and provide tailored recommendations!
            </p>
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-teal-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <p className="text-sm">FinPal is thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && isBackendOnline && (
          <div className="px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">💡 Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isBackendOnline ? "Ask me about your finances..." : "Start backend to enable AI chat..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
              disabled={isLoading || !isBackendOnline}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading || !isBackendOnline}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* AI Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧠</span>
          <h3 className="text-xl font-semibold text-purple-800">Powered by IBM Granite 3.2-2B</h3>
        </div>
        <p className="text-purple-700 mb-4">
          FinPal uses IBM Granite AI running locally on your computer for fast, private, and personalized financial advice based on your Finova data.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎯 Personalized</h4>
            <p className="text-sm text-purple-700">Advice tailored to your financial situation and goals</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🔒 100% Private</h4>
            <p className="text-sm text-purple-700">Runs locally - your data never leaves your computer</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">⚡ Fast & Smart</h4>
            <p className="text-sm text-purple-700">Local processing with context-aware responses</p>
          </div>
        </div>
      </div>
    </div>
  );
}