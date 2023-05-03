const express = require("express");
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const User = require("../models/User"); 
const jwtEncryptionKey = process.env.JWT_ENCRYPTION_KEY;

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

function encryptWithJWT(text) {
  return jwt.sign({ token: text }, jwtEncryptionKey, { algorithm: 'HS256' });
}

function decryptWithJWT(token) {
  try {
    const decrypted = jwt.verify(token, jwtEncryptionKey, { algorithms: ['HS256'] });
    return decrypted.token;
  } catch (error) {
    console.error('Error decrypting JWT:', error);
    return null;
  }
}

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private", "user-read-recently-played", "streaming", "user-read-email", "user-read-private", "user-read-playback-state", "user-modify-playback-state"];
const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;
let tokenExpirationTime = null; 


async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Missing token header");
  }
  jwt.verify(token, secretKey, async (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;

    // Create a new SpotifyWebApi instance for the authenticated user
    const userSpotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI
    });

    // Load the user's access and refresh tokens from the database
    const dbUser = await User.findOne({ userId: user.id });
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const refreshToken = decryptWithJWT(dbUser.auth);
    userSpotifyApi.setRefreshToken(refreshToken);

    req.spotifyApi = userSpotifyApi;
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

      user.auth = encryptWithJWT(spotifyApi.getRefreshToken());
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

router.get('/recently-played', authenticateToken, async (req, res) => {
  try {
    const userSpotifyApi = req.spotifyApi;

    // Refresh the access token if needed
    const { body: { access_token } } = await userSpotifyApi.refreshAccessToken();
    userSpotifyApi.setAccessToken(access_token);

    try {
      const result = await userSpotifyApi.getMyRecentlyPlayedTracks();
      res.status(200).send(result.body);
    } catch (spotifyApiError) {
      console.error('Error calling Spotify API:', spotifyApiError);
      res.status(400).send(spotifyApiError);
    }
  } catch (err) {
    console.error('Error in /recently-played route:', err);
    res.status(400).send(err);
  }
});



router.get('/check-access-token', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.auth === "0") {
      return res.status(400).send(err);
    } 

    else {
      res.send(user.auth);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});


function setAccessTokenExpirationTime(expiresIn) {
  const currentTime = new Date();
  tokenExpirationTime = new Date(currentTime.getTime() + expiresIn * 1000);
};


router.get('/refresh', authenticateToken, async(req,res) => {
  const userId = req.user.id;
  const user = await User.findOne({ userId: userId });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
 const refresh_token = decryptWithJWT(user.auth);
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

router.get('/reset', authenticateToken, async (req, res) => {
  try {
    spotifyApi.resetCredentials();
    res.send("reset all credentials"); 
  }
  catch(err){
    res.status(400).send(err)
  }
});

module.exports = router;

