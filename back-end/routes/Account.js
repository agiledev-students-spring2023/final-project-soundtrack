const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const morgan = require("morgan");
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"

// Route to create a new user
router.post('/', async function (req, res) {
  try {
    const existingUser = await User.findOne({ userName: req.body.username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = new User({
      firstName: req.body.name,
      userName: req.body.username,
      password: req.body.password,
      email: req.body.email,
      spotifyUser: req.body.spotify,
      userId: req.body.id
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, secretKey);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User created and logged in', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving user to database');
  }
});


module.exports = router;
