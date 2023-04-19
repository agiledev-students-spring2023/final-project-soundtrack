const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post"); // or whatever your post model is called
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Missing token header");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    console.log("user:", user);
    req.user = user;
    next();
  });
}

// get all posts for a user
router.get("/", authenticateToken, async (req, res) => {
  

    const userId = req.user.id;
    console.log('userid:', userId); // Extract user ID from token
    const user = await User.findOne({ userId: userId });
    userName = user.userName;
    console.log('user: ', userName);  
    const avatar = user.avatar;

  Post.find({ userId: req.user.id })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        console.log("post #" + i + ": " + posts[i].userId + " has chosen song " + posts[i].songTitle.name + " at location " + posts[i].locationName);
      }
      res.json({userName, posts, avatar});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});


module.exports = router;
