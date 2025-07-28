export type AuthType = "login" | "register" | "verify-email" | "forgot-password" | "verify-forgot-otp" | "reset-password";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    error?: string;
    user?: { role: string };
}