import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useForgotPassword = () => {
  const { handleRequest, error, loading, success, setSuccess, router } = useAuthHandler();

  const handleForgotPassword = async (email: string) => {
    const result = await handleRequest(async () => {
         return authRequest({
        type: "forgot-password",
        payload: { email },
      })
  });

    if (result) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      setSuccess("OTP sent to your email. It will expire in 10 minutes.");

    }
  };

  return { handleForgotPassword, loading, error, success };
};
