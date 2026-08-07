import mongoose from "mongoose";
import {
  createPlayer as createPlayerRecord,
  findPlayerById,
  updatePlayerById
} from "../repositories/playerRepository.js";

export async function createPlayer(name, ownerId) {
  const cleanedName = name?.trim();

  if (!ownerId) {
    throw new Error("Player owner is required.");
  }

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
    ownerId,
    name: cleanedName,
    achievements: [],
    endingsReached: []
  });
}

export async function getPlayerById(id) {
  if (!id) {
    throw new Error("Player ID is required.");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Player not found.");
  } 

  const player = await findPlayerById(id);

  if (!player) {
    throw new Error("Player not found.");
  }

  return player;
}

function isOwnerOrAdmin(player, currentUser) {
  if (!currentUser) {
    return false;
  }

  const isOwner =
    player.ownerId.toString() === currentUser.id;

  const isAdmin =
    currentUser.role === "admin";

  return isOwner || isAdmin;
}

export async function addEndingToPlayer(
  playerId,
  endingId,
  currentUser
) {
  if (!playerId) {
    throw new Error("Player ID is required.");
  }

  const cleanedEndingId = endingId?.trim();

  if (!cleanedEndingId) {
    throw new Error("Ending ID is required.");
  }

  const player = await getPlayerById(playerId);

  if (!isOwnerOrAdmin(player, currentUser)) {
    const error = new Error(
      "You are not allowed to modify this player."
    );

    error.status = 403;
    throw error;
  }

  const endingsReached = player.endingsReached.includes(cleanedEndingId)
    ? player.endingsReached
    : [...player.endingsReached, cleanedEndingId];

  return updatePlayerById(playerId, {
    endingsReached
  });
}