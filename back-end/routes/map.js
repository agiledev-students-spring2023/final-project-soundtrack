const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Route to get public posts within bounds
router.get("/", async function (req, res) {
  const { bounds } = req.query;
  const [swLat, swLng, neLat, neLng] = bounds.split(",");
  console.log(swLat, swLng, neLat, neLng)
  try {
    const posts = await Post.find({
      privacy: 'Public',
      locationName: { $exists: true, $type: 'object' },
    });
    const filteredPosts = posts.filter(post => {
      const lat = post.locationName.geo.location.lat;
      const lng = post.locationName.geo.location.lng;
      if (lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng) {
        return true; // Keep the post in the filtered array
      } else {
        return false; // Remove the post from the filtered array
      }
    });
    
    res.json({ posts: filteredPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;











  
//   try {
//     const swLat = ;
//     const posts = await Post.find({
//     $and: [
//     { privacy: 'Public' },
//     { locationName: { $exists: true, $type: 'object' } },
//     { $expr: { $gt: ['$locationName.geo.location.lat', swLat] } }
//   ]
// });
//     res.json({ posts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// //40.73265
// //40.7288174