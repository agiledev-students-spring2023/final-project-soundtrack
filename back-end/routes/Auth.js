const express = require("express");
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors");

router.use(cors());

const corsOptions = {
  origin: 'http://localhost:7002' // replace with your front-end's URL
};

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

router.use(cors(corsOptions)); 

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private", "user-read-recently-played"];
const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${"http://localhost:7002/auth"}&scope=${scopes.join("%20")}&response_type=code&show_dialog=true`;

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
    const { access_token, refresh_token } = response.data;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.send("access_token is: " +  access_token);
    //console.log(response.data); 
  } 
  catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/recently-played', async (req,res) => {
    try {
      //var result = await spotifyApi.getUserPlaylists();
      const result = await spotifyApi.getMyRecentlyPlayedTracks();
      console.log(result.body);
      res.status(200).send(result.body);
    } catch (err) {
      res.status(400).send(err)
    }
  });
  
module.exports = router;

