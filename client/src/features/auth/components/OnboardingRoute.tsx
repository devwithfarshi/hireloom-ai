import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import { useGetCompanyQuery } from "@/features/company/companyApi";
import { useGetCandidateProfileQuery } from "@/features/profile/candidateProfileApi";

export function OnboardingRoute() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Skip queries if not authenticated or no user
  const skipQueries = !isAuthenticated || !user;
  
  // Check if user has company profile (for recruiters)
  const { data: company, isLoading: isCompanyLoading } = useGetCompanyQuery(undefined, {
    skip: skipQueries || user?.role !== 'RECRUITER',
  });
  
  // Check if user has candidate profile (for candidates)
  const { data: candidateProfile, isLoading: isProfileLoading } = useGetCandidateProfileQuery(undefined, {
    skip: skipQueries || user?.role !== 'CANDIDATE',
  });
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If still loading profile data, return null (or a loading spinner)
  if (
    (user?.role === 'RECRUITER' && isCompanyLoading) ||
    (user?.role === 'CANDIDATE' && isProfileLoading)
  ) {
    return null; // Or return a loading spinner
  }
  
  // If user is a recruiter and doesn't have a company profile, redirect to company onboarding
  if (user?.role === 'RECRUITER' && !company) {
    return <Navigate to="/company/onboarding" replace />;
  }
  
  // If user is a candidate and doesn't have a profile, redirect to candidate onboarding
  if (user?.role === 'CANDIDATE' && !candidateProfile) {
    return <Navigate to="/candidate/onboarding" replace />;
  }
  
  // If user has completed onboarding, render the protected route
  return <Outlet />;
}