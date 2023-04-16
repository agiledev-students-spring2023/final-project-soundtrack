const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const morgan = require("morgan");
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"

// Route to log in a user
router.post('/', async function (req, res) {
  try {

    const user = await User.findOne({ userName: req.body.username });

    if (!user || !user.validPassword(req.body.password)) {
      console.log("cant find user");
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, secretKey);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ message: 'User logged in', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
});

module.exports = router;
