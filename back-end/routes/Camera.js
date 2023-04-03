const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/saveImage', (req, res) => {
  try {
    const imageName = req.body.image;
    const imagePath = path.join(__dirname, '..', 'public', imageName);

    // Decode base64 image and save to public folder


    return res.json({
      imagePath: imagePath, 
      status: 'Image saved successfully',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err,
      status: 'Failed to save image',
    });
  }
});

module.exports = router;
