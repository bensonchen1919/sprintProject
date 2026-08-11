import "dotenv/config";
import { connectDatabase } from "./config/database.js";
import express from "express";
import playerRoutes from "./routes/playerRoutes.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/authRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";

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
app.use("/", storyRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.get("/greetings", (req, res) => {
  res.send("Greetings from the AI development game!");
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
