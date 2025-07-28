import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useLogin = () => {
  const { error, handleRequest, loading, router, setSuccess, success } = useAuthHandler();

  const handleLogin = async (email: string, password: string) => {
   const result =  await handleRequest(async () => {
      return authRequest({
        type: "login",
        payload: { email, password },
      });

   
    });
     if (result) {
      const role = result.user?.role;
      router.push(role === "admin" ? "/admin/admin-dashboard" : "/home");
      setSuccess("Login Successful!");

    }
  };

  return { handleLogin, loading, error, success };
};
