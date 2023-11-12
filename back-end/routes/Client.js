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
    setAccessTokenExpirationTime(expires_in);
    spotifyApi.setAccessToken(token);
    // res.send(token);
    res.json({ access_token: token });

  } catch (error) {
    console.error(error);
    res.send({ error: 'Failed to authenticate with Spotify API' });
  }
});

  router.get('/playlist/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId; 
  
    try {
      await refreshAccessTokenIfNeeded(); 
      const result = await spotifyApi.getPlaylist(playlistId); 
      console.log(result.body);
      res.status(200).send(result.body.tracks.items); 
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
      console.log(tracks);
      res.status(200).send(tracks);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.post('/token', morgan("dev"), async (req, res) => {
    try {
      const result = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: new URLSearchParams({
          'grant_type': 'client_credentials'
        }).toString()
      });
  
      const { access_token, expires_in } = result.data;
      spotifyApi.setAccessToken(access_token);
      setAccessTokenExpirationTime(expires_in); // Set the expiration time based on the expires_in value
  
      // Send the token back to the client if needed
      res.json({ access_token: access_token, expires_in: expires_in });
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  function setAccessTokenExpirationTime(expiresIn) {
    const currentTime = new Date();
    tokenExpirationTime = new Date(currentTime.getTime() + expiresIn * 1000);
    console.log(`New token set to expire at ${tokenExpirationTime}`);
  }
  
  async function refreshAccessTokenIfNeeded() {
    try {
      if (!tokenExpirationTime || new Date() >= tokenExpirationTime) {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        setAccessTokenExpirationTime(data.body['expires_in']);
        console.log('Access token refreshed');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  }
  
  

  
module.exports = router;