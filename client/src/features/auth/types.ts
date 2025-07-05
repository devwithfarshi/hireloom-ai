import { Company } from "../company/companyApi";
import { CandidateProfile } from "../profile/candidateProfileApi";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  role: "RECRUITER" | "CANDIDATE" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
  company?: Company;
  candidateProfile?: CandidateProfile;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: "RECRUITER" | "CANDIDATE";
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
