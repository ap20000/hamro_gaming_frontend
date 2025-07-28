"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { placeOrder, getAllOrders, getOrderById } from "@/api/order_api";
import {getAllOrdersList, verifyOrderById} from "@/api/admin_order_api"
import {
  PlaceOrderPayload,
  Order,
} from "@/api/order_api";

export const usePlaceOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detailError, setDetailError] = useState("");
  const router = useRouter();

  const createOrder = async (payload: PlaceOrderPayload) => {
    setError("");
    setLoading(true);
    try {
      const response = await placeOrder(payload);
      setOrder(response.order);
      await getOrders(); // Refresh orders list
      
      router.push("/order");
      setSuccess("Order placed successfully!"); 

      return response;

    } catch (err: unknown) {
      if(err instanceof Error) {
        setError(err.message);
      } else { 
        setError("Failed to place order");
      }      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getAllOrders();
      setOrders(response || []);
    } catch (err: unknown) {
      if(err instanceof Error) {
        setError(err.message);
      } else { 
        setError("Failed to get orders");
      }      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderDetail = async (orderId: string) => {
    setDetailError("");
    setDetailLoading(true);
    try {
      const response = await getOrderById(orderId);
      setOrderDetail(response);
      return response;
    } catch (err: unknown) {
      if(err instanceof Error) {
        setDetailError(err.message);
      } else { 
        setDetailError("Failed to fetch order details");
      }      
      throw err;
    } finally {
      setDetailLoading(false);
    }
  };

  const clearOrderDetail = () => {
    setOrderDetail(null);
    setDetailError("");
  };

  // Only load user orders on mount, not admin functions
  useEffect(() => {
    getOrders();
  }, []);

  return {
    order,
    orders,
    orderDetail,
    loading,
    detailLoading,
    error,
    success,
    detailError,
    createOrder,
    getOrders,
    getOrderDetail,
    clearOrderDetail
  };
};

// Separate hook for admin functions
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getOrderList = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getAllOrdersList();
      setOrders(response || []);
    } catch (err: unknown) {
      if(err instanceof Error) {
        setError(err.message);
      } else { 
        setError("Failed to fetch order list");
      }      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOrder = async (orderId: string) => {
    setError("");
    setLoading(true);
    try {
      const response = await verifyOrderById(orderId);
      setOrders(Array.isArray(response) ? response : [...orders]); 
      await getOrderList(); // Refresh the list
      setSuccess("Order verified successfully!"); 

    } catch (err: unknown) {
      if (err instanceof Error) {
        let errorMessage = err.message;
        
        // Special handling for out of stock items
        if (err.message.includes("out of stock")) {
          errorMessage = err.message;
          // You could optionally trigger a restock notification here
        }
        
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return {
    orders,
    loading,
    error,
    success,
    getOrderList,
    verifyOrder
  };
};