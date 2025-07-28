import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useRegister = () => {
  const { error, handleRequest, loading, router, setSuccess, success } = useAuthHandler();

  const handleRegister = async (name:string, email: string, password: string) => {
    const result = await handleRequest(async () => {
       return authRequest({
        type: "register",
        payload: { name, email, password },
      });

    
    });
    if (result) {
      setSuccess('Registration successful! Please verify your email.');
            router.push("/verify-email");

    }
  };

  return { handleRegister, loading, error, success };
};
