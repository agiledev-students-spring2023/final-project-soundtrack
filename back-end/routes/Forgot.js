const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming the model is in a separate file called "userModel.js"
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
    

// Route to log in a user
router.post('/', async function (req, res) {
  try {

    const user = await User.findOne({ userName: req.body.username });
    console.log(user);

    if (!user || !user.validEmail(req.body.email)) {
      return res.status(401).json({ message: 'Invalid username or email' });
    }

    // Create a transporter to send the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'soundtrackwebapp@gmail.com',
          pass: 'fpwslfvsjvqyovhe'
        }
      });

    // Create an email message to send to the user
    const decryptedPassword = await bcrypt.compare(user.password, user.password);
    const mailOptions = {
      from: 'soundtrackwebapp@gmail.com',
      to: user.email,
      subject: 'Your soundTrack password',
      text: `Your password is ${decryptedPassword}. If you did not request your password, someone is trying to get into your account we recommend changing your password.`
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
