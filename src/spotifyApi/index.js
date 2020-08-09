const fetch = require("node-fetch");

const currentlyPlaying = async () => {
  const url = "https://api.spotify.com/v1/me/player/currently-playing";
  const Authorization = await getAuth();

  const response = await fetch(url, {
    headers: {
      Authorization,
    },
  });

  const { status } = response;
  if (status === 204) {
    return {};
  } else if (status === 200) {
    const data = await response.json();
    return data;
  }
};
const getAuth = async () => {
  const {
    CLIENT_ID: client_id,
    CLIENT_SECRET: client_secret,
    REFRESH_TOKEN: refresh_token,
  } = process.env;

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const Authorization = `Basic ${basic}`;

  const url = "https://accounts.spotify.com/api/token";

  const response = await fetch(
    `${url}?grant_type=refresh_token&refresh_token=${refresh_token}`,
    {
      method: "POST",
      headers: {
        Authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  ).then((r) => r.json());

  return `Bearer ${response.access_token}`;
};

module.exports = { currentlyPlaying };
