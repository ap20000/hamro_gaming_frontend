
import Cookies from "js-cookie";
import {
  AuthType,
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  VerifyOTPRequest,
  ResetPasswordRequest} 
  from "@/type/authTypes"

type Payload =
  LoginRequest
  | RegisterRequest
  | VerifyEmailRequest
  | ForgotPasswordRequest
  | ResetPasswordRequest
  | VerifyOTPRequest;

export async function authRequest({
  type,
  payload,
}: {
  type: AuthType;
  payload: Payload;
}) {
    const res = await fetch(`/api/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
 
}

export async function logout() {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      Cookies.remove("role", { path: "/" });
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

