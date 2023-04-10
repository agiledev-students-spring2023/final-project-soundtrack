const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

const secretKey = 'shaoxuewenlu'; // replace with your secret key

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Missing token header');
  }
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    console.log('user:', user);
    req.user = user;
    next();
  });
}

router.get("/", authenticateToken, (req, res, next) => {
  const publicFolderPath = path.join(__dirname, '..', 'temp');
  const jsonFilePath = path.join(publicFolderPath, 'userPost.json');

  const userName = req.user.username;
  const userId = req.user.userId; 
  console.log("username is" + userName);

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      next(err);
      return;
    }
  
    existingData = JSON.parse(fs.readFileSync(jsonFilePath));

    const filteredData = [];
    for (let i = 0; i < existingData.length; i++) {
      console.log("existingdata[i].userId is " + existingData[i].userId, userId);
      if (existingData[i].userId === userId) {
       
        filteredData.push(existingData[i]);
      }
    }
    
    console.log(filteredData);
    res.json(filteredData); // send data to client
  });
});

module.exports = router;
