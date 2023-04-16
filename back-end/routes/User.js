const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post"); // or whatever your post model is called
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";


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
router.get("/", authenticateToken, (req, res) => {
  Post.find({ userId: req.user.userId })
    .then((posts) => {
      for (let i = 0; i < posts.length; i++) {
        console.log("post #" + i + ": " + posts[i].userId + " has chosen song " + posts[i].songTitle.track.name + " at location " + posts[i].locationName);
      }
      res.json(posts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});


module.exports = router;
