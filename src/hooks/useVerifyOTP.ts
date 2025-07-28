import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useVerifyOTP = () => {
    const { handleRequest, error, loading, success, setSuccess, router } = useAuthHandler();

    const handleVerifyOTP = async (email: string, otp: string) => {
        const result = await handleRequest(async () => {
            return authRequest({
                type: "verify-forgot-otp",
                payload: { email, otp} 
            }); 
        });
        
        if (result) {
            router.push("/reset-password");
            setSuccess('OTP verified successfully!');
        }
    };

    return { handleVerifyOTP, loading, error, success };
};