import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useVerifyEmail = () => {
    const { handleRequest, error, loading, success, setSuccess, router } = useAuthHandler();

    const handleVerify = async (email: string, otp: string) => {
        const result = await handleRequest(async () => {
            return authRequest({
                type: "verify-email",
                payload: { email, otp} 
            });
            
                   
        });
         if (result) {
            router.push("/login");
            setSuccess('Email verified successfully!');
        }
    };

    return { handleVerify, loading, error, success };
};