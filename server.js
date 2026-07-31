import express from "express";
import playerRoutes from "./routes/playerRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", playerRoutes);

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
  res.render("partials/job_assignment/productivity");
});

app.get("/serve", (req, res) => {
  res.render("partials/job_assignment/serve");
});

app.get("/order", (req, res) => {
  res.render("partials/job_assignment/order");
});

app.get("/improve", (req, res) => {
  res.render("partials/job_assignment/improve");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// stable checkpoint
