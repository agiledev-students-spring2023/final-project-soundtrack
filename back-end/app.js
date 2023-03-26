require('dotenv').config({ silent: true });
// import and instantiate express
const express = require("express"); 
const axios = require("axios");
const cors = require("cors");

const app = express() // instantiate an Express object/server
app.use(cors());

module.exports = app;

app.get("/", (req, res) => {
    res.send("thanks !")
  })

app.get("/user", (req, res, next) => {
    // use axios to make a request to an API for animal data
    axios
      .get("https://my.api.mockaroo.com/user.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

app.get("/browse", (req, res, next) => {
    // use axios to make a request to an API for animal data
    axios
      .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

app.get("/locationprofile", (req, res, next) => {
    // use axios to make a request to an API for animal data
    axios
      .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

app.get("/friends", (req, res, next) => {
    // use axios to make a request to an API for animal data
    axios
      .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  })

