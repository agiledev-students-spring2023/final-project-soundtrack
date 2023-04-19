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

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const filePath = req.file.path;

  user.avatar = filePath;
  await user.save();

  // Update the avatar in all posts made by the user
  await Post.updateMany(
    { userId: userId },
    { $set: { avatar: filePath } }
  );

  res.status(200).json({ message: 'Avatar uploaded successfully', avatar: filePath });
});


router.patch('/username', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newUsername = req.body.username;

  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.userName = newUsername;
  await user.save();

  res.status(200).json({ message: 'Username updated successfully', userName: newUsername });
});





module.exports = router;
