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
router.use(cors(corsOptions))

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private"];

const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;


router.get("/",morgan("dev"),(req, res, next) => {
    //res.redirect(loginEndpoint); 
    res.send(loginEndpoint); 
})

router.get('/callback', async (req,res) => {
    const { code } = req.query;
    console.log(code)
});
  
module.exports = router;

