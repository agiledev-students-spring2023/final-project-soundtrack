const express = require("express"); 
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 

const secretKey = "shaoxuewenlu"
const jwt = require('jsonwebtoken');

//get a list of all of a user's friends
router.get("/friendlist", authenticateToken, (req, res, next) => {
  const user = req.user;

  //mock data
  axios
    .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
    .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
    .catch(err => next(err)) // pass any errors to express
});


//auth function (for editing friend requests)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Missing token header');
  }
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    console.log('user:', user);
    req.user = user;
    next();
  });
}

//get all friend requests for  a user
router.get("/getfriendrequests", authenticateToken, (req, res, next) => {
  try{
    const user = req.user;

    //return list of friend requests (mock data for now)
    axios
      .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
      .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
      .catch(err => next(err)) // pass any errors to express
  } catch(error) {
    res.status(500).send("Error processing query");
  }
});

//post new friend request
router.post("/newfriendrequest", authenticateToken, (req, res, next) => {
  try{
    const fromUser = req.user;
    const toUser = req.query.toUser;
    if(!toUser) {
        return res.status(400).send("Malformed query (toUser not specified)");
    }
    //send friend request
    res.status(200).send("Successfully processed friend request");
  } catch(error) {
    res.status(500).send("Error processing friend request");
  }
});

//reject existing friend request
router.post("/rejectfriendrequest", authenticateToken, (req, res, next) => {
  try{
    //auth needs to match decidingUser
    const decidingUser = req.user;
    const requestId = req.query.requestId;
    if(!requestId) {
        return res.status(400).send("Malformed query (requestId not specificed)");
    }
    //update friend request to rejected, delete from database
    res.status(200).send("Successfully rejected friend request");
  } catch(error) {
    res.status(500).send("Error processing friend request rejection");
  }
});

//accept existing friend request
router.post("/acceptfriendrequest", authenticateToken, (req, res, next) => {
  try{
    const decidingUser = req.user;
    const requestId = req.query.requestId;
    if(!requestId) {
        return res.status(400).send("Malformed query (requestId not specificed)");
    }
    //update friend request to rejected, delete from database
    res.status(200).send("Successfully accepted friend request");
  } catch(error) {
    res.status(500).send("Error processing friend request acceptance");
  }
});


module.exports = router;


