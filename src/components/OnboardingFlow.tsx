import { FinancialSetup } from "./FinancialSetup";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  // Skip questionnaire for now, go directly to financial setup
  return <FinancialSetup onComplete={onComplete} />;
}
