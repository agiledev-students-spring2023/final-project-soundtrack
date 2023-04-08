const express = require("express"); 
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors");
router.use(cors());

const corsOptions = {
  origin: 'http://localhost:7002' // replace with your front-end's URL

  
}

const SpotifyWebApi = require('spotify-web-api-node'); 
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});
router.use(cors(corsOptions)); 

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private"];
//const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${"http://localhost:7002/auth"}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
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
      
      //res.redirect("http://localhost:7002/home"); // replace with your front-end's URL
      res.send(code); 
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  module.exports = router;


  

  module.exports = router;

