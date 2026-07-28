import {
  getAllPlayers,
  savePlayer
} from "../repositories/playerRepository.js";

export async function createPlayer(name) {
  const cleanedName = name?.trim();

  if (!cleanedName) {
    throw new Error("Player name is required.");
  }

  if (cleanedName.length < 2) {
    throw new Error("Player name must be at least 2 characters.");
  }

  if (cleanedName.length > 30) {
    throw new Error("Player name must be 30 characters or fewer.");
  }

  const players = await getAllPlayers();

  const player = {
    id: players.length
      ? Math.max(...players.map((existingPlayer) => existingPlayer.id)) + 1
      : 1,
    name: cleanedName,
    createdAt: new Date().toISOString()
  };

  return savePlayer(player);
}
