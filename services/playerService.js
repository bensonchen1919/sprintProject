import {
  createPlayer as createPlayerRecord,
  findPlayerById,
  updatePlayerById
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

  return createPlayerRecord({
    name: cleanedName,
    achievements: [],
    endingsReached: []
  });
}

export async function getPlayerById(id) {
  if (!id) {
    throw new Error("Player ID is required.");
  }

  const player = await findPlayerById(id);

  if (!player) {
    throw new Error("Player not found.");
  }

  return player;
}

export async function addEndingToPlayer(playerId, endingId) {
  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  const cleanedEndingId = endingId?.trim();

  if (!cleanedEndingId) {
    throw new Error("Ending ID is required.");
  }

  const player = await getPlayerById(playerId);

  const endingsReached = player.endingsReached.includes(cleanedEndingId)
    ? player.endingsReached
    : [...player.endingsReached, cleanedEndingId];

  return updatePlayerById(playerId, {
    endingsReached
  });
}
