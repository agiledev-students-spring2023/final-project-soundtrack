const express = require("express");
const router = express.Router();
const secretKey = "shaoxuewenlu";
const jwt = require("jsonwebtoken");
const Favorite = require("../models/favorite"); 
const User = require("../models/User"); 

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token is " + token);

  if (!token) {
    return res.status(401).send("Missing token header");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    //console.log('user:', user);
    req.user = user;
    next();
  });
}

router.post("/saveFavorite", authenticateToken, async (req, res) => {
  try {
    const favorite = req.body.locationName;
    console.log({ favorite });
    
    //fetch username from db with id from token
    const userId = req.user.id;
    console.log("userid:", userId); // Extract user ID from token

    const user = await User.findOne({ userId: userId });
    const userName = user.userName;
    console.log("username: ", user.userName);

    const newFavorite = new Favorite({
      userId: userId,
      locationName: favorite,
    });

    await newFavorite.save();

    console.log(`Successfully added favorited location with ID ${newFavorite._id} to MongoDB`);
    res.status(200).send(`Favorited location ${newFavorite._id} added successfully!`);
  } 
  catch (error) {
    console.error(`Error saving favorited location: ${error}`);
    res.status(500).send("Error saving favorited location!");
  }
});

router.delete("/removeFavorite/:id", authenticateToken, async (req, res) => {
  try {
    const favoriteId = req.params.id;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ _id: favoriteId, userId: userId });
    console.log(favorite);

    if (!favorite) {
      return res.status(404).send("Favorited location not found");
    }

    await Favorite.deleteOne({ _id: favoriteId, userId: userId });

    console.log(`Successfully removed favorited location with ID ${favoriteId} from MongoDB`);
    res.status(200).send(`Post ${favoriteId} removed successfully!`);
  } 
  catch (error) {
    console.error(`Error removing favorited location: ${error}`);
    res.status(500).send("Error removing favorited location!");
  }
});

module.exports = router;
