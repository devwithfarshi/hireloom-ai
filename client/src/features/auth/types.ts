import { Company } from "../company/companyApi";
import { CandidateProfile } from "../profile/candidateProfileApi";

export enum Role {
  RECRUITER = "RECRUITER",
  CANDIDATE = "CANDIDATE",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  role: Role;
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
  role?: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
