const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const morgan = require("morgan");
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"
const nodemailer = require('nodemailer');

// Route to log in a user
router.post('/forgot', async function (req, res) {
    console.log("in the route");
  try {
    console.log("in the route");

    const user = await User.findOne({ userName: req.body.username });
    console.log(user);

    if (!user || !user.validEmail(req.body.email)) {
      console.log("cant find user");
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    // Create a transporter to send the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'soundtrackwebapp@gmail.com',
          pass: '<YOUR_GMAIL_PASSWORD>'
        }
      });

    // Create an email message to send to the user
    const mailOptions = {
      from: 'soundtrackwebapp@gmail.com',
      to: user.email,
      subject: 'Your soundTrack password',
      text: `Your password is ${user.password}. If you did not request your password, someone is trying to get into your account we recommend changing your password.`
    };

    // Send the email
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).send('Email sent');
      }
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Error finding in user password');
  }
});

module.exports = router;
