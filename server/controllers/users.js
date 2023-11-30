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

// Login a user
users.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await Users.find({ email: email }))[0];
    console.log("User: ", user);
    const verdict = await bcrypt.compare(password, user.passwordHash);
    console.log("Verdict: ", verdict);
    if (verdict) {
        req.session.user = user;
        res.json({ user: user });
    } else {
        res.json({ user: null });
    }
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
