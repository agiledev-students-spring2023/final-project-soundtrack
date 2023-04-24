const express = require("express"); 
const router = express.Router();
const axios = require("axios");
const morgan = require("morgan") 

const Relationship = require("../models/Relationship");

const secretKey = "shaoxuewenlu"
const jwt = require('jsonwebtoken');


//auth function
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


//Add new relationship to the database
//we don't check for if it already exists, because the burden of that is on the friends model
router.post("/newrelationship", authenticateToken, async (req, res, next) => {
    try{
        //format check
        console.log(req.body.userAId+" AND "+req.body.userBId);

        if(!req.body.userAId || !req.body.userBId) {
            return res.status(400).send("Malformed query (user(s) not specified)");
        }   
  
        //make our request json with the data we now are guaranteed to have
        const relationshipToPost = new Relationship({
            userAId: req.body.userAId,
            userBId: req.body.userBId,
        })
        
        //save to database
        const savedRelationshipToPost = await relationshipToPost.save();
        
        //send back the good word
        res.status(200).send("Successfully processed request");
    } catch(error) {
        //otherwise something went wrong
        console.log(error);
        res.status(500).send("Error processing request");
    }
});



//get all a given user's friends IDs
router.get("/getfriends", authenticateToken, async (req, res, next) => {
    try{
        const queryUserId = req.user.id;

        //find relationships where this user is either userA or userB
        Relationship.find({$or:[{userAId: queryUserId},{userBId: queryUserId}]})
            .then((friendsList) => {
                // console.log("Sending:" + friendsList); //debug
                res.json({friendsList});
            });
        
        
    } catch(error) {
        res.status(500).send("Error processing query");
        console.log(error);
    }
});



module.exports = router;


