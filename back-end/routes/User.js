const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post"); // or whatever your post model is called
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const User = require("../models/User"); 

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


//get login user info   const userId = req.user.id;
router.get("/userInfo", authenticateToken, async (req, res) => {
  let userName;
  let avatar;
  let userId = req.user.id;

  try {
    const user = await User.findOne({ userId: req.user.id });
    userName = user.userName;
    avatar = user.avatar;
    res.json({ userName, avatar, userId }); 
   } catch (err) {
    // handle a console.error(err);
    res.status(500).json({ error: err.message });
  }
})


// get login user post
router.get("/", authenticateToken, async (req, res) => {
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
          console.log("No posts found for user " + req.user.id);
        }
        res.json({posts});
      })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log("Reached /user/:userId route");
  Post.find({ userId: userId, privacy: "Public"})
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
      res.json({posts});
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

router.patch("/delete", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const user = await User.findOne({ userId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  else{
    await Post.deleteMany({ userId: userId});
    await User.deleteOne({ userId: userId });

  res.status(200).json({ message: "Account deleted" });

  }
});

router.get('/:userId/following', async (req, res) => {
  try {
      const userId = req.params.userId; 
      console.log(userId); 
      const user = await User.findOne({ userId: userId }).populate('following');

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.json(user.following);
  } catch (error) {
      console.error('Error fetching following:', error);
      res.status(500).send('Server error: ' + error.message);
  }
});

router.get('/:userId/followers', async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findOne({ userId: userId }).populate('followers');

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.json(user.followers);
  } catch (error) {
      console.error('Error fetching followers:', error);
      res.status(500).send('Server error: ' + error.message);
  }
});

router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
      const userIdToFollow = req.params.userId;
      const currentUserId = req.user.id; 

      const currentUser = await User.findOne({ userId: currentUserId });
      const userToFollow = await User.findOne({ userId: userIdToFollow });

      if (!currentUser || !userToFollow) {
          return res.status(404).send("One of the users not found.");
      }

      if (currentUser.following.includes(userToFollow._id)) {
          return res.status(400).send("You are already following this user.");
      }

      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      res.status(200).send("Successfully followed the user.");
  } catch (error) {
      console.error('Error in follow route:', error);
      res.status(500).send('Server error');
  }
});

router.post('/unfollow/:userId', authenticateToken, async (req, res) => {
  try {
      const userIdToUnfollow = req.params.userId;
      const currentUserId = req.user.id;

      const currentUser = await User.findOne({ userId: currentUserId });
      const userToUnfollow = await User.findOne({ userId: userIdToUnfollow });

      if (!currentUser || !userToUnfollow) {
          return res.status(404).send("One of the users not found.");
      }

      currentUser.following = currentUser.following.filter(id => !id.equals(userToUnfollow._id));
      userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(currentUser._id));

      await currentUser.save();
      await userToUnfollow.save();

      res.status(200).send("Successfully unfollowed the user.");
  } catch (error) {
      console.error('Error in unfollow route:', error);
      res.status(500).send('Server error');
  }
});


router.get('/checkFollow/:profileUserId', authenticateToken, async (req, res) => {
  try {
      const currentUserId = req.user.id; 
      const profileUserId = req.params.profileUserId; 

      const currentUser = await User.findOne({ userId: currentUserId });
      const profileUser = await User.findOne({ userId: profileUserId });

      if (!currentUser || !profileUser) {
          return res.status(404).send('One of the users not found');
      }

      const isFollowing = currentUser.following.some(id => id.equals(profileUser._id));

      res.json({ isFollowing });
  } catch (error) {
      console.error('Error in check follow route:', error);
      res.status(500).send('Server error');
  }
});




module.exports = router;
