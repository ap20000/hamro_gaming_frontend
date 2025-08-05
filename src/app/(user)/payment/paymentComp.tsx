"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, Gamepad2, Shield } from "lucide-react";
import Button from "@/components/ui/button";
import { useQR } from "@/hooks/useQr";
import { usePlaceOrder } from "@/hooks/useOrder";
import { API_BASE_URL } from "@/config/config";
import FullPageLoader from "@/components/ui/full_page_loader";
import ErrorMessage from "@/components/ui/error_message";
import SuccessMessage from "@/components/ui/success_message";

interface OrderData {
  products: string[];
  totalAmount: number;
  transactionCode: string;
  gameUID?: string;
  gameId?: string;
  gamePassword?: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const amount = Number(searchParams.get("amount")) || 0;
  const products = searchParams.get("products")?.split(",") || [];
  const productTypes = searchParams.get("types")?.split(",") || [];

  const {
    qrImg: qrImageUrl,
    error: qrError,
    loading,
    fetchQrImg: fetchQRCode,
  } = useQR();

  const {
    createOrder,
    loading: isSubmitting,
    error: orderError,
    success,
  } = usePlaceOrder();

  const [transactionId, setTransactionId] = useState("");
  const [gameUID, setGameUID] = useState("");
  const [gameId, setGameId] = useState("");
  const [gamePassword, setGamePassword] = useState("");

  useEffect(() => {
    if (amount > 0) {
      fetchQRCode();
    }
  }, [amount]);

  const isGiftcardOrCDKey = productTypes.some((type) =>
    ["giftcard", "cdkey"].includes(type)
  );
  const isTopup = productTypes.includes("topup");
  const isAccount = productTypes.includes("account");

  const handleSubmitTransaction = async () => {
    try {
      const orderData: OrderData = {
        products,
        totalAmount: amount || 0,
        transactionCode: transactionId,
      };

      // Add optional fields for topup if they have values
      if (isTopup) {
        if (gameUID.trim()) orderData.gameUID = gameUID;
        if (gameId.trim()) orderData.gameId = gameId;
        if (gamePassword.trim()) orderData.gamePassword = gamePassword;
      }

      // Add required fields for account
      if (isAccount) {
        orderData.gameId = gameId;
        orderData.gamePassword = gamePassword;
      }

      await createOrder(orderData);
     

      console.log("✅ Order placed successfully!");
    } catch (error) {
      console.error("❌ Failed to place order:", error);
    }
  };

  const getImageUrl = (imageData: string) => {
    if (imageData.startsWith("data:image")) {
      return imageData;
    }

    if (!imageData.startsWith("http")) {
      return `data:image/png;base64,${imageData}`;
    }

    let fullImageUrl = imageData;
    if (!imageData.startsWith("http")) {
      const baseUrl = API_BASE_URL.replace("/api", "");
      const imagePath = imageData.startsWith("/") ? imageData : `/${imageData}`;
      fullImageUrl = `${baseUrl}${imagePath}`;
    }

    fullImageUrl = fullImageUrl.replace(/\\/g, "/");
    const urlParts = fullImageUrl.split("/");
    const encodedParts = urlParts.map((part, index) => {
      if (index < 3 && part.includes(":")) return part;
      return encodeURIComponent(part);
    });

    return encodedParts.join("/");
  };

  const getProductTypeDisplay = () => {
    if (isAccount) return "Account Purchase";
    if (isTopup) return "Game Top-up";
    if (isGiftcardOrCDKey) return "Digital Product";
    return "Purchase";
  };

