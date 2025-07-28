"use client";

import { useGames } from "@/hooks/useGames";
import ProductCard from "./product_card";
import Link from "next/link";

export default function FeaturedProducts() {
  const { games } = useGames();

  const featGiftCards = games
    .filter((game) => game.productType === "giftcard")
    .slice(0, 4);

  const featAccounts = games
    .filter((game) => game.productType === "account")
    .slice(0, 4);
  return (
    <div className="container mx-auto py-4 lg:py-6 space-y-4 lg:space-y-8 px-8">
      <div>
        <div className="text-center mb-8">
          <h4 className="font-bold font-orbitron text-lg lg:text-2xl text-gaming-white">
            Featured Giftcards
          </h4>
        </div>
        <div className="col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {featGiftCards.map((game) => (
            <Link href={`/products/${game._id}`} key={game._id}>
              <ProductCard game={game} />
            </Link>
          ))}
        </div>
      </div>
      <div>
        <div className="text-center mb-8">
          <h4 className="font-bold font-orbitron text-lg lg:text-2xl text-gaming-white">
            Featured Accounts
          </h4>
        </div>
        <div className="col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {featAccounts.map((game) => (
            <Link href={`/products/${game._id}`} key={game._id}>
              <ProductCard game={game} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
