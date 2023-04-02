#!/usr/bin/env node
import express, { json, urlencoded } from 'express';
const app = express(); // instantiate an Express object
import cors from "cors";
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const port = process.env.PORT || 3000 // the port to listen to for incoming requests
app.use(json()) // decode JSON-formatted incoming POST data
app.use(urlencoded({ extended: true })) // decode url-encoded incoming POST data


import userRoute from './routes/User';
import browseRoute from './routes/Browse';
import friendRoute from './routes/Friends';
import locationProfileRoute from './routes/LocationProfile';


app.use(cors());
app.use("/user",userRoute);
app.use("/browse",browseRoute);
app.use("/friends",friendRoute);
app.use("/locationprofile",locationProfileRoute);




// call express's listen function to start listening to the port
const listener = app.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})
// a function to stop listening to the port
const close = () => {
  listener.close()
}

export const close = close;
//run with npx nodemon server.js