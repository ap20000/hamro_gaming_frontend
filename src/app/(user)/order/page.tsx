"use client";

import React from "react";
import {
  ShoppingBag,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { usePlaceOrder } from "@/hooks/useOrder";
import FullPageLoader from "@/components/ui/full_page_loader";
import { Order } from "@/api/order_api";
import { useRouter } from "next/navigation";
import { Game } from "@/type/game";

export default function OrdersScreen() {
  const { orders, loading } = usePlaceOrder();
  const router = useRouter();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "processing":
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case "awaiting_verification":
        return <Clock className="w-5 h-5 text-orange-400" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Package className="w-5 h-5 text-gaming-white/60" />;
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gaming-black">
        <FullPageLoader message="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingBag className="w-8 h-8 text-gaming-electric-blue" />
            <h1 className="font-orbitron text-3xl font-bold text-gaming-white">
              My Orders
            </h1>
          </div>
          <p className="text-gaming-white/70">
            Track and manage all your gaming purchases
          </p>
        </div>

        {/* Error Message */}
        {/* {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )} */}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gaming-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gaming-white/60 mb-2">
              No orders yet
            </h3>
            <p className="text-gaming-white/40">
              Your gaming purchases will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div
                key={order._id}
                className="bg-gradient-to-r from-gaming-gray/40 to-gaming-gray/20 border border-gaming-electric-blue/20 rounded-xl p-6 hover:border-gaming-electric-blue/40 transition-all duration-300 cursor-pointer group"
                onClick={() => handleOrderClick(order._id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(order.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gaming-white group-hover:text-gaming-electric-blue transition-colors">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gaming-white/70">
                          <p className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Purchase •{" "}
                            {Array.isArray(order.products)
                              ? order.products.length
                              : 0}{" "}
                            item(s)
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount and View Button */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gaming-electric-blue">
                        Rs. {order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5 text-gaming-electric-blue" />
                    </div>
                  </div>
                </div>

                {/* Products Preview */}
                <div className="mt-4 pt-4 border-t border-gaming-gray/30">
                  <h4 className="text-sm font-medium text-gaming-white/80 mb-2">
                    {Array.isArray(order.products) &&
                    order.products.length > 0 &&
                    typeof order.products[0] === "object"
                      ? "Products:"
                      : "Product IDs:"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(order.products) &&
                      order.products.map((product: Game, index: number) => (
                        <span
                          key={`${order._id}-product-${index}`}
                          className="px-3 py-1 bg-gaming-electric-blue/10 border border-gaming-electric-blue/30 rounded-lg text-xs text-gaming-electric-blue"
                        >
                          {typeof product === "object" && product.name
                            ? product.name
                            : typeof product === "string"
                            ? product
                            : JSON.stringify(product)}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
