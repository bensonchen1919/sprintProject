import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get("/", (req, res) => {
  res.render("start");
});


app.get("/hello", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/greetings", (req, res) => {
  res.send("<h1>Greetings Planet!</h1>");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
