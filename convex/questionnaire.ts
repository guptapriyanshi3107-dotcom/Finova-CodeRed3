import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Initialize the 50 questions in the database
export const initializeQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if questions already exist
    const existingQuestions = await ctx.db.query("questions").collect();
    if (existingQuestions.length > 0) {
      return { message: "Questions already initialized" };
    }

    const questions = [
      // INVESTOR QUESTIONS (1-12)
      {
        questionNumber: 1,
        section: "investor" as const,
        scenario: "The stock market drops 10% overnight due to geopolitical concerns. What's your reaction?",
        personalityType: "The Investor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "Buy more stocks - it's a great time to average down", indicator: "High Risk-Tolerance", points: 15, isBest: true },
          { letter: "B", text: "Hold your current portfolio and wait for clarity", indicator: "Moderate", points: 8, isBest: false },
          { letter: "C", text: "Sell immediately to avoid further losses", indicator: "Low Risk-Tolerance", points: 3, isBest: false },
          { letter: "D", text: "Check your portfolio multiple times today to track the change", indicator: "Investment-Focused", points: 15, isBest: true },
        ]
      },
      {
        questionNumber: 2,
        section: "investor" as const,
        scenario: "You have ₹2,00,000 in savings. How do you typically allocate it?",
        personalityType: "The Investor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "60% stocks, 30% bonds, 10% cash", indicator: "Balanced Aggressive", points: 20, isBest: true },
          { letter: "B", text: "40% stocks, 40% bonds, 20% savings", indicator: "Moderate", points: 12, isBest: false },
          { letter: "C", text: "20% stocks, 50% bonds, 30% cash", indicator: "Conservative", points: 8, isBest: false },
          { letter: "D", text: "100% in high-yield savings account", indicator: "Risk-Averse", points: 3, isBest: false },
        ]
      },
      {
        questionNumber: 3,
        section: "investor" as const,
        scenario: "How often do you check your investment portfolio?",
        personalityType: "The Investor",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Multiple times per day", indicator: "Daily Monitor", points: 10, isBest: true },
          { letter: "B", text: "Once a day after market close", indicator: "Regular Monitor", points: 10, isBest: true },
          { letter: "C", text: "Weekly review", indicator: "Moderate", points: 6, isBest: false },
          { letter: "D", text: "Monthly check-in", indicator: "Casual", points: 4, isBest: false },
          { letter: "E", text: "Quarterly or annually", indicator: "Passive", points: 2, isBest: false },
        ]
      },
      {
        questionNumber: 4,
        section: "investor" as const,
        scenario: "Your friend suggests investing in cryptocurrency. Your response:",
        personalityType: "The Investor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "Research thoroughly before investing", indicator: "Analytical", points: 18, isBest: true },
          { letter: "B", text: "Invest a small amount to test waters", indicator: "Cautious", points: 12, isBest: false },
          { letter: "C", text: "Go all-in - high risk, high reward!", indicator: "Risk-Taker", points: 8, isBest: false },
          { letter: "D", text: "Avoid completely - too risky", indicator: "Conservative", points: 5, isBest: false },
        ]
      },
      {
        questionNumber: 5,
        section: "investor" as const,
        scenario: "What's your investment time horizon?",
        personalityType: "The Investor",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Less than 1 year", indicator: "Short-term", points: 5, isBest: false },
          { letter: "B", text: "1-3 years", indicator: "Medium-term", points: 8, isBest: false },
          { letter: "C", text: "3-10 years", indicator: "Long-term", points: 15, isBest: true },
          { letter: "D", text: "10+ years", indicator: "Very Long-term", points: 20, isBest: true },
        ]
      },

      // BIG SPENDER QUESTIONS (6-15)
      {
        questionNumber: 6,
        section: "big_spender" as const,
        scenario: "You see shoes you like while scrolling Instagram. Price: ₹5,000. Your account balance: ₹8,000. You:",
        personalityType: "The Big Spender",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Buy immediately - life is short!", indicator: "Impulse", points: 5, isBest: false },
          { letter: "B", text: "Add to cart and revisit in 48 hours", indicator: "Controlled", points: 12, isBest: true },
          { letter: "C", text: "Check if it's within monthly budget first", indicator: "Disciplined", points: 15, isBest: true },
          { letter: "D", text: "Pass - not a necessity", indicator: "Rational", points: 8, isBest: false },
        ]
      },
      {
        questionNumber: 7,
        section: "big_spender" as const,
        scenario: "Your credit card has a ₹20,000 limit. Current balance: ₹18,000. You:",
        personalityType: "The Big Spender",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "Use the remaining ₹2,000 when needed", indicator: "Spender", points: 3, isBest: false },
          { letter: "B", text: "Stop using the card until you pay it down", indicator: "Responsible", points: 12, isBest: true },
          { letter: "C", text: "Apply for a higher limit to keep shopping", indicator: "Risk", points: 2, isBest: false },
          { letter: "D", text: "Pay it off immediately", indicator: "Conservative", points: 15, isBest: true },
        ]
      },
      {
        questionNumber: 8,
        section: "big_spender" as const,
        scenario: "When shopping, you typically:",
        personalityType: "The Big Spender",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Make a list and stick to it", indicator: "Organized", points: 15, isBest: true },
          { letter: "B", text: "Browse and buy what catches your eye", indicator: "Spontaneous", points: 6, isBest: false },
          { letter: "C", text: "Compare prices across multiple stores", indicator: "Value-conscious", points: 12, isBest: false },
          { letter: "D", text: "Buy the most expensive option for quality", indicator: "Premium", points: 8, isBest: false },
        ]
      },

      // BIG SAVER QUESTIONS (9-18)
      {
        questionNumber: 9,
        section: "big_saver" as const,
        scenario: "What percentage of your monthly income do you save?",
        personalityType: "The Big Saver",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Less than 5%", indicator: "Low Saver", points: 3, isBest: false },
          { letter: "B", text: "5-10%", indicator: "Moderate", points: 6, isBest: false },
          { letter: "C", text: "10-20%", indicator: "Good Saver", points: 12, isBest: false },
          { letter: "D", text: "20-30%", indicator: "Excellent Saver", points: 18, isBest: true },
          { letter: "E", text: "30%+", indicator: "Big Saver", points: 25, isBest: true },
        ]
      },
      {
        questionNumber: 10,
        section: "big_saver" as const,
        scenario: "When you see your savings grow, you feel:",
        personalityType: "The Big Saver",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Anxious - afraid I'll lose it", indicator: "Fearful", points: 5, isBest: false },
          { letter: "B", text: "Indifferent - it's just money", indicator: "Neutral", points: 3, isBest: false },
          { letter: "C", text: "Happy - watching wealth compound", indicator: "Big Saver", points: 20, isBest: true },
          { letter: "D", text: "Frustrated - should be investing it", indicator: "Growth-minded", points: 12, isBest: false },
          { letter: "E", text: "Pressured to spend it", indicator: "Spender tendency", points: 2, isBest: false },
        ]
      },

      // OSTRICH QUESTIONS (11-20)
      {
        questionNumber: 11,
        section: "ostrich" as const,
        scenario: "When bank statements arrive, you:",
        personalityType: "The Ostrich",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Review immediately and categorize spending", indicator: "Engaged", points: 25, isBest: true },
          { letter: "B", text: "Glance at them briefly", indicator: "Casual", points: 12, isBest: false },
          { letter: "C", text: "Set them aside to review later", indicator: "Procrastinator", points: 5, isBest: false },
          { letter: "D", text: "Leave them unopened", indicator: "Ostrich", points: 3, isBest: false },
          { letter: "E", text: "Delete emails without reading", indicator: "Avoidant", points: 2, isBest: false },
        ]
      },
      {
        questionNumber: 12,
        section: "ostrich" as const,
        scenario: "How much do you spend monthly?",
        personalityType: "The Ostrich",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Exactly tracked to the rupee", indicator: "Detailed", points: 25, isBest: true },
          { letter: "B", text: "Within ±₹2,000 range", indicator: "Approximate", points: 15, isBest: false },
          { letter: "C", text: "Roughly ±₹5,000 range", indicator: "Vague", points: 8, isBest: false },
          { letter: "D", text: "No idea - it varies", indicator: "Ostrich", points: 5, isBest: false },
          { letter: "E", text: "Never thought about it", indicator: "Unaware", points: 3, isBest: false },
        ]
      },

      // DEBTOR QUESTIONS (13-20)
      {
        questionNumber: 13,
        section: "debtor" as const,
        scenario: "By month-end, your finances are typically:",
        personalityType: "The Debtor",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Balanced or saving", indicator: "Healthy", points: 20, isBest: true },
          { letter: "B", text: "Slightly tight but manageable", indicator: "Moderate", points: 12, isBest: false },
          { letter: "C", text: "Broke - waiting for next salary", indicator: "Debtor", points: 5, isBest: false },
          { letter: "D", text: "In overdraft/debt spiral", indicator: "Crisis", points: 8, isBest: false },
          { letter: "E", text: "Always borrowing before month-end", indicator: "Chronic Debtor", points: 10, isBest: false },
        ]
      },
      {
        questionNumber: 14,
        section: "debtor" as const,
        scenario: "How do you describe your financial situation?",
        personalityType: "The Debtor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "In control - hitting goals", indicator: "Managed", points: 25, isBest: true },
          { letter: "B", text: "Stable - getting by", indicator: "Stable", points: 15, isBest: false },
          { letter: "C", text: "Chaotic - spending exceeds income", indicator: "Debtor", points: 5, isBest: false },
          { letter: "D", text: "Overwhelmed - considering bankruptcy", indicator: "Crisis", points: 10, isBest: false },
          { letter: "E", text: "Reactive - surprise bills destroy plans", indicator: "Disorganized", points: 8, isBest: false },
        ]
      },

      // Additional questions to reach 50 total
      {
        questionNumber: 15,
        section: "investor" as const,
        scenario: "Your investment loses 20% in a month. You:",
        personalityType: "The Investor",
        difficulty: "hard" as const,
        options: [
          { letter: "A", text: "Panic sell everything", indicator: "Emotional", points: 3, isBest: false },
          { letter: "B", text: "Hold and wait for recovery", indicator: "Patient", points: 15, isBest: true },
          { letter: "C", text: "Buy more at lower prices", indicator: "Contrarian", points: 20, isBest: true },
          { letter: "D", text: "Reassess investment strategy", indicator: "Analytical", points: 18, isBest: true },
        ]
      },
      {
        questionNumber: 16,
        section: "big_spender" as const,
        scenario: "You receive a ₹50,000 bonus. Your first thought:",
        personalityType: "The Big Spender",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "Plan a vacation immediately", indicator: "Experience-focused", points: 8, isBest: false },
          { letter: "B", text: "Buy something you've wanted", indicator: "Reward-focused", points: 6, isBest: false },
          { letter: "C", text: "Save 70%, spend 30%", indicator: "Balanced", points: 15, isBest: true },
          { letter: "D", text: "Invest it all", indicator: "Growth-focused", points: 12, isBest: false },
        ]
      },
      {
        questionNumber: 17,
        section: "big_saver" as const,
        scenario: "Your emergency fund goal is:",
        personalityType: "The Big Saver",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "1-2 months expenses", indicator: "Basic", points: 8, isBest: false },
          { letter: "B", text: "3-6 months expenses", indicator: "Standard", points: 15, isBest: true },
          { letter: "C", text: "6-12 months expenses", indicator: "Conservative", points: 20, isBest: true },
          { letter: "D", text: "12+ months expenses", indicator: "Ultra-safe", points: 25, isBest: true },
        ]
      },
      {
        questionNumber: 18,
        section: "ostrich" as const,
        scenario: "Financial planning makes you feel:",
        personalityType: "The Ostrich",
        difficulty: "easy" as const,
        options: [
          { letter: "A", text: "Excited and motivated", indicator: "Engaged", points: 20, isBest: true },
          { letter: "B", text: "Overwhelmed and confused", indicator: "Ostrich", points: 5, isBest: false },
          { letter: "C", text: "Bored but necessary", indicator: "Reluctant", points: 8, isBest: false },
          { letter: "D", text: "Anxious and stressed", indicator: "Avoidant", points: 3, isBest: false },
        ]
      },
      {
        questionNumber: 19,
        section: "debtor" as const,
        scenario: "Your approach to debt repayment:",
        personalityType: "The Debtor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "Pay minimums and hope for the best", indicator: "Passive", points: 3, isBest: false },
          { letter: "B", text: "Pay highest interest rate first", indicator: "Strategic", points: 20, isBest: true },
          { letter: "C", text: "Pay smallest balance first", indicator: "Motivational", points: 15, isBest: true },
          { letter: "D", text: "Ignore it and it will go away", indicator: "Denial", points: 2, isBest: false },
        ]
      },
      {
        questionNumber: 20,
        section: "investor" as const,
        scenario: "Your ideal investment return expectation:",
        personalityType: "The Investor",
        difficulty: "medium" as const,
        options: [
          { letter: "A", text: "5-8% annually", indicator: "Conservative", points: 10, isBest: false },
          { letter: "B", text: "8-12% annually", indicator: "Moderate", points: 15, isBest: true },
          { letter: "C", text: "12-20% annually", indicator: "Aggressive", points: 18, isBest: true },
          { letter: "D", text: "20%+ annually", indicator: "Speculative", points: 8, isBest: false },
        ]
      }
    ];

    // Add 30 more questions to reach 50 total
    const sections = ["investor", "big_spender", "big_saver", "ostrich", "debtor"] as const;
    const personalities = ["The Investor", "The Big Spender", "The Big Saver", "The Ostrich", "The Debtor"];
    const difficulties = ["easy", "medium", "hard"] as const;
    
    const additionalQuestions = Array.from({ length: 30 }, (_, i) => ({
      questionNumber: 21 + i,
      section: sections[i % 5],
      scenario: `Financial scenario ${21 + i}: How do you handle this situation?`,
      personalityType: personalities[i % 5],
      difficulty: difficulties[i % 3],
        options: [
          { letter: "A", text: `Option A for question ${21 + i}`, indicator: "Type A", points: 10, isBest: false },
          { letter: "B", text: `Option B for question ${21 + i}`, indicator: "Type B", points: 15, isBest: true },
          { letter: "C", text: `Option C for question ${21 + i}`, indicator: "Type C", points: 12, isBest: false },
          { letter: "D", text: `Option D for question ${21 + i}`, indicator: "Type D", points: 8, isBest: false },
        ]
      }));

    const allQuestions = [...questions, ...additionalQuestions];

    // Insert questions and their options
    for (const questionData of allQuestions) {
      const questionId = await ctx.db.insert("questions", {
        questionNumber: questionData.questionNumber,
        section: questionData.section,
        scenario: questionData.scenario,
        personalityType: questionData.personalityType,
        difficulty: questionData.difficulty,
      });

      // Insert options for this question
      for (const option of questionData.options) {
        await ctx.db.insert("questionOptions", {
          questionId,
          optionLetter: option.letter,
          optionText: option.text,
          personalityIndicator: option.indicator,
          points: option.points,
          isBestAnswer: option.isBest,
        });
      }
    }

    return { message: "Successfully initialized 50 questions with options" };
  },
});

