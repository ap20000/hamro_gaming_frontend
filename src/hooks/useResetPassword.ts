import { authRequest } from "@/api/auth_api";
import { useAuthHandler } from "./useAuthHandler";

export const useResetPassword = () => {
    const {handleRequest, error, loading, success, setSuccess, router} 
    = useAuthHandler();

    const handleResetPassword = async(email: string, newPassword: string, confirmPassword: string) =>{
       const result =  await handleRequest(async () => {
           return authRequest({
                type: "reset-password",
                payload: {email, newPassword, confirmPassword}});
        });
        
        if (result) {
            router.push(`/login?email=${encodeURIComponent(email)}`);
            setSuccess('Password reset successful');
        }
    }

 return {handleResetPassword, loading, error, success};
}
