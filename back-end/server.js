#!/usr/bin/env node
const server = require("./app") // load up the web server
require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const port = process.env.PORT || 3000 // the port to listen to for incoming requests
// call express's listen function to start listening to the port
const listener = server.listen(port, function () {
  console.log(`Server running on port: ${port}`)
})
// a function to stop listening to the port
const close = () => {
  listener.close()
}

server.get("/", (req,res) => {
    res.send("hello world");
})

module.exports = {
  close: close,
}
//run with npx nodemon server.js