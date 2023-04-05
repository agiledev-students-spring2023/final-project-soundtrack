const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Endpoint to fetch image URL

router.get("/", (req, res) => {
    res.send("Goodbye world!")
  })



router.get('/fetchtmpdata', (req, res) => {
  try {
    // Construct the path to the JSON file
    const publicFolderPath = path.join(__dirname, '..', 'temp');
    const jsonFilePath = path.join(publicFolderPath, 'post-item-storage.json');

    // Read the existing data from the JSON file
    const existingData = JSON.parse(fs.readFileSync(jsonFilePath));

    // Return the image URL
    const imageURL = existingData[0].ImageURL;
    const songTitle = existingData[0].SongTitle; 
    res.json({imageURL, songTitle });
  } catch (error) {
    console.error(`Error fetching image or Song: ${error}`);
    res.status(500).send("Error fetching image or Song!");
  }
});



router.post('/savePrivacy', (req, res) => {
    try {
      const privacy = req.body.privacy;
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
        existingData[0].Privacy = privacy;
      // Write the updated data to the JSON file
       fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
  
      console.log(`Successfully added privacy to temp folder`);
      
      res.status(200).send("privacy saved successfully!");
    } catch (error) {
      console.error(`Error saving privacy: ${error}`);
      res.status(500).send("Error privacy!");
    }
  });




module.exports = router;