  if (!amount || products.length === 0) {
    return (
      <div className="min-h-screen bg-gaming-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-orbitron text-gaming-white mb-4">
            Invalid Payment Request
          </h1>
          <p className="text-gaming-white/70 mb-6">
            No payment information found. Please go back and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-gaming-electric-blue/10 to-gaming-electric-blue/5 p-6 rounded-xl border border-gaming-electric-blue/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-orbitron text-gaming-white text-lg md:text-2xl font-bold">
                  Complete Payment
                </h1>
                <p className="text-gaming-electric-blue text-lg font-medium mt-1">
                  {getProductTypeDisplay()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gaming-white/80 text-sm">Total Amount</p>
                <p className="text-gaming-electric-blue font-bold text-lg md:text-2xl">
                  Rs. {amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-gaming-gray/20 border border-gaming-gray/30 rounded-xl p-6">
            <h2 className="font-orbitron text-gaming-white text-lg md:text-xl font-bold mb-6">
              Scan QR Code to Pay
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <FullPageLoader message="Generating secure QR code..." />
              </div>
            ) : qrError ? (
              <div className="py-8 text-center">
                <ErrorMessage message={qrError} />
                <Button onClick={fetchQRCode} className="mt-4">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retry QR Generation
                </Button>
              </div>
            ) : qrImageUrl ? (
              <div className="space-y-6">
                {/* QR Code */}
                <div className="bg-gaming-white p-8 rounded-xl flex justify-center shadow-inner">
                  <img
                    src={getImageUrl(qrImageUrl)}
                    alt="Payment QR Code"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: "320px" }}
                  />
                </div>

                {/* Instructions */}
                <div className="bg-gaming-gray/30 p-4 rounded-lg border border-gaming-gray/50">
                  <h3 className="text-gaming-electric-blue font-semibold mb-3">
                    Payment Instructions
                  </h3>
                  <div className="text-gaming-white/80 text-sm space-y-2">
                    <p>• Open your mobile banking or digital wallet app</p>
                    <p>• Scan the QR code above to initiate payment</p>
                    <p>• Complete the payment for Rs. {amount.toFixed(2)}</p>
                    <p>• Copy the transaction ID and enter it in the form</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Form Section */}
          <div className="bg-gaming-gray/20 border border-gaming-gray/30 rounded-xl p-6">
            <h2 className="font-orbitron text-gaming-white text-lg md:text-xl font-bold mb-6">
              Payment Details
            </h2>

            <div className="space-y-6">
              {/* Topup Fields - Optional */}
              {isTopup && (
                <div className="bg-gaming-gray/20 p-4 rounded-lg border border-gaming-electric-blue/20">
                  <h3 className="text-gaming-electric-blue font-semibold mb-4 flex items-center">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Game Details (Optional)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="gameUID"
                        className="block text-sm text-gaming-white/90 mb-2 font-medium"
                      >
                        Game UID
                      </label>
                      <input
                        id="gameUID"
                        type="text"
                        value={gameUID}
                        onChange={(e) => setGameUID(e.target.value)}
                        placeholder="Enter your game UID (optional)"
                        className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gameId"
                        className="block text-sm text-gaming-white/90 mb-2 font-medium"
                      >
                        Game ID / Email
                      </label>
                      <input
                        id="gameId"
                        type="text"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        placeholder="Enter game ID or email (optional)"
                        className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="gamePassword"
                        className="block text-sm text-gaming-white/90 mb-2 font-medium"
                      >
                        Game Password
                      </label>
                      <input
                        id="gamePassword"
                        type="password"
                        value={gamePassword}
                        onChange={(e) => setGamePassword(e.target.value)}
                        placeholder="Enter game password (optional)"
                        className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Account Fields - Required */}
              {isAccount && (
                <div className="bg-gaming-gray/20 p-4 rounded-lg border border-red-500/20">
                  <h3 className="text-red-400 font-semibold mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Account Details (Required)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="accountGameId"
                        className="block text-sm text-gaming-white/90 mb-2 font-medium"
                      >
                        Game ID
                      </label>
                      <input
                        id="accountGameId"
                        type="text"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        placeholder="GameID of PUBG, FreeFire ..."
                        className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="accountGamePassword"
                        className="block text-sm text-gaming-white/90 mb-2 font-medium"
                      >
                        Game Password
                      </label>
                      <input
                        id="accountGamePassword"
                        type="password"
                        value={gamePassword}
                        onChange={(e) => setGamePassword(e.target.value)}
                        placeholder="Enter game password"
                        className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction ID - Always Required */}
              <div>
                <label
                  htmlFor="transactionId"
                  className="block text-gaming-white/90 text-sm font-medium mb-2"
                >
                  Transaction ID *
                </label>
                <input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID after payment"
                  className="w-full px-4 py-3 bg-gaming-gray/40 border border-gaming-gray/50 rounded-lg text-gaming-white placeholder-gaming-white/40 focus:outline-none focus:border-gaming-electric-blue focus:ring-2 focus:ring-gaming-electric-blue/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Error and Success Messages */}
              {orderError && (
                <div>
                  <ErrorMessage message={orderError} />
                </div>
              )}

              {success && (
                <div>
                  <SuccessMessage message={success} />
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitTransaction}
                disabled={
                  isSubmitting ||
                  !transactionId.trim() ||
                  (isAccount && (!gameId.trim() || !gamePassword.trim()))
                }
                className="w-full !py-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gaming-white border-t-transparent mr-3"></div>
                    Processing Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Verify Payment
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
