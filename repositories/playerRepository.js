import Player from "../models/Player.js";

export async function getAllPlayers() {
  return Player.find().sort({ createdAt: -1 });
}

export async function findPlayerById(id) {
  return Player.findById(id);
}

export async function createPlayer(playerData) {
  return Player.create(playerData);
}

export async function updatePlayerById(id, updates) {
  return Player.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );
}

export async function removePlayerById(id) {
  return Player.findByIdAndDelete(id);
}
