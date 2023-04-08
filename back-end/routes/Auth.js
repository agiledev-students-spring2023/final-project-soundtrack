const express = require("express"); 
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors");
const { AccessAlarm } = require("@mui/icons-material");
router.use(cors());

const corsOptions = {
  origin: 'http://localhost:7002' // replace with your front-end's URL
}

router.use(cors(corsOptions)); 

const authEndpoint = "https://accounts.spotify.com/authorize?";
const scopes = ["user-library-read", "playlist-read-private"];
const loginEndpoint = `${authEndpoint}client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${"http://localhost:7002/auth"}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

router.get("/",morgan("dev"),(req, res, next) => {
    res.send(loginEndpoint); 
})

router.get("/callback", morgan("dev"), async (req, res, next) => {
    res.send("hellow");
  });
  
  module.exports = router;

