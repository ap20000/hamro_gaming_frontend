import { API_BASE_URL } from "@/config/config";
import Deafult from "../../../../public/images/slide2.jpg";
import { Game } from "@/type/game";

interface ProductImageProps {
  game: Game;
  className?: string;
}

export default function ProductImage({
  game,
  className = "",
}: ProductImageProps) {
  const getImageUrl = () => {
    if (!game.image) {
      return Deafult.src;
    }

    let fullImageUrl = game.image;
    if (!game.image.startsWith("http")) {
      const baseUrl = API_BASE_URL.replace("/api", "");
      const imagePath = game.image.startsWith("/")
        ? game.image
        : `/${game.image}`;
      fullImageUrl = `${baseUrl}${imagePath}`;
    }

    fullImageUrl = fullImageUrl.replace(/\\/g, "/");
    const urlParts = fullImageUrl.split("/");
    const encodedParts = urlParts.map((part, index) => {
      if (index < 3 && part.includes(":")) {
        return part;
      }
      return encodeURIComponent(part);
    });
    fullImageUrl = encodedParts.join("/");
    return fullImageUrl;
  };

  return (
    <div className={` ${className}`}>
      <img
        src={getImageUrl()}
        alt={game.name}
        className="w-full h-full object-contain rounded-md group-hover:scale-110 transition-transform duration-500"
      />
    </div>
  );
}
