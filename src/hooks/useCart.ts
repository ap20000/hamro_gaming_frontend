"use client"

import { useEffect, useState } from "react";
import { Cart } from "@/type/cart";
import { addToCart, getCartItems, removeFromCart, SelectedOption } from "@/api/cart_api";


export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const fetchCart = async () => {
    setError("");
    setSuccess('');
    setLoading(true);
    try {
      const data = await getCartItems();
      setCart(data);
    } catch (err: unknown) {
        if(err instanceof Error) {
          setError(err.message);
        } else { 
          setError("Failed to fetch cart");
        }
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId: string, selectedOption: SelectedOption, quantity: number) => {
  setError("");
  setSuccess('');
  setLoading(true);
  try {
    await addToCart(productId, selectedOption, quantity);
    await fetchCart();
    setSuccess("Item added to cart successfully!"); 
  } catch (err: unknown) {
    if(err instanceof Error) {
          setError(err.message);
        } else { 
          setError("Something went wrong");
        }
  } finally {
    setLoading(false);
  }
};

const deleteFromCart = async (productId: string, label: string) => {
  setError("");
  setSuccess('');
  setLoading(true);
  try {
    await removeFromCart(productId, label);
    await fetchCart();
    setSuccess("Item removed from cart successfully!");
  } catch (err: unknown) {
    if(err instanceof Error) {
    setError(err.message);
     } else {
      setError("Something went wrong");
     }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
   fetchCart();
  }, []);
    
  return{cart, error, success, loading, addItemToCart, fetchCart, deleteFromCart}
}