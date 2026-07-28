import { readFile, writeFile } from "fs/promises";

const playersFile = new URL("../data/players.json", import.meta.url);

export async function getAllPlayers() {
  const data = await readFile(playersFile, "utf-8");
  return JSON.parse(data);
}

export async function savePlayer(player) {
  const players = await getAllPlayers();
  players.push(player);

  await writeFile(
    playersFile,
    JSON.stringify(players, null, 2)
  );

  return player;
}
