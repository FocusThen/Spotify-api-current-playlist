const axios = require("axios");

const spotifyLogin = async () => {
  const client_id = process.env.CLIENT_ID; // Your client id
  const redirect_url = process.env.REDIRECT_URL; // Your redirect url

  const params = {
    client_id,
    response_type: "code",
    redirect_uri: redirect_url,
    scope: "user-read-private%20user-read-currently-playing",
  };
  const getLoginHTML = await axios({
    method: "get",
    url: `https://accounts.spotify.com/authorize?`,
    params,
  });
  const html = await getLoginHTML;
  return new Promise((resolve) => {
    resolve(html.data);
  });
};

const getToken = async () => {
  const client_id = process.env.CLIENT_ID; // Your client id
  const client_secret = process.env.CLIENT_SECRET; // Your secret

  const params = {
    client_id,
    client_secret,
    grant_type: "client_credentials",
  };

  const GetTokenReq = await axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const GetTokenRes = await GetTokenReq;
  const token = GetTokenRes.data.access_token;
  return new Promise((resolve) => {
    resolve(token);
  });
};

const getUserData = async () => {
  const token = await getToken();
  const reqUser = await axios({
    method: "get",
    url: "https://api.spotify.com/v1/me",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = await reqUser;
  return new Promise((resolve) => {
    resolve(user);
  });
};

module.exports = { getToken, getUserData, spotifyLogin };
