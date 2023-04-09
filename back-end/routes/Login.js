const express = require("express");
const router = express.Router();
const fs = require('fs');
const morgan = require("morgan");
const path = require("path");
const jwt = require("jsonwebtoken");

const usersFilePath = path.join(__dirname, "users.json");
const JWT_SECRET = "shaoxuewenlu";


router.use(express.json());

router.post("/", morgan("dev"), (req, res, next) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    const users = JSON.parse(data);
    const { username, password } = req.body;
    
    const user = users.find(user => user.username === username && user.password === password);
    //fail
    if (!user) {
      res.status(401).json({ error: "Invalid username or password." });
      return;
    }
    
    //success
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(200).json({ message: "Logged in successfully.", token });  });
});

module.exports = router;
