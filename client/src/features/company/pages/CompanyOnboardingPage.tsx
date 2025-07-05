import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyOnboardingForm } from "../components/CompanyOnboardingForm";

export function CompanyOnboardingPage() {
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
          <h1 className="text-3xl font-bold">Set Up Your Company</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please provide your company details to get started
          </p>
        </div>
        <CompanyOnboardingForm />
      </div>
    </AuthLayout>
  );
}
