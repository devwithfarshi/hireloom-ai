import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CandidateProfileForm } from "../components";

export function CandidateOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user?.companyID || user?.candidateProfileID) {
      navigate("/");
    }
  }, [user]);
  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Set Up Your Candidate Profile</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please provide your details to help employers find you
          </p>
        </div>
        <CandidateProfileForm />
      </div>
    </AuthLayout>
  );
}
