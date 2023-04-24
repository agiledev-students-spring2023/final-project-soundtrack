const express = require("express");
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require("jsonwebtoken");
const secretKey = "shaoxuewenlu";
const User = require("../models/User"); 

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private", "user-read-recently-played", "streaming", "user-read-email", "user-read-private", "user-read-playback-state", "user-modify-playback-state"];
const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;
let tokenExpirationTime = null; 


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log("Headers:", req.headers); 
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Missing token header");
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
}

router.get("/", morgan("dev"),(req, res, next) => {
  res.send(loginEndpoint); 
});

router.get("/callback", morgan("dev"), authenticateToken, async (req, res, next) => {
  const { code } = req.query;

  try {
    const data = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(data).toString(), config);

    if (response.status === 200) {
      const { access_token, refresh_token, expires_in } = response.data;
      setAccessTokenExpirationTime(expires_in);
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      // saving access and refresh tokens to user schema 
      const userId = req.user.id;
      const user = await User.findOne({ userId: userId });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.auth = spotifyApi.getRefreshToken(); 
      await user.save();

      res.send("received access");
    } else {
      throw new Error(`Error in token request: status code ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error(`Error status code: ${error.response.status}`);
      console.error(`Error data: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error('Error in /callback route:', error.message);
    }
    next(error);
  }
});

router.get('/recently-played', async (req,res) => {
    try {
      await refreshAccessTokenIfNeeded(); 
      const result = await spotifyApi.getMyRecentlyPlayedTracks();
      res.status(200).send(result.body);
    } catch (err) {
      res.status(400).send(err)
    }
  });

  router.get('/get-access-token', async (req, res) => {
    try {
      await refreshAccessTokenIfNeeded(); 
    const token = spotifyApi.getAccessToken();
    console.log(token); 
    if (token) {
      res.send({ access_token: token });
    } else {
      res.status(400).send('Access token is required');
    }
    }
    catch(err){
      res.status(400).send(err)
    }
  });

function setAccessTokenExpirationTime(expiresIn) {
  const currentTime = new Date();
  tokenExpirationTime = new Date(currentTime.getTime() + expiresIn * 1000);
};

async function refreshAccessTokenIfNeeded() {
  try {
    if (tokenExpirationTime) {
      const currentTime = new Date();
      const timeRemaining = (tokenExpirationTime.getTime() - currentTime.getTime()) / 1000;
      console.log('No need to refresh token.'); 
      if (timeRemaining <= 60) {
        spotifyApi.refreshAccessToken().then(
          function (data) {
            console.log('The access token has been refreshed!');
            spotifyApi.setAccessToken(data.body['access_token']);
            setAccessTokenExpirationTime(3600);
          },
          function (err) {
            console.log('Could not refresh access token', err);
          }
        );
      }
    } else {
      console.log('Token expiration time is not set');
    }
  } catch (error) {
    console.error('Error refreshing access token', error);
  }
};

router.get('/refresh', authenticateToken, async(req,res) => {
  const userId = req.user.id;
  const user = await User.findOne({ userId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
 const refresh_token = user.auth; 
 spotifyApi.setRefreshToken(refresh_token);
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: {
      grant_type: 'refresh_token',
      refresh_token: spotifyApi.getRefreshToken()
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
  })
    .then(response => {
      spotifyApi.setAccessToken(response.data.access_token); 
      res.send(response.data);
      console.log(response); 
    })
    .catch(error => {
      res.send(error);
    });
});

router.get('/reset', async (req, res) => {
  try {
    spotifyApi.resetCredentials();
    res.send("reset all credentials"); 
  }
  catch(err){
    res.status(400).send(err)
  }
});

module.exports = router;

