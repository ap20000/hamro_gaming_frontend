
import { Game } from "@/type/game";

export async function getGames(): Promise<Game[]> {
  const res = await fetch(`/api/admin/games`, {
    method: "GET",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
  });

  const data = await res.json();
    console.log('Raw API response:', data); 


  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch games");
  }

  return data.products;
}

export async function createGame(gameData: FormData): Promise<Game> {
  try {
    const res = await fetch(`/api/admin/addgame`, {
      method: "POST",
      body: gameData, 
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create game");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}


export async function deleteGame(_id: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/admin/game/${_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete game.");
  }

  return data;
}

export async function updateGame(gameData: FormData, _id: string): Promise<Game> {
  try {
    const res = await fetch(`/api/admin/game/${_id}`, {
      method: "PUT",
      body: gameData, 
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create game");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}