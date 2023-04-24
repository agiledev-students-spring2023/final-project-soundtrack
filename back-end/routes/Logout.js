const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const secretKey = "shaoxuewenlu";
const morgan = require("morgan");
const User = require('../models/User');

// Route to log out a user
router.post('/', function(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out' });
  });
  
module.exports = router;
