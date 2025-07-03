import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "./features/auth/pages";
import {
  ProtectedRoute,
  OnboardingRoute,
  AuthProvider,
} from "./features/auth/components";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ProfilePage, CandidateOnboardingPage } from "./features/profile/pages";
import { CompanyOnboardingPage } from "./features/company/pages";
import { AppLayout } from "./components/layout";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected routes with onboarding check */}
          <Route element={<ProtectedRoute />}>
            {/* Onboarding routes */}
            <Route
              path="/company/onboarding"
              element={<CompanyOnboardingPage />}
            />
            <Route
              path="/candidate/onboarding"
              element={<CandidateOnboardingPage />}
            />

            {/* Routes that require completed onboarding */}
            <Route element={<OnboardingRoute />}>
              <Route
                path="/"
                element={
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                }
              />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
