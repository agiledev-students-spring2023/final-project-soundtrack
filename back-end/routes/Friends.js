const express = require("express"); 
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 

const User = require('../models/User');
const Social = require("../models/Social");

const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');

//get a list of all of a user's friends
// router.get("/friendlist", authenticateToken, (req, res, next) => {
//   const user = req.user;

//   //mock data
//   axios
//     .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
//     .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
//     .catch(err => next(err)) // pass any errors to express
// });


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
router.get("/getfriendrequests", authenticateToken, async (req, res, next) => {
  try{
    const userId = req.user.id;

    Social.find({toUserId: req.user.id})
      .then((incomingRequests) => {
        for (let i = 0; i < incomingRequests.length; i++) {
          console.log("Friend request number "+ i + " is coming from userId "+ incomingRequests[i].fromUserId);
        }
        console.log(incomingRequests);
        res.json({incomingRequests});
      });
    

    //return list of friend requests (mock data for now)
    // axios
    //   .get("https://my.api.mockaroo.com/browse.json?key=d0d8c110")
    //   .then(apiResponse => res.json(apiResponse.data)) // pass data along directly to client
    //   .catch(err => next(err)) // pass any errors to express
  } catch(error) {
    res.status(500).send("Error processing query");
  }
});

//post new friend request
router.post("/newfriendrequest", authenticateToken, async (req, res, next) => {
  try{
    //format checks
    const toUser = req.body.toUser;

    if(!toUser) {
        return res.status(400).send("Malformed query (toUser not specified)");
    }


    //check to make sure the user you're sending a request to exists
    const requestedFriend = await User.findOne({ userName: toUser });
    if (!requestedFriend) {
      return res.status(409).send("User does not exist");
    }

    //can't request again if you already have a pending one
    const existingRequest = await Social.findOne({ toUserId: requestedFriend.userId });
    if (existingRequest) {
      return res.status(409).send("This request already exists");
    }

    //can't send a request to someone if that someone has already sent you one
    const existingReceivedRequest = await Social.findOne({ fromUserId: requestedFriend.userId, toUserId: req.user.id });
    if (existingReceivedRequest) {
      return res.status(409).send("This request already exists");
    }

    //can't request yourself
    if(req.user.id == requestedFriend.userId) {
      return res.status(409).send("You can't request to be friends with yourself");
    }

    //TODO: make sure the requested user is not already a friend


    //make our request json with the data we now are guaranteed to have
    const newSocialRequest = new Social({
      fromUserId: req.user.id,
      toUserId: requestedFriend.userId
    })
    
    //save to database
    const savedRequest = await newSocialRequest.save();
    
    //send back the good word
    res.status(200).send("Successfully processed friend request");
  } catch(error) {
    //otherwise something went wrong
    res.status(500).send("Error processing friend request");
  }
});

//reject existing friend request
router.delete("/rejectfriendrequest", authenticateToken, async (req, res, next) => {
  try{
    //auth needs to match decidingUser
    const decidingUserId = req.user.id;
    const fromUserId = req.body.fromUserId;
    if(!fromUserId) {
        return res.status(400).send("Malformed query (requestId not specificed)");
    }
    //update friend request to rejected, delete from database
    console.log("Trying to delete from: "+ fromUserId+" to our user, :"+decidingUserId);
    await Social.deleteOne({fromUserId: fromUserId, toUserId: decidingUserId});

    res.status(200).send("Successfully rejected friend request");
  } catch(error) {
    console.log(error);
    res.status(500).send("Error processing friend request rejection");
  }
});



module.exports = router;


