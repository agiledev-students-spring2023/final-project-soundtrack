const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');



router.post('/saveImage', (req, res) => {
  try {
    const imageURL = req.body.imageURL;

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
   
    existingData[0].ImageURL = imageURL;
    

    // Write the updated data to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));

    console.log(`Successfully added post item with image URL ${imageURL} to ${jsonFilePath}`);
    
    res.status(200).send("Image saved successfully!");
  } catch (error) {
    console.error(`Error saving image: ${error}`);
    res.status(500).send("Error saving image!");
  }
});

module.exports = router;
