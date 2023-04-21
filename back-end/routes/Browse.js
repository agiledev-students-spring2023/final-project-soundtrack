const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ privacy: "Public" })
      .sort({ createdAt: -1 }) // sort by update time in descending order
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
