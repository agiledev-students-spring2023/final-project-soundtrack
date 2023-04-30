const express = require("express");
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken'); 

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Client Credentials Flow
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
let tokenExpirationTime = null; 

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


router.get('/', morgan("dev"), async (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: "streaming, user-read-email, user-read-private, user-read-playback-state, user-modify-playback-state" 
    })
  };


  try {
    const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
    const token = response.data.access_token;
    const expires_in = response.data.expires_in;
    //console.log(expires_in); 
    setAccessTokenExpirationTime(expires_in);
    spotifyApi.setAccessToken(token);
    res.send(token);

  } catch (error) {
    console.error(error);
    res.send({ error: 'Failed to authenticate with Spotify API' });
  }
});

router.get('/random-songs', async (req, res) => {
    try {
      //await refreshAccessTokenIfNeeded();
      const result = await spotifyApi.searchTracks('year:2023', { limit: 5 });
      res.status(200).send(result.body);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.get('/search-song', async (req, res) => {
    const { q } = req.query;
  
    try {
      await refreshAccessTokenIfNeeded(); 
      const result = await spotifyApi.searchTracks(q, { limit: 20 });
      const tracks = result.body.tracks.items;
      res.status(200).send(tracks);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  

  
module.exports = router;