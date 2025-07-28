"use client";

import { useState } from "react";
import { Game } from "@/type/game";
import { deleteGame, createGame, updateGame } from "@/api/admin_game_api";
import GameForm from "./game_form";
import { Edit, Trash, RefreshCw, Plus } from "lucide-react";
import Button from "../button";

interface Props {
  products: Game[];
  onGamesChange: (games: Game[]) => void;
  onRefresh?: () => void;
}

export default function GameList({
  products,
  onGamesChange,
  onRefresh,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddGame = async (gameData: FormData) => {
    setLoading(true);
    try {
      const newGame = await createGame(gameData);
      const updatedGames = [newGame, ...products];
      onGamesChange(updatedGames);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add game:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGame = async (gameData: FormData) => {
    if (!editingGame) return;

    setLoading(true);
    try {
      const updatedGame = await updateGame(gameData, editingGame._id);
      const updatedGames = products.map((game) =>
        game._id === editingGame._id ? updatedGame : game
      );

      onGamesChange(updatedGames);
      setEditingGame(null);
    } catch (error) {
      console.error("Failed to update game:", error);
      alert("Failed to update game. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    try {
      await deleteGame(gameId);
      const updatedGames = products.filter((game) => game._id !== gameId);
      onGamesChange(updatedGames);
    } catch (error) {
      console.error("Failed to delete game:", error);
    } finally {
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-end space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-gaming-white hover:bg-gaming-white/50 text-gaming-gray/90 px-4 py-2 rounded-lg font-sans font-medium flex items-center space-x-2 "
          >
            <RefreshCw
              className={`w-4 h-4 text-gaming-gray/90 ${refreshing}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Button onClick={() => setShowForm(true)} className="flex gap-2">
            <Plus className="text-gaming-white" />
            <span>Add New Game</span>
          </Button>
        </div>
      </div>

      {/* Games Grid */}

      <div className="overflow-x-auto bg-gaming-white shadow-sm shadow-gaming-gray/20 rounded-xl">
        <table className="min-w-full divide-y divide-gaming-gray/10">
          <thead>
            <tr>
              {[
                "Game",
                "Platform",
                "Region",
                "Product Type",
                "Game Type",
                "Delivery",

                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-sm font-sans font-semibold text-gaming-black"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gaming-gray/10">
            {products
              .filter((game) => game && game._id && game.name)
              .map((game, index) => (
                <tr
                  key={`${game._id}-${index}`}
                  className="hover:bg-gaming-gray/10"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-sans font-medium text-gaming-black">
                          {game.name}
                        </div>
                        <div className="text-sm font-sans text-gaming-gray/50 max-w-72 truncate">
                          {game.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-gaming-gray">
                    {game.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-gaming-gray">
                    {game.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-gaming-gray">
                    {game.productType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-gaming-gray">
                    {game.gameType}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        game.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {game.status}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-sans text-gaming-gray">
                    {game.deliveryTime}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingGame(game)}
                        className="bg-gaming-blue hover:bg-gaming-blue/85 text-gaming-white px-3 py-1.5 rounded-md flex items-center gap-1"
                      >
                        <Edit size={14} />
                        <span className="text-sm font-sans">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGame(game._id)}
                        className="bg-red-500 hover:bg-red-600 text-gaming-white px-3 py-1.5 rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash size={14} />

                        <span className="text-sm font-sans">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Forms */}
      {showForm && (
        <GameForm
          onSubmit={handleAddGame}
          onCancel={() => setShowForm(false)}
          loading={loading}
        />
      )}

      {editingGame && (
        <GameForm
          game={editingGame}
          onSubmit={handleEditGame}
          onCancel={() => setEditingGame(null)}
          isEditing={true}
          loading={loading}
        />
      )}
    </div>
  );
}
