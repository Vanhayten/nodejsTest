const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Parser = require("rss-parser");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

const parser = new Parser();

app.get("/", async (req, res) => {
  try {

    const feed = await parser.parseURL("https://thefactfile.org/feed/");
    res.render("pages/index", { posts: feed.items });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts.");
  }
});

app.get("/search", async (req, res) => {
  try {
    const feed = await parser.parseURL("https://thefactfile.org/feed/");
    const categories = [
      ...new Set(feed.items.flatMap((item) => item.categories)),
    ];
    res.render("pages/search", {  posts: [] ,categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving categories.");
  }
});


app.post("/search/title", async (req, res) => {
  const title = req.body.title;

  try {
    const feed = await parser.parseURL("https://thefactfile.org/feed/");

    const categories = [
      ...new Set(feed.items.flatMap((item) => item.categories)),
    ];
    
    const matchedPosts = feed.items.filter((item) =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );
    res.render("pages/search", { posts: matchedPosts, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts.");
  }
});

app.post("/search/category", async (req, res) => {
  const category = req.body.category;

  try {
    const feed = await parser.parseURL("https://thefactfile.org/feed/");


    const categories = [
      ...new Set(feed.items.flatMap((item) => item.categories)),
    ];

    const matchedPosts = feed.items.filter((item) =>
      item.categories.includes(category)
    );
    res.render("pages/search", { posts: matchedPosts, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
