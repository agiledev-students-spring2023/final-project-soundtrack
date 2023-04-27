const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Route to get public posts within bounds
router.get('/', async function(req, res) {
  const { bounds } = req.query;
  const [swLat, swLng, neLat, neLng] = bounds.split(',');
  try {
    const posts = await Post.find({
      privacy: 'Public',
      locationName: { $exists: true, $type: 'object' },
     // 'locationName.geo.location.lat': { $gte: swLat, $lte: neLat },
      //'locationName.geo.location.lng': { $gte: swLng, $lte: neLng }
    });
    const locationNames = posts.map(post => post.locationName);
    res.json({ locationNames });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