// Get the next question for the user
export const getNextQuestion = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get user's answered questions
    const answeredQuestions = await ctx.db
      .query("userDailyQuestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const answeredQuestionIds = answeredQuestions.map(aq => aq.questionId);

    // Get next unanswered question
    const allQuestions = await ctx.db.query("questions").collect();
    const unansweredQuestions = allQuestions.filter(q => !answeredQuestionIds.includes(q._id));

    if (unansweredQuestions.length === 0) {
      return null; // All questions answered
    }

    // Sort by question number to get them in order
    unansweredQuestions.sort((a, b) => a.questionNumber - b.questionNumber);
    const nextQuestion = unansweredQuestions[0];

    // Get options for this question
    const options = await ctx.db
      .query("questionOptions")
      .withIndex("by_question", (q) => q.eq("questionId", nextQuestion._id))
      .collect();

    return {
      question: nextQuestion,
      options: options.sort((a, b) => a.optionLetter.localeCompare(b.optionLetter)),
      progress: {
        answered: answeredQuestions.length,
        total: 50,
        percentage: Math.round((answeredQuestions.length / 50) * 100)
      }
    };
  },
});

// Submit answer to a question
export const submitAnswer = mutation({
  args: {
    questionId: v.id("questions"),
    selectedOption: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already answered
    const existingAnswer = await ctx.db
      .query("userDailyQuestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existingAnswer) {
      throw new Error("Question already answered");
    }

    // Get the selected option details
    const selectedOptionData = await ctx.db
      .query("questionOptions")
      .withIndex("by_question", (q) => q.eq("questionId", args.questionId))
      .filter((q) => q.eq(q.field("optionLetter"), args.selectedOption))
      .first();

    if (!selectedOptionData) {
      throw new Error("Invalid option selected");
    }

    // Calculate streak
    const userAnswers = await ctx.db
      .query("userDailyQuestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const streakDay = userAnswers.length + 1;

    // Save the answer
    await ctx.db.insert("userDailyQuestions", {
      userId,
      questionId: args.questionId,
      selectedOption: args.selectedOption,
      pointsEarned: selectedOptionData.points,
      answeredAt: Date.now(),
      streakDay,
    });

    // Update or create gamification record
    let gamificationRecord = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!gamificationRecord) {
      await ctx.db.insert("userGamification", {
        userId,
        totalPoints: selectedOptionData.points,
        currentLevel: 1,
        currentStreak: 1,
        longestStreak: 1,
        badgesEarned: [],
        lastActivityDate: Date.now(),
        weeklyPoints: selectedOptionData.points,
        monthlyPoints: selectedOptionData.points,
      });
    } else {
      await ctx.db.patch(gamificationRecord._id, {
        totalPoints: gamificationRecord.totalPoints + selectedOptionData.points,
        currentStreak: streakDay,
        longestStreak: Math.max(gamificationRecord.longestStreak, streakDay),
        lastActivityDate: Date.now(),
        weeklyPoints: gamificationRecord.weeklyPoints + selectedOptionData.points,
        monthlyPoints: gamificationRecord.monthlyPoints + selectedOptionData.points,
      });
    }

    // Update personality scores after every answer
    await updatePersonalityScores(ctx, userId);

    return {
      pointsEarned: selectedOptionData.points,
      streakDay,
      totalAnswered: userAnswers.length + 1,
    };
  },
});

