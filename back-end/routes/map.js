const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const Post = require("../models/post");

// // Route to update locations
// router.get("/updateLocations", async function (req, res) {
//   try {
//     const posts = await Post.find({});
//     posts.forEach(async (post) => {
//       const locationName = post.locationName;
//       const existingLocation = await Location.findOne({
//         "locationName.placeId": locationName.placeId,
//       });
//       if (!existingLocation) {
//         const newLocation = new Location({
//           locationName: locationName,
//           songTitle: post.songTitle,
//         });
//         await newLocation.save();
//       }
//     });
//     res.json({ message: "Locations updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// Route to get public posts within bounds
router.get("/", async function (req, res) {
  const { bounds } = req.query;
  const [swLat, swLng, neLat, neLng] = bounds.split(",");
  console.log(swLat, swLng, neLat, neLng)
  try {
    const posts = await Location.find({
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