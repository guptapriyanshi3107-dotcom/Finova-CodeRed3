import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'granite3.2:2b'; // Using your installed Granite model

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello! I'm FinPal, your AI financial advisor powered by IBM Granite. How can I help you today?", 
      sender: 'ai',
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOllamaOnline, setIsOllamaOnline] = useState(false);
  const [ollamaError, setOllamaError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user data for context
  const userProfile = useQuery(api.dashboard.getUserProfile);
  const userStats = useQuery(api.dashboard.getDashboardStats);
  const userGoals = useQuery(api.dashboard.getGoals);
  const recentTransactions = useQuery(api.dashboard.getRecentTransactions);

  // Check Ollama health
  useEffect(() => {
    checkOllamaHealth();
    const interval = setInterval(checkOllamaHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkOllamaHealth = async () => {
    try {
      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: 'Hello',
          stream: false,
          options: { max_tokens: 5 }
        })
      });
      
      if (response.ok) {
        setIsOllamaOnline(true);
        setOllamaError("");
      } else {
        const errorText = await response.text();
        setIsOllamaOnline(false);
        setOllamaError(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error: any) {
      setIsOllamaOnline(false);
      setOllamaError('Ollama not running. Start with: ollama serve');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const buildUserContext = () => {
    if (!userStats) return "";

    let context = `User's Financial Profile:
- Monthly Income: ₹${userStats.monthlyIncome}
- Monthly Expenses: ₹${userStats.monthlyExpenses}
- Total Savings: ₹${userStats.totalSavings}
- Financial Score: ${userProfile?.financialScore || userStats.financialScore}/100`;

    if (userGoals && userGoals.length > 0) {
      context += `\n\nFinancial Goals:`;
      userGoals.slice(0, 3).forEach(g => {
        context += `\n- ${g.name}: ₹${g.savedAmount}/${g.targetAmount}`;
      });
    }

    if (recentTransactions && recentTransactions.length > 0) {
      context += `\n\nRecent Transactions:`;
      recentTransactions.slice(0, 3).forEach(t => {
        context += `\n- ${t.category}: ₹${t.amount} (${t.type})`;
      });
    }

    return context;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!isOllamaOnline) {
      alert(`Ollama AI is offline.\n\n${ollamaError}\n\nSteps:\n1. Open terminal\n2. Run: ollama serve\n3. Model granite3.2:2b is already installed ✓`);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const userContext = buildUserContext();
      
      const conversationHistory = messages.slice(-6).map(m => 
        `${m.sender === 'user' ? 'User' : 'FinPal'}: ${m.text}`
      ).join('\n\n');

      const prompt = `You are FinPal, an AI financial advisor for Finova. You provide helpful, actionable financial advice in a friendly, conversational tone. Keep responses concise (2-3 sentences).

${userContext ? `\n${userContext}\n` : ''}

${conversationHistory ? `Previous Conversation:\n${conversationHistory}\n\n` : ''}

User: ${inputMessage}

FinPal:`;

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL_NAME,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 300,
            stop: ['User:', 'FinPal:']
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response.trim(),
          sender: 'ai',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('No response from Ollama');
      }
    } catch (error: any) {
      console.error('Ollama Error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error.message}\n\nMake sure Ollama is running with: ollama serve`,
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      checkOllamaHealth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "How can I improve my financial score?",
    "What should I budget for this month?",
    "Help me plan for my goals",
    "Analyze my spending patterns"
  ];

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                🤖
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FinPal AI Assistant</h1>
                <p className="text-gray-600">Powered by IBM Granite 3.2 (2B Model)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isOllamaOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${isOllamaOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOllamaOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {!isOllamaOnline && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-semibold mb-2">⚠️ Ollama AI Offline</p>
              <p className="text-red-700 text-sm mb-2">{ollamaError}</p>
              <div className="bg-red-100 p-2 rounded text-xs font-mono space-y-1">
                <div>✓ Model granite3.2:2b already installed</div>
                <div>✗ Ollama service not responding</div>
                <div className="mt-2">Check if Ollama is running in Task Manager</div>
              </div>
              <button
                onClick={checkOllamaHealth}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                🔄 Retry Connection
              </button>
            </div>
          )}

          {isOllamaOnline && userStats && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                <strong>✅ Connected!</strong> Using your financial data (Income: ₹{userStats.monthlyIncome.toLocaleString()}) for personalized advice
              </p>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-teal-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="text-sm">FinPal is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {isOllamaOnline && (
          <div className="border-t border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-3">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isOllamaOnline ? "Ask FinPal anything about your finances..." : "Waiting for Ollama..."}
              className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
              rows={2}
              disabled={isLoading || !isOllamaOnline}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !isOllamaOnline}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '⏳' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🧠</span>
          <h3 className="text-xl font-semibold text-purple-800">Powered by IBM Granite AI</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🎯 Personalized</h4>
            <p className="text-sm text-purple-700">Uses your actual Finova data for tailored advice</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">🔒 Private</h4>
            <p className="text-sm text-purple-700">Runs locally - your data never leaves your computer</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">⚡ Fast</h4>
            <p className="text-sm text-purple-700">Local processing means instant responses</p>
          </div>
        </div>
      </div>
    </div>
  );
}