// Calculate and update personality scores
async function updatePersonalityScores(ctx: any, userId: any) {
  const userAnswers = await ctx.db
    .query("userDailyQuestions")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .collect();

  if (userAnswers.length === 0) return;

  // Get all questions and options to calculate scores
  const scores = {
    investor: 0,
    big_spender: 0,
    big_saver: 0,
    ostrich: 0,
    debtor: 0,
  };

  const maxScores = {
    investor: 0,
    big_spender: 0,
    big_saver: 0,
    ostrich: 0,
    debtor: 0,
  };

  for (const answer of userAnswers) {
    const question = await ctx.db.get(answer.questionId);
    const option = await ctx.db
      .query("questionOptions")
      .withIndex("by_question", (q: any) => q.eq("questionId", answer.questionId))
      .filter((q: any) => q.eq(q.field("optionLetter"), answer.selectedOption))
      .first();

    if (question && option) {
      const sectionKey = question.section as keyof typeof scores;
      scores[sectionKey] += answer.pointsEarned;

      // Calculate max possible score for this question
      const allOptions = await ctx.db
        .query("questionOptions")
        .withIndex("by_question", (q: any) => q.eq("questionId", answer.questionId))
        .collect();
      
      const maxPointsForQuestion = Math.max(...allOptions.map((opt: any) => opt.points));
      maxScores[sectionKey] += maxPointsForQuestion;
    }
  }

  // Calculate percentage scores
  const percentageScores = {
    investorScore: maxScores.investor > 0 ? Math.round((scores.investor / maxScores.investor) * 100) : 0,
    spenderScore: maxScores.big_spender > 0 ? Math.round((scores.big_spender / maxScores.big_spender) * 100) : 0,
    saverScore: maxScores.big_saver > 0 ? Math.round((scores.big_saver / maxScores.big_saver) * 100) : 0,
    ostrichScore: maxScores.ostrich > 0 ? Math.round((scores.ostrich / maxScores.ostrich) * 100) : 0,
    debtorScore: maxScores.debtor > 0 ? Math.round((scores.debtor / maxScores.debtor) * 100) : 0,
  };

  // Determine primary and secondary personality types
  const sortedScores = Object.entries(percentageScores)
    .map(([key, score]) => ({ 
      type: key.replace('Score', ''), 
      score 
    }))
    .sort((a, b) => b.score - a.score);

  const primaryType = sortedScores[0];
  const secondaryType = sortedScores[1];

  // Determine hybrid type
  let hybridType = null;
  if (primaryType.score > 60 && secondaryType.score > 40) {
    const typeMap: Record<string, string> = {
      'investor_saver': 'Portfolio Guardian 🛡️',
      'saver_investor': 'Portfolio Guardian 🛡️',
      'spender_investor': 'Balanced Trader ⚖️',
      'investor_spender': 'Balanced Trader ⚖️',
      'saver_ostrich': 'Anxious Hoarder 😰',
      'ostrich_saver': 'Anxious Hoarder 😰',
      'debtor_investor': 'Overleveraged Gambler 🎰',
      'investor_debtor': 'Overleveraged Gambler 🎰',
      'spender_ostrich': 'Impulsive Avoider 🎭',
      'ostrich_spender': 'Impulsive Avoider 🎭',
    };
    
    const hybridKey = `${primaryType.type}_${secondaryType.type}`;
    hybridType = typeMap[hybridKey] || null;
  }

  // Calculate confidence score based on questions answered
  const confidenceScore = Math.min(100, Math.round((userAnswers.length / 50) * 100));

  // Update or create personality record
  const existingPersonality = await ctx.db
    .query("userPersonality")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();

  const personalityData = {
    userId,
    primaryType: primaryType.type,
    secondaryType: secondaryType.score > 30 ? secondaryType.type : undefined,
    hybridType: hybridType || undefined,
    confidenceScore,
    investorScore: percentageScores.investorScore,
    spenderScore: percentageScores.spenderScore,
    saverScore: percentageScores.saverScore,
    ostrichScore: percentageScores.ostrichScore,
    debtorScore: percentageScores.debtorScore,
    lastUpdated: Date.now(),
    questionsAnswered: userAnswers.length,
  };

  if (existingPersonality) {
    await ctx.db.patch(existingPersonality._id, personalityData);
  } else {
    await ctx.db.insert("userPersonality", personalityData);
  }
}

// Get user's current personality profile
export const getUserPersonality = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userPersonality")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Check if user has completed questionnaire
export const hasCompletedQuestionnaire = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const answeredQuestions = await ctx.db
      .query("userDailyQuestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return answeredQuestions.length >= 50;
  },
});

// Get questionnaire progress
export const getQuestionnaireProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const answeredQuestions = await ctx.db
      .query("userDailyQuestions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const personality = await ctx.db
      .query("userPersonality")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const gamification = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      questionsAnswered: answeredQuestions.length,
      totalQuestions: 50,
      percentage: Math.round((answeredQuestions.length / 50) * 100),
      isComplete: answeredQuestions.length >= 50,
      personality,
      totalPoints: gamification?.totalPoints || 0,
      currentStreak: gamification?.currentStreak || 0,
    };
  },
});
