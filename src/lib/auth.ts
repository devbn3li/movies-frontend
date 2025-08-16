import axios from "@/lib/axios";
import { User } from "@/types";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  country: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
  requiresVerification: boolean;
  token?: string;
  user?: User;
}

export interface VerifyEmailData {
  userId: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  requiresVerification?: boolean;
  userId?: string;
}

// Register user
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await axios.post("/auth/register", data);
  return response.data;
};

// Verify email
export const verifyEmail = async (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
  const response = await axios.post("/auth/verify-email", data);
  return response.data;
};

// Resend verification code
export const resendVerificationCode = async (userId: string): Promise<{ message: string }> => {
  const response = await axios.post("/auth/resend-verification", { userId });
  return response.data;
};

// Login user
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axios.post("/auth/login", data);
  return response.data;
};

// Utility functions for localStorage
export const storeAuthData = (token: string, user: User) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

export const storePendingVerification = (userId: string, email: string) => {
  localStorage.setItem("pendingUserId", userId);
  localStorage.setItem("pendingEmail", email);
};

export const clearPendingVerification = () => {
  localStorage.removeItem("pendingUserId");
  localStorage.removeItem("pendingEmail");
};

export const getPendingVerification = () => {
  return {
    userId: localStorage.getItem("pendingUserId"),
    email: localStorage.getItem("pendingEmail")
  };
};
