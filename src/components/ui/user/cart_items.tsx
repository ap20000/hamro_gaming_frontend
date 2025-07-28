"use client";

import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/button";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FullPageLoader from "../full_page_loader";
import ErrorMessage from "../error_message";
import SuccessMessage from "../success_message";
import { CartItem } from "@/type/cart";

interface CartGame extends CartItem {
  quantity: number;
}

export default function CartItems() {
  const router = useRouter();
  const { cart, loading, error, success, deleteFromCart } = useCart();

  const getGroupedProducts = (): CartGame[] => {
    if (!cart?.products) return [];

    const grouped: CartGame[] = [];

    for (const product of cart.products) {
      const productId =
        typeof product.product === "string"
          ? product.product
          : product.product._id;

      const existingProduct = grouped.find(
        (item) =>
          (typeof item.product === "string"
            ? item.product
            : item.product._id) === productId &&
          item.selectedOption.label === product.selectedOption.label
      );

      if (existingProduct) {
        existingProduct.quantity += product.quantity; // Add quantities properly
      } else {
        grouped.push({ ...product, quantity: product.quantity });
      }
    }

    return grouped;
  };

  const calculateTotal = () => {
    if (!cart?.products) return 0;
    return cart.products.reduce((total, item) => {
      const price = Number(item.selectedOption.price);
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const handleRemoveAllItems = async (
    productId: string,
    label: string,
    quantity: number
  ) => {
    try {
      for (let i = 0; i < quantity; i++) {
        await deleteFromCart(productId, label);
      }
      console.log("All items removed from cart");
    } catch (error) {
      console.log("Failed to remove all items", error);
    }
  };

  const handleProceedToCheckout = () => {
    const productIds =
      cart?.products?.map((p) =>
        typeof p.product === "string" ? p.product : p.product._id
      ) || [];
    const productTypes = cart?.products?.map((p) => p.productType) || [];

    router.push(
      `/payment?amount=${calculateTotal()}&products=${productIds.join(
        ","
      )}&types=${productTypes.join(",")}`
    );
  };

  if (loading) {
    return <FullPageLoader message="Loading your cart..." />;
  }

  const groupedProducts = getGroupedProducts();

  return (
    <>
      <div className="min-h-screen bg-gaming-black p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 space-y-2">
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}
          </div>
          <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-gaming-white mb-6 md:mb-8 flex items-center">
            <ShoppingCart className="mr-3" size={40} /> Your Cart
          </h1>

          {groupedProducts.length === 0 ? (
            <div className="bg-gaming-gray/20 border border-gaming-gray/30 rounded-lg p-8 text-center">
              <p className="text-gaming-white/80 text-lg mb-4">
                Your cart is empty
              </p>
              <Link href="/products/top-up">
                <Button className="!px-6 !py-3">
                  <span className="flex items-center justify-center">
                    Browse Products <ArrowRight className="ml-2" />
                  </span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {groupedProducts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gaming-gray/20 border border-gaming-gray/30 rounded-lg p-4 flex flex-col sm:flex-row"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-sans text-gaming-white text-lg font-bold">
                            {item.selectedOption.label}
                          </h3>
                          <p className="text-gaming-white/70 text-sm">
                            {item.platform} • {item.productType}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-gaming-electric-blue text-sm font-semibold mt-1">
                              Quantity: {item.quantity}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveAllItems(
                              typeof item.product === "string"
                                ? item.product
                                : item.product._id,
                              item.selectedOption.label,
                              item.quantity
                            )
                          }
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-gaming-white/50 text-sm">
                            {item.quantity > 1
                              ? `Rs. ${item.selectedOption.price} each`
                              : "Price"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-sans text-gaming-electric-blue text-xl font-bold">
                            Rs.
                            {(
                              Number(item.selectedOption.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gaming-gray/20 border border-gaming-gray/30 rounded-lg p-6 h-fit sticky top-4">
                <h2 className="font-orbitron text-gaming-white text-xl font-bold mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {/* Item breakdown */}
                  <div className="space-y-2">
                    {groupedProducts.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between text-gaming-white/60 text-sm"
                      >
                        <span>
                          {item.name}{" "}
                          {item.quantity > 1 && `× ${item.quantity}`}
                        </span>
                        <span>
                          Rs.{" "}
                          {(
                            Number(item.selectedOption.price) * item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gaming-gray/30 pt-4">
                    <div className="flex justify-between text-gaming-white/80 mb-2">
                      <span>
                        Subtotal ({cart?.products?.length || 0} items)
                      </span>
                      <span>Rs. {calculateTotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gaming-white font-bold">
                      <span>Total</span>
                      <span className="text-gaming-electric-blue">
                        Rs. {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full !py-4"
                  onClick={handleProceedToCheckout}
                >
                  <span className="flex items-center justify-center">
                    Proceed to Checkout <ArrowRight className="ml-2" />
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
