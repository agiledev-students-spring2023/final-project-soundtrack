const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

let locationName = "";

router.post('/savedLocation', async (req, res) => {
  locationName = req.body.locationName;
  console.log(`Received location name: ${locationName}`);
  res.status(200).send('Location name received');
});

router.get("/", async (req, res, next) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // delay for 1 second
  const publicFolderPath = path.join(__dirname, '..', 'temp');
  const jsonFilePath = path.join(publicFolderPath, 'userPost.json');
  console.log("locationName is " + locationName)

  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      next(err);
      return;
    }
    existingData = JSON.parse(fs.readFileSync(jsonFilePath));

    const filteredData = [];
    for (let i = 0; i < existingData.length; i++) {
      if (existingData[i].locationName === locationName) {
        console.log(existingData[i].locationName == locationName)
        filteredData.push(existingData[i]);
      }
    }
    if (filteredData.length === 0) {
      filteredData.push({locationName: locationName});
    }
    res.json(filteredData); // send data to client
  });
});

module.exports = router;
