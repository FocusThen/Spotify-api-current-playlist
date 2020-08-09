const express = require("express");
const cors = require("cors"); //cors
const helmet = require("helmet"); // helmet for basic security
const morgan = require("morgan"); // logs
require("dotenv").config();
const fetch = require("node-fetch"); // env file reader.

const { currentlyPlaying } = require("./spotifyApi");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "go to get /v2/current-playing" });
});

app.get("/v2/current-playing", async (req, res) => {
  const info = await currentlyPlaying();

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

module.exports = app;
