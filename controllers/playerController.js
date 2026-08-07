import {
  createPlayer,
  getPlayerById,
  addEndingToPlayer
} from "../services/playerService.js";

export function showPlayerForm(req, res) {
  res.render("index", {
    error: null,
    previousName: ""
  });
}

export async function handleCreatePlayer(req, res) {
  try {
    const player = await createPlayer(req.body.name, req.session.user.id);

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

export async function showProgressMap(req, res) {
  try {
    const player = await getPlayerById(req.params.playerId);

    res.render("partials/playerProgressMap", {
      player
    });
  } catch (error) {
    res.status(404).send(`<p>${error.message}</p>`);
  }
}

export async function unlockEnding(req, res) {
  try {
    const player = await addEndingToPlayer(
      req.params.playerId,
      req.params.endingId,
      req.session.user
    );

    res.render("partials/playerProgressMap", {
      player
    });
  } catch (error) {
    res
      .status(error.status ?? 400)
      .send(`<p>${error.message}</p>`);
  }
}
