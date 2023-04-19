const express = require('express');
const router = express.Router();
const secretKey = "shaoxuewenlu";
const jwt = require('jsonwebtoken');
const Post = require('../models/post'); // import Post model
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("token is " + token);

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
    //fetch username from db with id from token 
    const userId = req.user.id;
    console.log('userid:', userId); // Extract user ID from token
    
    const user = await User.findOne({ userId: userId });
    const userName = user.userName;
    console.log('username: ', user.userName);   

    const newPost = new Post({
      userId: userId,
      userName: userName,
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

router.delete('/deletePost/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findOne({ _id: postId, userId: userId });
    console.log(post);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    await Post.deleteOne({ _id: postId, userId: userId });

    console.log(`Successfully deleted post with ID ${postId} from MongoDB`);
    res.status(200).send(`Post ${postId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting post: ${error}`);
    res.status(500).send("Error deleting post!");
  }
});

router.patch('/updatePrivacy/:id', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { privacy } = req.body;

    const post = await Post.findOne({ _id: postId, userId: userId });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    post.privacy = privacy;
    await post.save();

    console.log(`Successfully updated privacy for post with ID ${postId} in MongoDB`);
    res.status(200).send(`Post ${postId} privacy updated successfully!`);
  } catch (error) {
    console.error(`Error updating post privacy: ${error}`);
    res.status(500).send("Error updating post privacy!");
  }
});


module.exports = router;
