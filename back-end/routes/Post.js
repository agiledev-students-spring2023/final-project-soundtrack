
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const secretKey = "shaoxuewenlu"
const jwt = require('jsonwebtoken');




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

router.post('/savePost', authenticateToken, (req, res) => {
  try {
    const post = req.body.postItem;
    console.log({post});

    const userName = req.user.username;
    console.log("username is " + userName);
    const userId = req.user.userId;
    console.log('id:', userId); // Extract user ID from token
    // Construct the path to the JSON file
    const publicFolderPath = path.join(__dirname, '..', 'temp');
    const jsonFilePath = path.join(publicFolderPath, 'userPost.json');
    
    // Read the existing data from the JSON file, if any
    let existingData = [];
    try {
      existingData = JSON.parse(fs.readFileSync(jsonFilePath));
    } catch (err) {
      // The file may not exist yet, or it may be invalid JSON
      console.error(`Error reading JSON file: ${err}`);
    }



    existingData.push({ ...post, userId,userName });
    // Write the updated data to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));

    console.log(`Successfully added post to temp folder`);
    res.status(200).send(userName + " has successfully created a post");
  } catch (error) {
    console.error(`Error saving post: ${error}`);
    res.status(500).send("Error saving post!");
  }
});


module.exports = router;