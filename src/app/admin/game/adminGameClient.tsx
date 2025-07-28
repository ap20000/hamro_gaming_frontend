"use client";
import GameList from "@/components/ui/admin/game_list";
import ErrorMessage from "@/components/ui/error_message";
import FullPageLoader from "@/components/ui/full_page_loader";
import { useGames } from "@/hooks/useGames";

export default function AdminGameClient() {
  const { games, loading, error, setGames } = useGames();

  const handleGamesChange = (updatedGames: typeof games) => {
    setGames(updatedGames);
  };

  return (
    <div className="mx-auto p-4 space-y-4">
      {loading ? (
        <FullPageLoader message="Loading Games..." />
      ) : (
        <>
          {error && <ErrorMessage message={error} />}
          <GameList products={games} onGamesChange={handleGamesChange} />
        </>
      )}
    </div>
  );
}
