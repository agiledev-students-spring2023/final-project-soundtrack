const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/post"); // or whatever your post model is called
const jwt = require("jsonwebtoken");
const secretKey = "shaoxuewenlu";
const User = require("../models/User"); // Assuming the model is in a separate file called "userModel.js"

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
    //console.log("user:", user);
    req.user = user;
    next();
  });
}
// get all posts for a user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  let userName;
  let avatar;
  //console.log("userid:", userId); // Extract user ID from token
  console.log("User ID is " + userId);

  try {
    const user = await User.findOne({ userId: req.user.id });
    userName = user.userName;
    avatar = user.avatar;
    // do something with userName and avatar here
  } catch (err) {
    // handle any errors here
  }
  
  try {
    await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // sort by update time in descending order
      .then((posts) => {
        for (let i = 0; i < posts.length; i++) {
          console.log(
            "post #" +
              i +
              ": " +
              posts[i].userId +
              " has chosen song " +
              posts[i].songTitle.name +
              " at location " +
              posts[i].locationName
          );
        }
        if (posts.length == 0) {
          console.log("No posts found for user " + userName);
        }
        res.json({ userName, posts, avatar });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log("Reached /user/:userId route");
  Post.find({ userId: userId })
    .sort({ createdAt: -1 }) // sort by update time in descending order
    .then(async (posts) => {
      for (let i = 0; i < posts.length; i++) {
        console.log(
          "post #" +
            i +
            ": " +
            posts[i].userId +
            " has chosen song " +
            posts[i].songTitle.name +
            " at location " +
            posts[i].locationName
        );
      }
      userName = posts[0].userName;
      avatar = posts[0].avatar;
      res.json({ userName, posts, avatar });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

//Get user info (username, avatar) without using Posts
router.get('/getUserInfo/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findOne({ userId: userId })
    .then(async (returnedUser) => {
      userName = returnedUser.userName;
      avatar = returnedUser.avatar;
      res.json({ userName, avatar });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

router.post("/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
  const userId = req.user.id;
  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const filePath = req.file.path;
  const fileData = fs.readFileSync(filePath);
  const base64Image = `data:image/jpeg;base64,${fileData.toString("base64")}`;
  fs.unlinkSync(filePath);

  user.avatar = base64Image;
  await user.save();
  await Post.updateMany({ userId: userId }, { $set: { avatar: base64Image } });

  res.status(200).json({ message: "Avatar uploaded successfully", avatar: base64Image });
});


router.patch("/username", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newUsername = req.body.username;

  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.userName = newUsername;
  await user.save();

  res
    .status(200)
    .json({ message: "Username updated successfully", userName: newUsername });
});

router.patch("/privacy", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const newPrivacyBool = req.body.privacy;

  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.privacy = newPrivacyBool;
  const newPrivacy = newPrivacyBool ? 'Private' : 'Public';
  await Post.updateMany({ userId: userId }, { privacy: newPrivacy });

  await user.save();

  res
    .status(200)
    .json({ message: "Privacy setting updated successfully", privacy: newPrivacy });
});


module.exports = router;
