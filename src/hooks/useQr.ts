"use client"

import { getQR } from "@/api/qr_api";
import {useState } from "react"

export const useQR = () => {
    const[qrImg, setQrImg] = useState<string | null>(null);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState("");

    const fetchQrImg = async() => {
        setError("");
        setLoading(true);
         try {
              const data = await getQR();
              setQrImg(data);
            } catch (err: unknown) {
              if (err instanceof Error) {
                 setError(err.message);
              } else {
                setError("Failed to fetch QR img");
              }
             
            } finally {
              setLoading(false);
            }
    };
        
      return{qrImg, error, loading, fetchQrImg}
};