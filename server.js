import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import express from "express";
import playerRoutes from "./routes/playerRoutes.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "development-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use("/", authRoutes);
app.use("/", playerRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.get("/greetings", (req, res) => {
  res.send("Greetings from the AI development game!");
});

app.get("/agent", (req, res) => {
  res.render("partials/agent");
});

app.get("/productivity", (req, res) => {
  res.render("partials/agent/productivity");
});

app.get("/manufacturing", (req, res) => {
  res.render("partials/agent/productivity/manufacturing");
});

app.get("/4-1-1-1", (req, res) => {
  res.render("partials/agent/productivity/manufacturing/4-1-1-1");
});

app.get("/serve", (req, res) => {
  res.render("partials/agent/serve");
});

app.get("/order", (req, res) => {
  res.render("partials/agent/order");
});

app.get("/improve", (req, res) => {
  res.render("partials/agent/improve");
});

app.get("/assistant", (req, res) => {
  res.render("partials/assistant");
});

app.get("/generative", (req, res) => {
  res.render("partials/generative");
});

app.get("/pr", (req, res) => {
  res.render("partials/pr");
});

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
}

startServer();
