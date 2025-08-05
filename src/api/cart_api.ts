
import { Cart } from "@/type/cart";

export interface SelectedOption {
    label: string;
    amount: string;
    price: string;
}

export async function addToCart(productId: string, selectedOption: SelectedOption, quantity: number) : Promise<Cart> {
        console.log(`🛒 Adding to cart: productId=${productId}, optionLabel=${selectedOption.label}, quantity=${quantity}`);

    try {
        const response = await fetch(`/api/product/cart`, 
            {
                method:'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({productId, selectedOption, quantity})
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add to cart');
        }

        return data;

    } catch (error) {
        throw error;
    }
}


export async function getCartItems() : Promise<Cart> {
    try {
        const response = await fetch(`/api/product/cart`, 
            {
                method:'GET',
                credentials: "include",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to add to cart');
        }

        return data.cart;

    } catch (error) {
        throw error;
    }
}

export async function removeFromCart(productId: string, label: string): Promise<Cart> {
        console.log(`🗑️ Removing from cart: productId=${productId}, optionLabel=${label}`);

    try {
        const response = await fetch(`/api/product/cart/${productId}/${label}`, {
            method: 'DELETE',
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to remove from cart');
        }

        return data;
    } catch (error) {
        throw error;
    }
}


export async function clearUserCart() {
  try {
    const res = await fetch(`/api/product/cart/clear`, {
      method: "POST",
      credentials: "include", // ⬅️ important for sending cookies/session
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to clear cart");
    }

    return data.message;
  } catch (error) {
    console.error("❌ [clearUserCart] Error:", error.message);
    throw error;
  }
}
