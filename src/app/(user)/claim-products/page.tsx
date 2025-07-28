"use client";

import { useState, useEffect } from "react";
import { usePlaceOrder } from "@/hooks/useOrder";
import FullPageLoader from "@/components/ui/full_page_loader";
import ErrorMessage from "@/components/ui/error_message";
import Button from "@/components/ui/button";
import {
  X,
  Calendar,
  Package,
  CreditCard,
  User,
  Copy,
  Check,
} from "lucide-react";
import { useClaimGiftcard } from "@/hooks/useClaim";
import SuccessMessage from "@/components/ui/success_message";
import AccountChatModal from "@/components/ui/chat_modal";
import { Game } from "@/type/game";
import ProductImage from "@/components/ui/user/product_image";

interface DeliveredKey {
  name: string;
  type: string;
  value:
    | string
    | {
        email: string;
        password: string;
        code?: string;
        loginInstructions?: string;
      };
}

type ProductTypeFilter = "giftcard" | "account";

export default function ClaimGiftcardOrdersScreen() {
  const { orders, loading, error } = usePlaceOrder();
  const {
    handleClaim,
    loading: claiming,
    error: claimError,
    success,
    claimedKeys,
  } = useClaimGiftcard();
  const [checkedOrders, setCheckedOrders] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [productTypeFilter, setProductTypeFilter] =
    useState<ProductTypeFilter>("giftcard");
  const [showModal, setShowModal] = useState(false);
  const [copiedFields, setCopiedFields] = useState<Set<string>>(new Set());

  // Track which orders have been successfully claimed at least once
  const [claimedOrders, setClaimedOrders] = useState<Set<string>>(new Set());

  // Account chat specific state
  const [isAccountChatOpen, setIsAccountChatOpen] = useState(false);
  const [currentAccountKeys, setCurrentAccountKeys] = useState<DeliveredKey[]>(
    []
  );
  const [showKeysInChat, setShowKeysInChat] = useState(false);

  // Add this state for tracking which action is being performed
  const [claimAction, setClaimAction] = useState<"credentials" | "chat" | null>(
    null
  );

  // Add these new handler functions
  const handleViewCredentials = async (orderId: string) => {
    setActiveOrderId(orderId);
    setClaimAction("credentials");
    await handleClaim(orderId);
  };

  const handleOpenChat = (orderId: string) => {
    setActiveOrderId(orderId);
    setClaimAction("chat");
    setCurrentAccountKeys([]); // No keys to show
    setShowKeysInChat(false); // Don't show keys section
    setIsAccountChatOpen(true); // Open chat only
  };

  // Update the existing handleClaimClick to remove account-specific logic
  const handleClaimClick = async (orderId: string) => {
    setActiveOrderId(orderId);
    setClaimAction("credentials");
    await handleClaim(orderId);
  };

  // Show modal when keys are successfully claimed
  useEffect(() => {
    if (claimedKeys.length > 0 && activeOrderId && !claiming) {
      // Mark this order as successfully claimed
      setClaimedOrders((prev) => new Set([...prev, activeOrderId]));

      if (productTypeFilter === "giftcard") {
        setShowModal(true);
      } else if (
        productTypeFilter === "account" &&
        claimAction === "credentials"
      ) {
        // For account credentials, show the same modal as gift cards
        setShowModal(true);
      }
    }
  }, [claimedKeys, activeOrderId, claiming, productTypeFilter, claimAction]);

  const filteredOrders = orders.filter((order) => {
    if (order.status !== "completed" || !Array.isArray(order.products)) {
      return false;
    }
    return order.products.some(
      (product: Game) => product?.productType === productTypeFilter
    );
  });

  const handleCheckboxChange = (orderId: string) => {
    setCheckedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseAccountChat = () => {
    setIsAccountChatOpen(false);
    setCurrentAccountKeys([]);
    setShowKeysInChat(false);
  };

  const copyToClipboard = async (text: string, fieldKey: string) => {
    try {
      await navigator?.clipboard?.writeText(text);
      setCopiedFields((prev) => new Set([...prev, fieldKey]));
      setTimeout(() => {
        setCopiedFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldKey);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderKeyValue = (key: DeliveredKey) => {
    if (typeof key.value === "string") {
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs sm:text-sm bg-gaming-electric-blue/20 px-2 sm:px-3 py-2 rounded border border-gaming-electric-blue/30 text-gaming-electric-blue flex-1 break-all">
            {key.value}
          </div>
          <button
            onClick={() =>
              copyToClipboard(key.value as string, `${key.name}-code`)
            }
            className="p-2 hover:bg-gaming-gray/30 rounded-lg transition-colors flex-shrink-0"
          >
            {copiedFields.has(`${key.name}-code`) ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gaming-white/60" />
            )}
          </button>
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-gaming-white/80 w-full sm:w-20 text-sm">
              Email:
            </span>
            <div className="font-mono text-xs sm:text-sm bg-gaming-electric-blue/20 px-2 sm:px-3 py-2 rounded border border-gaming-electric-blue/30 text-gaming-electric-blue flex-1 break-all">
              {key.value.email}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-gaming-white/80 w-full sm:w-20 text-sm">
              Password:
            </span>
            <div className="font-mono text-xs sm:text-sm bg-gaming-electric-blue/20 px-2 sm:px-3 py-2 rounded border border-gaming-electric-blue/30 text-gaming-electric-blue flex-1 break-all">
              {key.value.password}
            </div>
          </div>
          {key.value.code && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-gaming-white/80 w-full sm:w-20 text-sm">
                Code:
              </span>
              <div className="font-mono text-xs sm:text-sm bg-gaming-electric-blue/20 px-2 sm:px-3 py-2 rounded border border-gaming-electric-blue/30 text-gaming-electric-blue flex-1 break-all">
                {key.value.code}
              </div>
            </div>
          )}
          {key.value.loginInstructions && (
            <div className="mt-3 p-3 bg-gaming-gray/20 rounded-lg border border-gaming-gray/40">
              <span className="text-gaming-white/80 text-sm font-medium">
                Instructions:
              </span>
              <p className="text-gaming-white text-sm mt-1 leading-relaxed">
                {key.value.loginInstructions}
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <FullPageLoader message="Loading orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black px-4 py-6 sm:py-8 max-w-6xl mx-auto relative">
      {/* Header - Made responsive with stacked layout on mobile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gaming-white mb-2">
            Claim Your{" "}
            {productTypeFilter === "giftcard" ? "Gift Cards" : "Accounts"}
          </h1>
          <p className="text-gaming-white/60 text-sm sm:text-base">
            Manage and claim your completed {productTypeFilter} orders
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <label className="text-gaming-white/80 font-medium text-sm sm:text-base">
            Filter:
          </label>
          <select
            value={productTypeFilter}
            onChange={(e) =>
              setProductTypeFilter(e.target.value as ProductTypeFilter)
            }
            className="bg-gaming-gray border border-gaming-gray/40 text-gaming-white rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:border-gaming-electric-blue transition-colors text-sm sm:text-base"
          >
            <option value="giftcard">Gift Cards</option>
            <option value="account">Accounts</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {claimError && <ErrorMessage message={claimError} />}
      {success && <SuccessMessage message={success} />}

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gaming-white/30 mx-auto mb-4" />
          <p className="text-lg sm:text-xl text-gaming-white/60 mb-2">
            No completed {productTypeFilter} orders found
          </p>
          <p className="text-gaming-white/40 text-sm sm:text-base">
            Your claimed {productTypeFilter}s will appear here once orders are
            completed
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gradient-to-br from-gaming-gray/20 to-gaming-gray/10 border border-gaming-gray/40 rounded-xl p-4 sm:p-6 hover:border-gaming-electric-blue/30 transition-all duration-300"
            >
              {/* Order Header - Stack on mobile */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  {/* Order Info with Image */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-20 h-16 sm:w-28 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <ProductImage
                        game={order.products[0]}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gaming-white truncate">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gaming-white/60">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Grid - Stack on mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gaming-gray/20 rounded-lg p-3 sm:p-4">
                      <h4 className="text-sm font-medium text-gaming-electric-blue mb-2">
                        Products
                      </h4>
                      <div className="space-y-1">
                        {Array.isArray(order.products) &&
                          order.products.map((product: Game, idx: number) => (
                            <div
                              key={idx}
                              className="text-xs sm:text-sm text-gaming-white"
                            >
                              • {product?.name || product?._id}
                              {product?.quantity && (
                                <span className="text-gaming-white/60">
                                  (x{product.quantity})
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="bg-gaming-gray/20 rounded-lg p-3 sm:p-4">
                      <h4 className="text-sm font-medium text-gaming-electric-blue mb-2">
                        Order Details
                      </h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        {order.totalAmount && (
                          <div className="flex justify-between">
                            <span className="text-gaming-white/60">Total:</span>
                            <span className="text-gaming-white">
                              Rs. {order.totalAmount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="mb-4 lg:mb-0">
                    <p className="font-sans text-xs sm:text-sm text-gaming-white">
                      ℹ️ NOTE: You can view these credentials multiple times
                      whenever needed.
                    </p>
                  </div>
                </div>

                {/* Action Section - Stack on mobile */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-4 lg:ml-4 lg:w-80">
                  {/* Checkbox */}
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-gaming-electric-blue rounded mt-0.5 flex-shrink-0"
                      checked={!!checkedOrders[order._id]}
                      onChange={() => handleCheckboxChange(order._id)}
                    />
                    <span className="text-xs sm:text-sm text-gaming-white/80 leading-relaxed">
                      Make sure that the product is correct
                    </span>
                  </label>

                  {/* Buttons */}
                  {productTypeFilter === "account" ? (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {/* View Credentials Button */}
                      <Button
                        onClick={() => handleViewCredentials(order._id)}
                        isLoading={
                          claiming &&
                          activeOrderId === order._id &&
                          claimAction === "credentials"
                        }
                        disabled={!checkedOrders[order._id]}
                        className="flex-1 sm:min-w-[110px] px-3 py-2 text-xs sm:text-sm"
                      >
                        {claimedOrders.has(order._id)
                          ? "View Credentials"
                          : "Get Credentials"}
                      </Button>

                      {/* Chat Button */}
                      <Button
                        onClick={() => handleOpenChat(order._id)}
                        disabled={!checkedOrders[order._id]}
                        className="flex-1 sm:min-w-[100px] px-3 py-2 text-xs sm:text-sm bg-gaming-electric-blue/20 border border-gaming-electric-blue hover:bg-gaming-electric-blue/30"
                      >
                        Support Chat
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleClaimClick(order._id)}
                      isLoading={claiming && activeOrderId === order._id}
                      disabled={!checkedOrders[order._id]}
                      className="w-full sm:w-auto sm:min-w-[100px] px-3 py-2 text-xs sm:text-sm"
                    >
                      {claimedOrders.has(order._id)
                        ? "View Keys"
                        : "Claim Keys"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Credentials Modal - Made responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gaming-black border border-gaming-gray/40 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gaming-gray/20 border-b border-gaming-gray/40 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gaming-electric-blue/20 rounded-full flex items-center justify-center">
                    {productTypeFilter === "giftcard" ? (
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gaming-electric-blue" />
                    ) : (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-gaming-electric-blue" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gaming-white">
                      Your
                      {productTypeFilter === "giftcard"
                        ? " Gift Card Keys"
                        : " Account Credentials"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gaming-white/60">
                      You can access these{" "}
                      {productTypeFilter === "giftcard"
                        ? "keys"
                        : "credentials"}{" "}
                      anytime from your orders
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gaming-gray/30 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gaming-white/60" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {claimedKeys.length > 0 ? (
                <div className="space-y-4">
                  {claimedKeys.map((key: DeliveredKey, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gaming-gray/30 border border-gaming-electric-blue/20 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gaming-white text-sm sm:text-base">
                          {key.name}
                        </h5>
                        <span className="text-xs text-gaming-white/60 bg-gaming-gray/50 px-2 py-1 rounded">
                          {key.type}
                        </span>
                      </div>
                      {renderKeyValue(key)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gaming-white/60 mb-2">
                    No{" "}
                    {productTypeFilter === "giftcard" ? "keys" : "credentials"}{" "}
                    available
                  </div>
                  <div className="text-sm text-gaming-white/40">
                    {productTypeFilter === "giftcard" ? "Keys" : "Credentials"}{" "}
                    will appear here after claiming
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gaming-gray/40 p-4 sm:p-6 bg-gaming-gray/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs sm:text-sm text-gaming-white/80">
                  <span className="text-gaming-electric-blue font-medium">
                    ℹ️ Info:
                  </span>{" "}
                  You can view these{" "}
                  {productTypeFilter === "giftcard" ? "keys" : "credentials"}{" "}
                  anytime by clicking the button again.
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    onClick={handleCloseModal}
                    className="bg-gaming-electric-blue hover:bg-gaming-electric-blue/80 text-sm"
                  >
                    Close
                  </Button>
                  {productTypeFilter === "account" && (
                    <Button
                      onClick={() => {
                        handleCloseModal();
                        setTimeout(
                          () => handleOpenChat(activeOrderId || ""),
                          100
                        );
                      }}
                      className="bg-gaming-gray/50 hover:bg-gaming-gray/70 text-gaming-white text-sm"
                    >
                      Open Support Chat
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Chat Modal */}
      <AccountChatModal
        isOpen={isAccountChatOpen}
        onClose={handleCloseAccountChat}
        orderId={activeOrderId || ""}
        userId="user123" // Replace with actual user ID
        accountKeys={currentAccountKeys}
        showKeys={showKeysInChat}
        onKeysCopied={() => setShowKeysInChat(false)}
        renderKeyValue={renderKeyValue}
      />
    </div>
  );
}
