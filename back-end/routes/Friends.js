
const express = require("express"); 
const router = express.Router();
const axios = require("axios");



router.get("/", (req, res, next) => {
    // use axios to make a request to an API for animal data
    axios
      .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

  module.exports = router;