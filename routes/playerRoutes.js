import express from "express";
import {
  showPlayerForm,
  handleCreatePlayer,
  showProgressMap,
  unlockEnding
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", showPlayerForm);
router.post("/players", handleCreatePlayer);

router.get(
  "/players/:playerId/map",
  showProgressMap
);

router.post(
  "/players/:playerId/endings/:endingId",
  unlockEnding
);

export default router;
