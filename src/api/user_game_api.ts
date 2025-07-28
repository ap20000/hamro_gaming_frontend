import { Game } from "@/type/game";


export async function getAllGames(search: string = ""): Promise<Game[]> {
  const url = search
    ? `/api/product/products?search=${encodeURIComponent(search)}`
    : `/api/product/products`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch games");
  }

  const data = await res.json();
  return data.products;
}

export async function getGamesById(id: string): Promise<Game> {
  const res = await fetch(`/api/product/products/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch game details");
  }

  const data = await res.json();
  return data.product;
}
