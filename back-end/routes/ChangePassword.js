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
        return res.status(401).json({ message: 'Invalid user' });
      }
  
      // Generate a new password
      const newPassword = req.body.password; // Generates a random 8-character alphanumeric string
  
      // Hash the new password with bcrypt
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Set the user's new password
      user.password = hashedPassword;
      await user.save();
  
      // Create a transporter to send the email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'soundtrackwebapp@gmail.com',
          pass: 'fpwslfvsjvqyovhe'
        }
      });
  
      // Create an email message to send to the user
      const mailOptions = {
        from: 'soundtrackwebapp@gmail.com',
        to: user.email,
        subject: 'Your new soundTrack password',
        text: `Your new password is ${newPassword}. If you did not request your password, someone is trying to get into your account we recommend changing your password.`
      };
  
      // Send the email
      transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err);
          return res.status(500).send('Error sending email');
        } else {
          return res.status(200).send('Email sent');
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error resetting user password');
    }
  });
  
  module.exports = router;
  