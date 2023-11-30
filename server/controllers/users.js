const users = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Users = require("../models/users");

// Create a user and store in database
users.post("/register", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = new Users({
        username: req.body.username,
        email: req.body.email,
        passwordHash: passwordHash,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.json(savedUser);
});

// Get user from database.
users.get("/", async (req, res) => {
  if (req.session.user){
    res.json({user: req.session.user})
  } else {
    res.json({user: null})
  }
});

// Update an answer
users.patch("/", async (req, res) => {
  
});

// Delete an answer
users.delete("/", async (req, res) => {
  
});


module.exports = users;
