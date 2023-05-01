const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY; 
const morgan = require("morgan");
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"
const bcrypt = require('bcrypt');

// Route to create a new user
router.post('/', async function (req, res) {
  try {
    const existingUser = await User.findOne({ userName: req.body.username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      firstName: req.body.name,
      userName: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      spotifyUser: req.body.spotify,
      userId: req.body.id
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.userId }, secretKey);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User created and logged in', token });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user to database' });
  }
});


module.exports = router;
