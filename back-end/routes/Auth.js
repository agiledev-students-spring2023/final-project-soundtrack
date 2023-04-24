const express = require("express");
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors");

router.use(cors());

const corsOptions = {
  origin: 'http://localhost:7002' 
};

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

router.use(cors(corsOptions)); 

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private", "user-read-recently-played", "streaming", "user-read-email", "user-read-private", "user-read-playback-state", "user-modify-playback-state"];
const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;
let tokenExpirationTime = null; 

router.get("/",morgan("dev"),(req, res, next) => {
  res.send(loginEndpoint); 
});

router.get("/callback", morgan("dev"), async (req, res, next) => {
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

  router.get('/refresh-token', async(req,res) => {
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
  })

function setAccessTokenExpirationTime(expiresIn) {
  const currentTime = new Date();
  tokenExpirationTime = new Date(currentTime.getTime() + expiresIn * 1000);
}

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
}

module.exports = router;

