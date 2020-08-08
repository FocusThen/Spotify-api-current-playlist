const express = require("express");
const cors = require("cors"); //cors
const helmet = require("helmet"); // helmet for basic security
const morgan = require("morgan"); // logs
require("dotenv").config(); // env file reader.
const path = require("path");
const fetch = require("node-fetch");

const { currentlyPlaying } = require("./spotifyApi");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

let TOKEN;
const redirect_url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://focusthen-spotify.herokuapp.com/";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/currentplaying", async (req, res) => {
  if (TOKEN === undefined) res.json({ message: "go login page /login" });
  const info = await currentlyPlaying(TOKEN);

  const artists_name = info.item.artists[0].name;
  const image_url = info.item.album.images[0].url;

  const cover = image_url;
  let coverImg = null;
  if (cover) {
    const buff = await (await fetch(cover)).arrayBuffer();
    coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
  }

  const svg = `
    <svg fill="none" width="250px"  height="250px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" data-reactroot="">
      <foreignObject x="0" y="0" width="80%"  height="80%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <img src="${coverImg}" style="width:100%"/>
        </div>
      </foreignObject>
    </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
});

app.get("/api", async (req, res) => {
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
