import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

/* below is what will become expanded upon in our make-your-own adventure, right now it is just a home page that leads to another page */
app.get("/", (req, res) => {
  res.send(`
    <h1>AI dev game</h1>
    <a href="/hello">Go to the next page</a>
    <a href="/greetings">Go to the next page</a>
  `);
});

/*When we start to know what the game will be like, we will make ejs files and switch to the more scalable version below*/
/*
app.get("/", (req, res) => {
  res.render("start");
});
*/

app.get("/hello", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/greetings", (req, res) => {
  res.send("<h1>Greetings Planet!</h1>");
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
