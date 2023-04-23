const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const cookieParser = require('cookie-parser');

router.use(cookieParser());

// Route to reset a user's password
router.post('/', async function (req, res) {
    try {
      // Fetch the JWT token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];
      
      // Verify the JWT token and extract the user ID
      const decodedToken = jwt.verify(token, secretKey);
      const userId = decodedToken.id;
  
      // Find the user by user ID
      const user = await User.findOne({ userId: userId });


      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user object
      return res.status(200).json(user);
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting user from token');
    }
  });
  
  module.exports = router;