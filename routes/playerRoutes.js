import express from "express";
import { requireLogin } from "../middleware/requireLogin.js";
import {
  showPlayerForm,
  handleCreatePlayer,
  showProgressMap,
  unlockEnding
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", requireLogin, showPlayerForm);

router.post(
  "/players",
  requireLogin,
  handleCreatePlayer
);

router.get(
  "/players/:playerId/map",
  requireLogin,
  showProgressMap
);

router.post(
  "/players/:playerId/endings/:endingId",
  requireLogin,
  unlockEnding
);

export default router;
