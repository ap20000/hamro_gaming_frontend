"use client";
import FullPageLoader from "@/components/ui/full_page_loader";
import { useGames } from "@/hooks/useGames";
import { useParams } from "next/navigation";
import ProductImage from "@/components/ui/user/product_image";
import Button from "@/components/ui/button";
import { Gamepad2, Tag, TimerIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import SuccessMessage from "@/components/ui/success_message";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { game, loading } = useGames(id as string);
  const { addItemToCart, loading: cartLoading, success } = useCart();
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    amount: string;
    price: string;
    id?: string;
  } | null>(null);
  const options =
    game?.productType === "topup"
      ? game.topupOptions
      : game?.productType === "giftcard"
      ? game.giftcardAmountOptions
      : [];

  const isAccountProduct = game?.productType === "account";
  const isPrivateAccount = isAccountProduct && game.accountType === "private";
  const isSharedAccount = isAccountProduct && game.accountType === "shared";

  const handleAddToCart = async () => {
    if (!selectedOption || !game) return;

    console.log("🛒 Attempting to add to cart:", {
      productId: game._id,
      selectedOption,
      quantity: 1,
    });

    try {
      await addItemToCart(game._id, selectedOption, 1);

      router.push("/cart");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("failed to add to cart", error);
      }
    }
  };

  if (loading) {
    return <FullPageLoader message="Loading details ..." />;
  }

  return (
    <div className="min-h-screen bg-gaming-black relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-gaming-blue/40 via-gaming-black/60 to-gaming-black/80 absolute z-10"></div>
        {game && (
          <div className="w-full h-full relative overflow-hidden">
            <ProductImage game={game} />
            <div className="absolute inset-0 bg-gaming-black/70 backdrop-blur-xs"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-20 px-5 py-6 lg:px-14 lg:py-12">
        {success && <SuccessMessage message={success} />}

        {/* Product Image Card */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-80 h-64 lg:w-96 lg:h-80 ">
              {game && (
                <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gaming-electric-blue/50">
                  <ProductImage game={game} />
                </div>
              )}
            </div>

            {/* Platform Info Cards */}
            <div className="hidden absolute -right-4 -top-4 lg:-right-16 lg:-top-8 lg:flex flex-col space-y-2">
              <div className="bg-gaming-gray/80 backdrop-blur-md border border-gaming-white/20 p-2 lg:p-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-1">
                  <Gamepad2 size={14} className="text-gaming-white" />
                  <p className="font-sans font-light text-xs text-gaming-white">
                    Platform
                  </p>
                </div>
                <p className="font-orbitron font-bold text-sm lg:text-base text-gaming-electric-blue text-center">
                  {game?.platform}
                </p>
              </div>

              <div className="bg-gaming-gray/80 backdrop-blur-md border border-gaming-white/20 p-2 lg:p-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-1">
                  <Tag size={14} className="text-gaming-white" />
                  <p className="font-sans font-light text-xs text-gaming-white">
                    Game Type
                  </p>
                </div>
                <p className="font-orbitron font-bold text-sm lg:text-base text-gaming-electric-blue text-center">
                  {game?.gameType}
                </p>
              </div>

              <div className="bg-gaming-gray/80 backdrop-blur-md border border-gaming-white/20 p-2 lg:p-3 rounded-xl shadow-lg">
                <div className="flex items-center space-x-1">
                  <TimerIcon size={14} className="text-gaming-white" />
                  <p className="font-sans font-light text-xs text-gaming-white">
                    Delivery time
                  </p>
                </div>
                <p className="font-orbitron font-bold text-sm lg:text-base text-gaming-electric-blue text-center">
                  {game?.deliveryTime}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-5 lg:flex justify-evenly items-start">
          <div className="lg:w-2/3 px-4 space-y-6">
            {/* Product Name */}
            <div className="">
              <div className="flex space-x-2">
                <h1 className="font-sans font-bold text-2xl lg:text-4xl text-gaming-white">
                  {game?.name}
                </h1>
                <h4 className="font-sans font-light text-sm lg:text-lg text-gaming-white">
                  ({game?.region})
                </h4>
              </div>
            </div>

            {/* Options */}
            {options && options.length > 0 && (
              <div>
                <h3 className="font-sans font-bold text-lg text-gaming-white mb-4">
                  Choose Option
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[24rem] overflow-y-auto">
                  {options.map((opt) => {
                    const isSelected =
                      selectedOption?.label === opt.label &&
                      selectedOption?.amount === opt.amount &&
                      selectedOption?.price === opt.price;
                    return (
                      <div
                        key={`${opt.label}-${opt.amount}-${opt.price}`}
                        onClick={() => setSelectedOption(opt)}
                        className={`flex justify-between p-4 bg-gaming-gray/40 backdrop-blur-sm rounded-lg items-center border cursor-pointer transition-all hover:bg-gaming-gray/60 ${
                          isSelected
                            ? "border-gaming-electric-blue shadow-lg shadow-gaming-electric-blue/20"
                            : "border-gaming-white/20"
                        }`}
                      >
                        <div className="flex space-x-1">
                          <p className="font-sans font-medium text-sm text-gaming-white">
                            {opt.amount}
                          </p>
                          <p className="font-sans font-medium text-sm text-gaming-white">
                            {opt.label}
                          </p>
                        </div>
                        <p className="font-sans font-medium text-sm text-gaming-electric-blue">
                          Rs. {opt.price}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Private Account Options */}
            {isPrivateAccount && game.accounts && game.accounts.length > 0 && (
              <div className="bg-gaming-gray/20 backdrop-blur-md border border-gaming-white/10 p-6 rounded-2xl shadow-lg">
                <h3 className="font-sans font-bold text-lg text-gaming-white mb-4">
                  Available Accounts
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[24rem] overflow-y-auto">
                  {game.accounts.map((acc) => {
                    const isSelected = selectedOption?.id === acc._id;

                    return (
                      <div
                        key={acc._id}
                        onClick={() =>
                          setSelectedOption({
                            label: acc.label,
                            amount: "1 pc",
                            price: acc.price ?? "0",
                            id: acc._id,
                          })
                        }
                        className={`flex justify-between p-4 bg-gaming-gray/40 backdrop-blur-sm rounded-lg items-center border cursor-pointer transition-all hover:bg-gaming-gray/60 ${
                          isSelected
                            ? "border-gaming-electric-blue shadow-lg shadow-gaming-electric-blue/20"
                            : "border-gaming-white/20"
                        }`}
                      >
                        <div className="flex flex-col space-y-1">
                          <p className="font-sans font-medium text-sm text-gaming-white">
                            {acc.label}
                          </p>
                          <p className="font-sans text-xs text-gaming-white/70">
                            Account ID: {acc._id?.slice(0, 6)}...
                          </p>
                          {acc.used && (
                            <p className="text-red-400 font-semibold text-xs">
                              Used
                            </p>
                          )}
                        </div>
                        <p className="font-sans font-medium text-sm text-gaming-electric-blue">
                          Rs. {acc.price}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shared Account */}
            {isSharedAccount && game.sharedAccount && (
              <div className="bg-gaming-gray/20 backdrop-blur-md border border-gaming-white/10 p-6 rounded-2xl shadow-lg">
                <h3 className="font-sans font-bold text-lg text-gaming-white mb-4">
                  Shared Account
                </h3>
                <div
                  className={`flex justify-between p-4 bg-gaming-gray/40 backdrop-blur-sm rounded-lg items-center border cursor-pointer transition-all hover:bg-gaming-gray/60 ${
                    selectedOption?.label === game.sharedAccount.label
                      ? "border-gaming-electric-blue shadow-lg shadow-gaming-electric-blue/20"
                      : "border-gaming-white/20"
                  }`}
                  onClick={() =>
                    setSelectedOption({
                      label: game.sharedAccount?.label ?? "Shared Account",
                      amount: `${game.sharedAccount?.quantity} pcs`,
                      price: game.sharedAccount?.price ?? "0",
                    })
                  }
                >
                  <div className="flex flex-col space-y-1">
                    <p className="font-sans font-medium text-sm text-gaming-white">
                      {game.sharedAccount.label}
                    </p>
                    <p className="font-sans text-xs text-gaming-white/70">
                      Available:
                      {game.sharedAccount.quantity -
                        (game.sharedAccount?.soldCount ?? 0)}
                      pcs
                    </p>
                  </div>
                  <p className="font-sans font-medium text-sm text-gaming-electric-blue">
                    Rs. {game.sharedAccount.price}
                  </p>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="bg-gaming-gray/20 backdrop-blur-md border border-gaming-white/10 p-6 rounded-2xl shadow-lg">
              <p className="font-sans font-bold text-base lg:text-xl text-gaming-white mb-3">
                Details
              </p>
              <p className="font-sans font-normal text-sm lg:text-base text-gaming-white/80 leading-relaxed">
                {game?.description}
              </p>
            </div>
          </div>

          {/* Add to cart section */}
          <div className="lg:w-1/3 bg-gaming-gray/20 backdrop-blur-md border border-gaming-white/10 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold font-sans text-lg lg:text-xl text-gaming-white">
                Total
              </p>
              <h2 className="font-sans font-bold text-lg lg:text-xl text-gaming-electric-blue">
                Rs. {selectedOption?.price ?? 0}
              </h2>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedOption || cartLoading}
              isLoading={cartLoading}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
