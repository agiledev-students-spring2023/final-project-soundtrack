#!/usr/bin/env node

const mongoose = require('mongoose');
const express = require('express');
const app = express(); // instantiate an Express object
const cors = require("cors");
require('dotenv').config({ silent: true }); // load environmental variables from a hidden file named .env
const port = process.env.PORT || 3000; // the port to listen to for incoming requests

app.use(express.json()); // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })); // decode url-encoded incoming POST data

const userRoute = require('./routes/user');
const browseRoute = require('./routes/Browse');
const friendRoute = require('./routes/Friends');
const locationProfileRoute = require('./routes/LocationProfile');
const postRoute = require('./routes/Post');
const loginRoute = require('./routes/Login');
const createRoute = require('./routes/Account');
const authRoute = require('./routes/Auth');
const forgotRoute = require('./routes/Forgot');





//why it is not being read in from the .env file?


mongoose.connect(process.env.MONG_URL)
  .then(() => {
    const server = app.listen(port, function () {
      console.log(`Server running on port: ${port}`);
    });
    console.log('Connected to MongoDB...');
  })
  .catch(err => console.error(err + 'Could not connect to MongoDB...'));

app.use(cors());
const corsOptions = {
  origin: 'http://localhost:7002' // replace with your front-end's URL
};
app.use(cors(corsOptions));
app.use("/user", userRoute);
app.use("/create", createRoute);
app.use("/browse", browseRoute);
app.use("/friends", friendRoute);
app.use("/locationprofile", locationProfileRoute);
app.use("/post", postRoute);
app.use("/", loginRoute);
app.use("/auth", authRoute);
app.use("/forgot", forgotRoute);



// a function to stop listening to the port
const close = () => {
  server.close();
};

module.exports = { app, close };
