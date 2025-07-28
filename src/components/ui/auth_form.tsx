"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "./button";
import ErrorMessage from "./error_message";
import SuccessMessage from "./success_message";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";
import { useVerifyOTP } from "@/hooks/useVerifyOTP";
import { useResetPassword } from "@/hooks/useResetPassword";
import { AuthType } from "@/type/authTypes";
import AuthBg from "../../../public/images/authBg.jpg";

export default function AuthForm({ type }: { type: AuthType }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // ✅ Always call all hooks
  const loginHook = useLogin();
  const registerHook = useRegister();
  const verifyEmailHook = useVerifyEmail();
  const forgotPasswordHook = useForgotPassword();
  const verifyOTPHook = useVerifyOTP();
  const resetPasswordHook = useResetPassword();

  // ✅ Then select current hook based on `type`
  let currentHook;

  switch (type) {
    case "login":
      currentHook = loginHook;
      break;
    case "register":
      currentHook = registerHook;
      break;
    case "verify-email":
      currentHook = verifyEmailHook;
      break;
    case "forgot-password":
      currentHook = forgotPasswordHook;
      break;
    case "verify-forgot-otp":
      currentHook = verifyOTPHook;
      break;
    case "reset-password":
      currentHook = resetPasswordHook;
      break;
    default:
      currentHook = null;
      break;
  }

  // ✅ Now safely use
  const isLoading = currentHook?.loading || false;
  const error = currentHook?.error || "";
  const success = currentHook?.success || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "login" && loginHook) {
        await loginHook.handleLogin(email, password);
      } else if (type === "register" && registerHook) {
        await registerHook.handleRegister(name, email, password);
      } else if (type === "verify-email" && verifyEmailHook) {
        await verifyEmailHook.handleVerify(email, otp);
      } else if (type === "forgot-password" && forgotPasswordHook) {
        await forgotPasswordHook.handleForgotPassword(email);
      } else if (type === "verify-forgot-otp" && verifyOTPHook) {
        await verifyOTPHook.handleVerifyOTP(email, otp);
      } else if (type === "reset-password" && resetPasswordHook) {
        await resetPasswordHook.handleResetPassword(
          email,
          newPassword,
          confirmPassword
        );
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "login":
        return "WELCOME BACK";
      case "register":
        return "JOIN US";
      case "verify-email":
        return "VERIFY EMAIL";
      case "forgot-password":
        return "FORGOT PASSWORD?";
      case "verify-forgot-otp":
        return "VERIFY OTP?";
      case "reset-password":
        return "RESET PASSWORD";
      default:
        return "AUTH";
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case "login":
        return "Access your account";
      case "register":
        return "Create your account";
      case "verify-email":
        return "Please verify your email";
      case "forgot-password":
        return "Enter your email to reset password";
      case "verify-forgot-otp":
        return "Please verify the OTP sent in your email";
      case "reset-password":
        return "Please input new password";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (type) {
      case "login":
        return "LOGIN";
      case "register":
        return "CREATE ACCOUNT";
      case "verify-email":
        return "VERIFY";
      case "forgot-password":
        return "SEND RESET EMAIL";
      case "verify-forgot-otp":
        return "VERIFY OTP";
      case "reset-password":
        return "DONE";
      default:
        return "SUBMIT";
    }
  };

  return (
    <div className="flex bg-[var(--gaming-black)] rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
      {/* Left Side - Gaming Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={AuthBg}
            alt="Gaming"
            fill
            className="object-cover opacity-80 brightness-90"
          />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--gaming-black)] via-transparent to-[var(--gaming-blue)] opacity-80"></div>
        {/* Animated Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[var(--gaming-electric-blue)] opacity-30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 border border-[var(--gaming-electric-blue)] opacity-20 rotate-12 animate-bounce"></div>
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <h2 className="font-orbitron text-4xl font-bold text-[var(--gaming-white)] mb-4 drop-shadow-lg uppercase">
            {getTitle()}
          </h2>
          <p className="font-sans font-light text-[var(--gaming-white)] text-xs uppercase tracking-wider">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[var(--gaming-black)] relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--gaming-blue)] rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Form Container */}
          <div className="bg-[var(--gaming-black)] rounded-2xl p-8 relative overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Name Input - Only for register */}
              {type === "register" && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                    required
                  />
                </div>
              )}

              {/* Email Input - For all types */}
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                  required
                />
              </div>

              {/* Password Input - Only for login and register */}
              {(type === "register" || type === "login") && (
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                    required
                  />
                </div>
              )}

              {type === "reset-password" && (
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                    required
                  />
                </div>
              )}

              {type === "reset-password" && (
                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                    required
                  />
                </div>
              )}

              {/* OTP Input - Only for verify-email */}
              {(type === "verify-email" || type === "verify-forgot-otp") && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--gaming-gray)] border-2 border-[var(--gaming-gray)] rounded-lg text-[var(--gaming-white)] placeholder-gray-500 font-sans focus:outline-none focus:border-[var(--gaming-blue)]"
                    required
                  />
                </div>
              )}

              {success && <SuccessMessage message={success} />}

              {/* Error Message */}
              {error && <ErrorMessage message={error} />}

              {/* Submit Button */}
              <Button type="submit" isLoading={isLoading}>
                {getButtonText()}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 text-center">
              {/* Forgot Password Link */}
              {type === "login" && (
                <a
                  href="/forgot-password"
                  className="text-[var(--gaming-electric-blue)] hover:text-[var(--gaming-electric-blue)]/60 font-sans text-sm transition-colors duration-300"
                >
                  Forgot your password?
                </a>
              )}

              {/* Navigation Links */}
              <div className="flex items-center justify-center space-x-2 text-[var(--gaming-white)]/50 text-sm mt-4">
                <span className="font-sans">
                  {type === "login"
                    ? "Don't have an account?"
                    : type === "register"
                    ? "Already have an account?"
                    : type === "forgot-password"
                    ? "Remember your password?"
                    : ""}
                </span>
                {type !== "verify-email" && (
                  <a
                    href={
                      type === "login"
                        ? "/register"
                        : type === "register"
                        ? "/login"
                        : type === "forgot-password"
                        ? "/login"
                        : "/login"
                    }
                    className="text-[var(--gaming-electric-blue)] hover:text-[var(--gaming-electric-blue)]/80 font-orbitron font-medium uppercase tracking-wide transition-colors duration-300"
                  >
                    {type === "login"
                      ? "Sign Up"
                      : type === "register"
                      ? "Login"
                      : type === "forgot-password"
                      ? "Back to Login"
                      : "Go back"}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social Login - Not for verify-email or forgot-password */}
          {/* {(type === "login" || type === "register") && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--gaming-white)]/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--gaming-black)] text-[var(--gaming-white)] font-sans">
                    Or continue with
                  </span>
                </div>
              </div> */}

          {/* <div className="flex justify-center mt-6">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--gaming-white)]/20 text-[var(--gaming-white)] cursor-pointer space-x-4 hover:bg-[var(--gaming-white)]/30 transition-colors duration-300"
                >
                  <FaGoogle className="text-lg" />
                  <span className="font-sans text-base">
                    Sign-in with Google
                  </span>
                </button>
              </div> */}
          {/* </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
