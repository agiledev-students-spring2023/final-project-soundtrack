const express = require("express");
const router = express.Router();
const Post = require("../models/post");


router.get("/:skip/:limit", async (req, res) => {
  try {
    const { skip, limit } = req.params;
    const posts = await Post.find({ privacy: "Public" })
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
