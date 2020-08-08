const axios = require("axios");

const currentlyPlaying = (token) => {
  const url = "https://api.spotify.com/v1/me/player/currently-playing";
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const data = axios.get(url, { headers }).then(({ data }) => data);
  return data;
};

module.exports = { currentlyPlaying };
