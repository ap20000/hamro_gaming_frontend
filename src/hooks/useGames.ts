import { useEffect, useState } from "react";
import { Game } from "@/type/game";
import { getAllGames, getGamesById } from "@/api/user_game_api";
import { useSearchParams } from "next/navigation";

export const useGames = (id?: string) => {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

   const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      setError("");
const data = await getAllGames(search || ""); 
      setGames(data);      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchGameDetail = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const data = await getGamesById(id);
      setGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGameDetail(id);
    } else {
      fetchAllGames();
    }
  }, [id, search]);

  return {
    games,        
    game,         
    loading,
    error,
    setGames,
    refetch: () => (id ? fetchGameDetail(id) : fetchAllGames()),
  };
};
