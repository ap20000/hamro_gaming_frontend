import { Game } from "@/type/game";
import ProductImage from "./product_image";

interface ProductCardProps {
  game: Game;
}

export default function ProductCard({ game }: ProductCardProps) {
  const showSticker = game.productType === "account";
  const stickerText =
    game.accountType === "private" ? "Private Account" : "Shared Account";
  return (
    <div
      className="group bg-[var(--gaming-black)]/80 backdrop-blur-sm rounded-xl border border-[var(--gaming-gray)] 
     overflow-hidden hover:border-gaming-electric-blue/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl
      hover:shadow-gaming-electric-blue/20 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/2] w-full">
        <ProductImage game={game} />

        {/* Overlay */}
      </div>

      {showSticker && (
        <div className="absolute top-2 right-2 bg-gaming-black/80 rounded-lg px-2 py-1">
          <p className="text-gaming-electric-blue text-xs font-sans font-light">
            {stickerText}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="p-4 ">
        {/* Title and Game Type */}
        <div className="">
          <h3 className="font-sans font-bold text-gaming-white text-lg line-clamp-2 group-hover:text-gaming-electric-blue transition-colors duration-300">
            {game.name}
          </h3>
        </div>

        {/* Game Info */}
        {/* <div className="space-y-2 mb-4"> */}
        {/* Platform */}
        {/* <div className="flex items-center space-x-2 text-gaming-white/70 text-base">
            <Gamepad2 className="w-3 h-3" />
            <span>{game.platform}</span>
          </div> */}

        {/* Region */}
        {/* <div className="flex items-center space-x-2 text-gaming-white/70 text-base">
            <Globe className="w-3 h-3" />
            <span>{game.region}</span>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
