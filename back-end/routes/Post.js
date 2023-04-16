const express = require('express');
const router = express.Router();
const secretKey = "shaoxuewenlu";
const jwt = require('jsonwebtoken');
const Post = require('../models/post'); // import Post model

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Missing token header');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    console.log('user:', user);
    req.user = user;
    next();
  });
}

router.post('/savePost', authenticateToken, async (req, res) => {
  try {
    const post = req.body.postItem;
    console.log({ post });

    const userName = req.user.userName;
    console.log("username is" + userName);
    const userId = req.user.userId;
    console.log('id:', userId); // Extract user ID from token

    const newPost = new Post({
      userId: userId,
      songTitle: post.songTitle,
      imageURL: post.imageURL,
      locationName: post.locationName,
      privacy: post.privacy,
      likes: 0,
      likedBy: []
    });

    await newPost.save();
    console.log(`Successfully added post with ID ${newPost._id} to MongoDB`);
    res.status(200).send(`Post ${newPost._id} added successfully!`);
  } catch (error) {
    console.error(`Error saving post: ${error}`);
    res.status(500).send("Error saving post!");
  }
});

module.exports = router;
