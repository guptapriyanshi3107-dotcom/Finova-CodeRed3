import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Dashboard } from "./Dashboard";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const profile = useQuery(api.dashboard.getUserProfile);
  const user = useQuery(api.auth.loggedInUser);
  const initializeQuestions = useMutation(api.questionnaire.initializeQuestions);
  const initializeSampleData = useMutation(api.dashboard.initializeSampleData);

  useEffect(() => {
    // Initialize questions when app loads
    if (user) {
      initializeQuestions().catch(console.error);
    }
  }, [initializeQuestions, user]);

  useEffect(() => {
    if (user === undefined) {
      setIsLoading(true);
      return;
    }
    
    setIsLoading(false);
    
    if (user === null) {
      setShowOnboarding(false);
      return;
    }

    if (profile === null) {
      setShowOnboarding(true);
    } else if (profile && !profile.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [user, profile]);

  const handleOnboardingComplete = async () => {
    try {
      await initializeSampleData();
      setShowOnboarding(false);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Finova...</h2>
          <p className="text-gray-600">Preparing your financial journey</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />

        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  F
                </div>
                <h1 className="text-4xl font-bold text-gray-900 font-finova mb-2">
                  Finova
                </h1>
                <h2 className="text-xl text-gray-600 mb-8">
                  Your AI-Powered Financial Companion
                </h2>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Welcome to Your Financial Journey! 🚀
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Sign in to discover your financial personality and get personalized insights
                  </p>
                  
                  {/* Features Preview */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="text-teal-600 font-semibold mb-1">🧠 Personality Test</div>
                      <div className="text-gray-600">50 questions to discover your financial type</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 font-semibold mb-1">📊 Smart Analytics</div>
                      <div className="text-gray-600">AI-powered insights and recommendations</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-purple-600 font-semibold mb-1">🎯 Goal Tracking</div>
                      <div className="text-gray-600">Set and achieve financial milestones</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-green-600 font-semibold mb-1">💰 Expense Manager</div>
                      <div className="text-gray-600">Track spending and optimize budgets</div>
                    </div>
                  </div>
                </div>
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
        {showOnboarding ? (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        ) : (
          <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 font-finova">
                    Finova
                  </h1>
                </div>
                <SignOutButton />
              </div>
            </div>
            <Dashboard />
          </div>
        )}
    </main>
  );
}

export default App;
