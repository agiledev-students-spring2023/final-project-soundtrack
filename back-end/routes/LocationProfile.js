const express = require("express");
const router = express.Router();
const Post = require("../models/post"); // or whatever your post model is called
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"
let locationName = "";


router.post('/savedLocation', async (req, res) => {
  locationName = req.body.locationName;
  console.log(`Received location name: ${locationName}`);
  res.status(200).send('Location name received');
});


// get all posts for a location
router.get("/", async (req, res) => {
  

  Post.find({ locationName: locationName, privacy: "Public" })
  .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        console.log("post #" + i + ": " + posts[i].userId + " has chosen song " + posts[i].songTitle.name + " at location " + posts[i].locationName);
      }
      console.log("locationName is " + locationName);
      res.json({locationName, posts});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
