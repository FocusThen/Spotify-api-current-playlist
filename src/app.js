const express = require("express");
const cors = require("cors"); //cors
const helmet = require("helmet"); // helmet for basic security
const morgan = require("morgan"); // logs

require("dotenv").config(); // env file reader.

const { getToken, getUserData, spotifyLogin } = require("./spotifyApi");

const app = express();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const html = await spotifyLogin();

  res.send(html);
});

module.exports = app;
