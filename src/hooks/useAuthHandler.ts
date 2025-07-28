import { useRouter } from "next/navigation";
import { useState } from "react"

export const useAuthHandler = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router  = useRouter();

    const handleRequest = async<T> (callback: ()=> Promise<T>) : Promise<T | null> => {
        setLoading(true);
        setError("")
        setSuccess('');
        try {
            const result = await callback();
            return result;
        } catch (error: unknown) {
            if(error instanceof Error) {
                setError(error.message);
            } else { 
                setError("Something went wrong");
            }
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {handleRequest, loading, error, success, router, setSuccess}
}