"use client";

import { useGames } from "@/hooks/useGames";
import FullPageLoader from "@/components/ui/full_page_loader";
import ProductCard from "@/components/ui/user/product_card";
import Link from "next/link";

export default function TopUpList() {
  const { games, loading } = useGames();
  const topUpGames = games.filter((game) => game.productType === "topup");

  if (loading) {
    return <FullPageLoader message="Loading Games..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-black via-gaming-gray/20 to-gaming-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl text-gaming-white mb-4 uppercase tracking-wider">
            Game Top-Up
          </h1>
        </div>

        {/* Products Grid */}
        {topUpGames.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {topUpGames.map((game) => (
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
