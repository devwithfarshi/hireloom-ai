import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import { Role } from "../types";
export function OnboardingRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return null;
  }
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is a recruiter and doesn't have a company profile, redirect to company onboarding
  if (user?.role === Role.RECRUITER && !user.company) {
    return <Navigate to="/company/onboarding" replace />;
  }

  // If user is a candidate and doesn't have a profile, redirect to candidate onboarding
  if (user?.role === Role.CANDIDATE && !user.candidateProfile) {
    return <Navigate to="/candidate/onboarding" replace />;
  }

  // If user has completed onboarding, render the protected route
  return <Outlet />;
}
