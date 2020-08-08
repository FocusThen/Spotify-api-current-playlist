const express = require("express");
const cors = require("cors"); //cors
const helmet = require("helmet"); // helmet for basic security
const morgan = require("morgan"); // logs
require("dotenv").config(); // env file reader.
const path = require("path");

const { currentlyPlaying } = require("./spotifyApi");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
const staticFileMiddleware = express.static(path.join(__dirname, "public"));
app.use(staticFileMiddleware);

let TOKEN;
const redirect_url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://focusthen-spotify.herokuapp.com";

app.get("/", (req, res) => {
  res.json({ message: "go login page /login" });
});

app.get("/currentplaying", async (req, res) => {
  if (TOKEN === undefined) res.json({ message: "go login page /login" });
  const info = await currentlyPlaying(TOKEN);
  res.json({ info });
});

app.get("/api", async (req, res) => {
  console.log(req.query);
  if (req.query) res.json({ message: "go login page /login" });
  TOKEN = req.query.token;
});

app.get("/login", function (req, res) {
  var scopes = "user-read-currently-playing";
  const client_id = process.env.CLIENT_ID;

  res.redirect(
    "https://accounts.spotify.com/authorize" +
      "?response_type=token" +
      "&client_id=" +
      client_id +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_url)
  );
});

module.exports = app;
