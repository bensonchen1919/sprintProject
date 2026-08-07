import express from "express";

import {
  handleLogin,
  handleLogout,
  handleSignup,
  showLogin,
  showSignup
} from "../controllers/authController.js";

const router = express.Router();

router.get("/signup", showSignup);
router.post("/signup", handleSignup);

router.get("/login", showLogin);
router.post("/login", handleLogin);

router.post("/logout", handleLogout);

export default router;
