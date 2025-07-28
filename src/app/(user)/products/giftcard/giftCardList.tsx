"use client";

import FullPageLoader from "@/components/ui/full_page_loader";
import ProductCard from "@/components/ui/user/product_card";
import { useGames } from "@/hooks/useGames";
import Link from "next/link";

export default function GiftCardList() {
  const { games, loading } = useGames();
  const giftCard = games.filter((game) => game.productType === "giftcard");

  if (loading) {
    return <FullPageLoader message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-black via-gaming-gray/20 to-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl text-gaming-white mb-4 uppercase tracking-wider">
            Gift Cards
          </h1>
        </div>
        {giftCard.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5  gap-6 mb-8">
            {giftCard.map((game) => (
              <Link href={`/products/${game._id}`} key={game._id}>
                <ProductCard game={game} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="font-orbitron font-bold text-xl text-gaming-white/60 mb-2">
              No Games Found
            </h3>
            <p className="text-gaming-white/40 mb-4">
              No games available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
