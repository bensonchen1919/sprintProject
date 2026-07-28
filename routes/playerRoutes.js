import express from "express";
import {
  showPlayerForm,
  handleCreatePlayer
} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", showPlayerForm);
router.post("/players", handleCreatePlayer);

export default router;
