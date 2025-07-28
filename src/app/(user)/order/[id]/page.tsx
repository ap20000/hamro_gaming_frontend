"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { usePlaceOrder } from "@/hooks/useOrder";
import FullPageLoader from "@/components/ui/full_page_loader";
import ErrorMessage from "@/components/ui/error_message";
import Button from "@/components/ui/button";
import { Game } from "@/type/game";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    orderDetail,
    detailLoading,
    detailError,
    getOrderDetail,
    clearOrderDetail,
  } = usePlaceOrder();

  useEffect(() => {
    if (orderId) {
      getOrderDetail(orderId);
    }

    return () => {
      clearOrderDetail();
    };
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-400" />;
      case "processing":
        return <AlertCircle className="w-6 h-6 text-blue-400" />;
      case "awaiting_verification":
        return <Clock className="w-6 h-6 text-orange-400" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Package className="w-6 h-6 text-gaming-white/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "processing":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "awaiting_verification":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gaming-white/60 bg-gaming-gray/10 border-gaming-gray/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <FullPageLoader message="Loading order details..." />
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 bg-gaming-gray/20 hover:bg-gaming-gray/30 border border-gaming-gray/40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <ErrorMessage message={detailError} />
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 bg-gaming-gray/20 hover:bg-gaming-gray/30 border border-gaming-gray/40"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gaming-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gaming-white/60 mb-2">
              Order not found
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-orbitron text-3xl font-bold text-gaming-white mb-2">
                Order #{orderDetail._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gaming-white/70 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(orderDetail.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  orderDetail.status
                )}`}
              >
                {getStatusIcon(orderDetail.status)}
                <span className="ml-2">{orderDetail.status.toUpperCase()}</span>
              </span>
              <div className="text-right">
                <p className="text-sm text-gaming-white/60">Total Amount</p>
                <p className="text-2xl font-bold text-gaming-electric-blue">
                  Rs. {orderDetail.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-gaming-gray/40 to-gaming-gray/20 border border-gaming-electric-blue/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gaming-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Products (
                {Array.isArray(orderDetail.products)
                  ? orderDetail.products.length
                  : 0}
                )
              </h2>

              <div className="space-y-4">
                {Array.isArray(orderDetail.products) &&
                  orderDetail.products.map((product: Game, index: number) => (
                    <div
                      key={`${orderDetail._id}-product-${index}`}
                      className="flex items-center gap-4 p-4 bg-gaming-black/30 rounded-lg border border-gaming-gray/20"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gaming-white">
                          {typeof product === "object" && product.name
                            ? product.name
                            : typeof product === "string"
                            ? `Product ID: ${product}`
                            : "Unknown Product"}
                        </h3>
                        {typeof product === "object" && (
                          <>
                            {product.productType && (
                              <p className="text-sm text-gaming-white/60 capitalize">
                                {product.productType.replace("_", " ")}
                              </p>
                            )}
                            {product.price && (
                              <p className="text-lg font-semibold text-gaming-electric-blue">
                                Rs. {product.price.toFixed(2)}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
