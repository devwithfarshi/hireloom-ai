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
  RoleProtectedRoute,
  AuthProvider,
} from "./features/auth/components";
import { Role } from "./features/auth/types";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ProfilePage, CandidateOnboardingPage } from "./features/profile/pages";
import { CompanyOnboardingPage } from "./features/company/pages";
import { CreateJobPage, EditJobPage, JobDashboardPage, JobDetailPage, JobBrowsePage } from "./features/job/pages";
import { MyApplicationsPage } from "./features/application/pages";
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
              
              {/* Job routes - accessible by all users */}
              <Route
                path="/jobs"
                element={
                  <AppLayout>
                    <JobBrowsePage />
                  </AppLayout>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <AppLayout>
                    <JobDetailPage />
                  </AppLayout>
                }
              />
              
              {/* Application routes - only for candidates */}
              <Route element={<RoleProtectedRoute allowedRoles={[Role.CANDIDATE]} />}>
                <Route
                  path="/my-applications"
                  element={
                    <AppLayout>
                      <MyApplicationsPage />
                    </AppLayout>
                  }
                />
              </Route>
              
              {/* Job routes - only for recruiters */}
              <Route element={<RoleProtectedRoute allowedRoles={[Role.RECRUITER]} />}>
                <Route
                  path="/dashboard/jobs"
                  element={
                    <AppLayout>
                      <JobDashboardPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/dashboard/jobs/create"
                  element={
                    <AppLayout>
                      <CreateJobPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/dashboard/jobs/edit/:id"
                  element={
                    <AppLayout>
                      <EditJobPage />
                    </AppLayout>
                  }
                />
              </Route>
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
