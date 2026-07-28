import { createPlayer } from "../services/playerService.js";

export function showPlayerForm(req, res) {
  res.render("index", {
    error: null,
    previousName: ""
  });
}

export async function handleCreatePlayer(req, res) {
  try {
    const player = await createPlayer(req.body.name);

    res.render("start", {
      player
    });
  } catch (error) {
    res.status(400).render("index", {
      error: error.message,
      previousName: req.body.name ?? ""
    });
  }
}
