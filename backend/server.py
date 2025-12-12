from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import json

app = Flask(__name__)
# Enable CORS for all origins (development only)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def build_system_prompt(user_context=None):
    """Build an enhanced system prompt with optional user context"""
    
    base_prompt = """You are FinPal, an expert financial advisor and assistant for Finova, a personal finance management app.

Your expertise includes:
- Personal budgeting and expense management
- Savings strategies and emergency funds
- Investment advice (mutual funds, stocks, SIPs, FDs)
- Tax planning and optimization
- Debt management and credit score improvement
- Financial goal setting and tracking
- Indian financial products and regulations (PPF, EPF, NPS, ELSS, etc.)

Guidelines:
- Give practical, actionable advice
- Use Indian Rupees (₹) for currency
- Reference Indian financial products when relevant
- Be encouraging and supportive
- Keep responses concise (2-3 short paragraphs)
- Use emojis occasionally to be friendly
- If you don't have enough information, ask clarifying questions
- Focus on user's specific situation, not generic advice"""

    if user_context:
        context_parts = []
        
        if user_context.get('monthlyIncome'):
            context_parts.append(f"Monthly Income: ₹{user_context['monthlyIncome']:,}")
        if user_context.get('monthlyExpenses'):
            context_parts.append(f"Monthly Expenses: ₹{user_context['monthlyExpenses']:,}")
        if user_context.get('savings'):
            context_parts.append(f"Current Savings: ₹{user_context['savings']:,}")
        if user_context.get('financialScore'):
            context_parts.append(f"Financial Health Score: {user_context['financialScore']}/100")
        
        if user_context.get('goals'):
            goals_info = []
            for goal in user_context['goals'][:3]:  # Limit to 3 goals
                progress = (goal['savedAmount'] / goal['targetAmount'] * 100) if goal['targetAmount'] > 0 else 0
                goals_info.append(f"{goal['name']} (₹{goal['savedAmount']:,}/₹{goal['targetAmount']:,} - {progress:.0f}%)")
            if goals_info:
                context_parts.append(f"Active Goals: {', '.join(goals_info)}")
        
        if user_context.get('recentTransactions'):
            expense_total = sum(t['amount'] for t in user_context['recentTransactions'] if t['type'] == 'expense')
            income_total = sum(t['amount'] for t in user_context['recentTransactions'] if t['type'] == 'income')
            if expense_total > 0 or income_total > 0:
                context_parts.append(f"Recent Activity: ₹{expense_total:,} expenses, ₹{income_total:,} income")
        
        if context_parts:
            base_prompt += f"\n\n📊 USER'S CURRENT FINANCIAL SITUATION:\n" + "\n".join(f"• {part}" for part in context_parts)
            base_prompt += "\n\nUse this information to provide personalized, context-aware advice."
    
    return base_prompt

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'FinPal API is running',
        'version': '1.0.0',
        'endpoints': {
            'chat': '/api/chat',
            'health': '/api/health',
            'suggestions': '/api/suggestions',
            'analyze': '/api/analyze'
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('history', [])
        user_context = data.get('context', None)
        
        if not user_message.strip():
            return jsonify({
                'success': False,
                'error': 'Message cannot be empty'
            }), 400
        
        # Build enhanced system prompt with user context
        system_prompt = build_system_prompt(user_context)
        
        # Prepare messages for Ollama
        messages = [
            {'role': 'system', 'content': system_prompt}
        ]
        
        # Add conversation history (keep last 5 exchanges = 10 messages)
        for msg in conversation_history[-10:]:
            if msg.get('role') in ['user', 'assistant']:
                messages.append({
                    'role': msg['role'],
                    'content': msg['content']
                })
        
        # Add current user message
        messages.append({
            'role': 'user',
            'content': user_message
        })
        
        print(f"\n💬 User Query: {user_message}")
        if user_context:
            print(f"📊 Context: Income=₹{user_context.get('monthlyIncome', 0):,}, Score={user_context.get('financialScore', 0)}")
        
        # Call Ollama with optimized parameters
        response = ollama.chat(
            model='granite3.2:2b',
            messages=messages,
            options={
                'temperature': 0.7,      # Balanced creativity
                'top_p': 0.9,           # Nucleus sampling
                'top_k': 40,            # Top-k sampling
                'repeat_penalty': 1.1,  # Reduce repetition
                'num_predict': 400,     # Max response length
            }
        )
        
        ai_response = response['message']['content'].strip()
        
        print(f"🤖 AI Response: {ai_response[:100]}...")
        
        return jsonify({
            'success': True,
            'response': ai_response,
            'source': 'granite'
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'source': 'fallback'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Check if Ollama is running and model is available"""
    try:
        # Get list of models
        models_response = ollama.list()
        
        # Debug: Print the raw response
        print(f"🔍 Raw Ollama response type: {type(models_response)}")
        print(f"🔍 Raw Ollama response: {models_response}")
        
        # Extract model names - handle different response structures
        model_names = []
        
        # Handle ListResponse object (newer ollama-python versions)
        if hasattr(models_response, 'models'):
            models_list = models_response.models
            for model in models_list:
                if hasattr(model, 'model'):
                    model_names.append(model.model)
                elif hasattr(model, 'name'):
                    model_names.append(model.name)
                elif isinstance(model, dict):
                    name = model.get('model') or model.get('name')
                    if name:
                        model_names.append(name)
        # Handle dict response (older versions)
        elif isinstance(models_response, dict):
            # Check for 'models' key
            if 'models' in models_response:
                models_list = models_response['models']
                for model in models_list:
                    if isinstance(model, dict):
                        # Try 'model' first, then 'name'
                        name = model.get('model') or model.get('name')
                        if name:
                            model_names.append(name)
            # Sometimes the response is just the dict itself
            elif 'model' in models_response or 'name' in models_response:
                name = models_response.get('model') or models_response.get('name')
                if name:
                    model_names.append(name)
        
        print(f"🔍 Detected models: {model_names}")
        
        # Check if granite model is available (case-insensitive)
        granite_available = any('granite' in str(name).lower() for name in model_names)
        
        if granite_available:
            return jsonify({
                'status': 'ok',
                'message': '✅ Ollama is running with Granite 3.2',
                'model': 'granite3.2:2b',
                'available_models': model_names
            })
        else:
            return jsonify({
                'status': 'warning',
                'message': '⚠️ Ollama is running but granite3.2:2b not found. Run: ollama pull granite3.2:2b',
                'available_models': model_names,
                'debug_response': str(models_response)[:500]  # First 500 chars for debugging
            }), 200
            
    except Exception as e:
        print(f"❌ Health check error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': f'❌ Ollama is not running: {str(e)}',
            'available_models': []
        }), 500

@app.route('/api/suggestions', methods=['POST'])
def get_suggestions():
    """Generate smart suggestions based on user's financial data"""
    try:
        data = request.json
        context = data.get('context', {})
        
        suggestions = []
        
        income = context.get('monthlyIncome', 0)
        expenses = context.get('monthlyExpenses', 0)
        savings = context.get('savings', 0)
        score = context.get('financialScore', 0)
        
        # Calculate financial ratios
        if income > 0:
            savings_rate = (savings / income) * 100 if savings > 0 else 0
            expense_ratio = (expenses / income) * 100
            
            # Generate contextual suggestions
            if expense_ratio > 80:
                suggestions.append("⚠️ Your expenses are very high. Let's find ways to reduce spending.")
            elif expense_ratio > 60:
                suggestions.append("💡 Your expense ratio is moderate. Small optimizations can make a big difference.")
            
            if savings_rate < 10:
                suggestions.append("💰 Try to save at least 20% of your income using the 50/30/20 rule.")
            elif savings_rate < 20:
                suggestions.append("📈 You're on track! Aim for 20-30% savings rate for financial security.")
            else:
                suggestions.append("🌟 Excellent savings rate! Consider investing surplus funds.")
            
            if score < 50:
                suggestions.append("🎯 Build an emergency fund equal to 3-6 months of expenses.")
            elif score < 70:
                suggestions.append("📊 Good progress! Focus on diversifying your investments.")
            else:
                suggestions.append("✨ Great financial health! Consider advanced investment strategies.")
        
        # Check goals
        if context.get('goals'):
            incomplete_goals = [g for g in context['goals'] if g['savedAmount'] < g['targetAmount']]
            if incomplete_goals:
                suggestions.append(f"🎯 You have {len(incomplete_goals)} active goal(s). Stay consistent!")
        
        # Default suggestions if none generated
        if not suggestions:
            suggestions = [
                "📱 Add your daily expenses to track spending patterns",
                "🎯 Set a financial goal to stay motivated",
                "📊 Review your budget categories regularly"
            ]
        
        return jsonify({
            'success': True,
            'suggestions': suggestions[:4]  # Return max 4 suggestions
        })
        
    except Exception as e:
        print(f"❌ Suggestions Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_financial_health():
    """Analyze user's overall financial health"""
    try:
        data = request.json
        context = data.get('context', {})
        
        analysis = {
            'score': context.get('financialScore', 0),
            'status': 'Unknown',
            'strengths': [],
            'improvements': [],
            'recommendations': []
        }
        
        income = context.get('monthlyIncome', 0)
        expenses = context.get('monthlyExpenses', 0)
        savings = context.get('savings', 0)
        
        if income > 0:
            savings_rate = ((income - expenses) / income) * 100
            
            # Determine status
            if analysis['score'] >= 80:
                analysis['status'] = 'Excellent'
            elif analysis['score'] >= 60:
                analysis['status'] = 'Good'
            elif analysis['score'] >= 40:
                analysis['status'] = 'Fair'
            else:
                analysis['status'] = 'Needs Improvement'
            
            # Identify strengths
            if savings_rate > 30:
                analysis['strengths'].append('High savings rate')
            if savings > income * 6:
                analysis['strengths'].append('Strong emergency fund')
            
            # Identify improvements
            if savings_rate < 20:
                analysis['improvements'].append('Increase monthly savings')
            if expenses > income * 0.7:
                analysis['improvements'].append('Reduce expenses')
            
            # Generate recommendations
            if savings < income * 3:
                analysis['recommendations'].append('Build a 3-6 month emergency fund')
            if savings_rate < 20:
                analysis['recommendations'].append('Aim for 20% savings rate')
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 FINOVA AI BACKEND - Starting...")
    print("=" * 70)
    print(f"📍 Server URL:      http://localhost:5000")
    print(f"🤖 AI Model:        IBM Granite 3.2-2B (Local)")
    print(f"🔧 Endpoints:")
    print(f"   → GET  /                  - API info")
    print(f"   → POST /api/chat          - Main chat with context")
    print(f"   → GET  /api/health        - Check Ollama status")
    print(f"   → POST /api/suggestions   - Get smart suggestions")
    print(f"   → POST /api/analyze       - Analyze financial health")
    print("=" * 70)
    print("✅ Backend ready! Waiting for requests...\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')