#!/usr/bin/env node

const express = require('express')
const app = express(); // instantiate an Express object
const cors = require("cors");
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const port = process.env.PORT || 3000 // the port to listen to for incoming requests
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data


const userRoute = require('./routes/User')
const browseRoute = require('./routes/Browse')
const friendRoute = require('./routes/Friends')
const locationProfileRoute = require('./routes/LocationProfile')
const cameraRoute = require('./routes/Camera')



app.use(cors());
app.use("/user",userRoute);
app.use("/browse",browseRoute);
app.use("/friends",friendRoute);
app.use("/locationprofile",locationProfileRoute);
app.use("/Camera",cameraRoute);




// call express's listen function to start listening to the port
const listener = app.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})
// a function to stop listening to the port
const close = () => {
  listener.close()
}

module.exports = {
  close: close,
}
//run with npx nodemon server.js