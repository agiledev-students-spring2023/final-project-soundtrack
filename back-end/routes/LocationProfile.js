const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // or whatever your post model is called
const jwt = require("jsonwebtoken");


// get all posts for a location
router.get("/:locationID", async (req, res) => {
  const locationID = req.params.locationID;
  console.log("locationID is " + locationID);
  Post.find({ "locationName.placeId": locationID, privacy: "Public" })
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
      
      res.json({posts});
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
