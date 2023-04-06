const express = require("express");
const router = express.Router();
const fs = require('fs');
const morgan = require("morgan");
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");

router.use(express.json());

router.get("/", morgan("dev"), (req, res, next) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    const users = JSON.parse(data);
    res.json(users);
  });
});

router.post("/", morgan("dev"), (req, res, next) => {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    const users = JSON.parse(data);
    const newUser = req.body;
    
    const existingUser = users.find(user => user.username === newUser.username);
    if (existingUser) {
      res.status(400).json({ error: "Username already exists. Please choose a different username." });
      return;
    }
    
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    newUser.id = id;
    
    users.push(newUser);
    fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.status(201).end();
    });
  });
});

module.exports = router;
