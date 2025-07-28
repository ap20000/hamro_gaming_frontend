
import { Game } from "@/type/game";

// Type definitions
export interface SelectedTopup {
  label: string;
  price: number;
}

export interface PlaceOrderPayload {
  products: string[];
  totalAmount: number;
  gameUID?: string;
  gameId?: string;
  gamePassword?: string;
  transactionCode: string;
  selectedTopup?: SelectedTopup;
}

export interface Order {
  _id: string;
 products: Game[]; 
   totalAmount: number;
  status: string;
  transactionCode: string;
  createdAt: string;
  isClaimed: boolean;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order: Order;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<OrderResponse> {
  try {
    const response = await fetch(`/api/product/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    return data as OrderResponse;

  } catch (error) {
    throw error;
  }
}

export async function getAllOrders() {
    try {
      const response  = await fetch(`/api/product/orders/my`, {
        method: "GET",
        credentials: "include"
      });
      
      const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to place order");
    }

    return data.orders;

  } catch (error) {
    throw error;
  }
  }
  
export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const response = await fetch(`/api/product/orders/my/${orderId}`, {
      method: "GET",
      credentials: "include"
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order details");
    }

    return data.order;

  } catch (error) {
    throw error;
  }
}
