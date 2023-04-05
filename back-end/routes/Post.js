const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');




// route for HTTP GET requests to the root document
router.get("/savePost", (req, res) => {
    res.send("Goodbye world!")
  })



router.post('/savePost', (req, res) => {
    try {
      const post = req.body.postItem;
      // Construct the path to the JSON file
      const publicFolderPath = path.join(__dirname, '..', 'temp');
      const jsonFilePath = path.join(publicFolderPath, 'post-item-storage.json');
      
      // Read the existing data from the JSON file, if any
      let existingData = [];
      try {
        existingData = JSON.parse(fs.readFileSync(jsonFilePath));
      } catch (err) {
        // The file may not exist yet, or it may be invalid JSON
        console.error(`Error reading JSON file: ${err}`);
      }

      existingData.push(post);
      // Write the updated data to the JSON file
      fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
  
      console.log(`Successfully added songTitle to temp folder`);
      res.status(200).send("songTitle saved successfully!");
    } catch (error) {
      console.error(`Error saving songTtile: ${error}`);
      res.status(500).send("Error songTitle!");
    }
  });

module.exports = router;
