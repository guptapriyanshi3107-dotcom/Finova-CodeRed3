import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface QuestionnaireProps {
  onComplete: () => void;
}

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionData = useQuery(api.questionnaire.getNextQuestion);
  const progress = useQuery(api.questionnaire.getQuestionnaireProgress);
  const submitAnswer = useMutation(api.questionnaire.submitAnswer);

  useEffect(() => {
    if (questionData) {
      setSelectedOption("");
    }
  }, [questionData]);

  useEffect(() => {
    if (progress?.isComplete) {
      onComplete();
    }
  }, [progress?.isComplete, onComplete]);

  const handleSubmit = async () => {
    if (!selectedOption || !questionData?.question) {
      toast.error("Please select an answer");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitAnswer({
        questionId: questionData.question._id,
        selectedOption,
      });

      toast.success(`+${result.pointsEarned} FC earned! 🎉`);
      
      // Reset for next question
      setSelectedOption("");
      
      // Show personality insight every 10 questions
      if (result.totalAnswered % 10 === 0 && result.totalAnswered < 50) {
        toast.info(`${result.totalAnswered}/50 questions completed! Your personality is taking shape...`);
      }

    } catch (error: any) {
      toast.error(error.message || "Failed to submit answer");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!questionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Financial Journey...</h2>
            <p className="text-gray-600">Preparing personalized questions just for you</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = questionData.progress.percentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧠 Financial Personality Assessment
          </h1>
          <p className="text-gray-600 mb-4">
            Discover your unique financial personality to get personalized insights
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white rounded-full p-1 shadow-sm max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Question {questionData.progress.answered + 1} of {questionData.progress.total}</span>
              <span>{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {questionData.question.personalityType}
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {questionData.question.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {questionData.question.scenario}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {questionData.options.map((option: any) => (
              <label
                key={option.optionLetter}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  selectedOption === option.optionLetter
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.optionLetter}
                  checked={selectedOption === option.optionLetter}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    selectedOption === option.optionLetter
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}>
                    {option.optionLetter}
                  </span>
                  <span className="text-gray-800">{option.optionText}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                "Next Question →"
              )}
            </button>
          </div>
        </div>

        {/* Progress Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-teal-600">{progress?.totalPoints || 0}</div>
              <div className="text-sm text-gray-600">Finova Coins Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{progress?.currentStreak || 0}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {progress?.personality?.confidenceScore || 0}%
              </div>
              <div className="text-sm text-gray-600">Personality Confidence</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl">💡</span>
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Pro Tip</h3>
              <p className="text-blue-700 text-sm">
                Answer honestly to get the most accurate personality insights. There are no right or wrong answers!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
