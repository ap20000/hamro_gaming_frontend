import { claimGiftcard } from "@/api/claim_api";
import { useState } from "react";

interface DeliveredKey {
  name: string;
  type: string;
  value: string;
}

export const useClaimGiftcard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [claimedKeys, setClaimedKeys] = useState<DeliveredKey[]>([]);

  const handleClaim = async (orderId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await claimGiftcard(orderId);
      if (res.success) {
        setSuccess(res.message);
        // Ensure we're properly setting the deliveredKeys array
        setClaimedKeys(res.deliveredKeys || []);
      }
    } catch (err: unknown) {
if(err instanceof Error) {
          setError(err.message);
        } else { 
          setError("Failed to claim key");
        }    } finally {
      setLoading(false);
    }
  };

  return {
    handleClaim,
    loading,
    error,
    success,
    claimedKeys,
  };
};