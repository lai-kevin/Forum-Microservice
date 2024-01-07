const users = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Users = require("../models/users");
const Comment = require("../models/comment");
const Questions = require("../models/questions");
const Answers = require("../models/answers");

// Create a user and store in database
users.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }
    // The typed password should not contain the username or email.
    if (
      req.body.password.includes(req.body.username) ||
      req.body.password.includes(req.body.email)
    ) {
      res
        .status(400)
        .json({ error: "Password should not contain username or email" });
      return;
    }
    const newUser = new Users({
      username: req.body.username,
      email: req.body.email,
      passwordHash: passwordHash,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    if (error.keyValue?.email) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

// Login a user
users.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = (await Users.find({ email: email }))[0];
  console.log("User: ", user);
  let verdict;
  if (user) {
    verdict = await bcrypt.compare(password, user.passwordHash);
    console.log("Verdict: ", verdict);
  }
  if (user && verdict) {
    req.session.user = user;
    res.status(200).json({ user: user });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

users.post("/logout", async (req, res) => {
  if (!req.session.user) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }
  req.session.destroy();
  res.status(200).json({ message: "Logged out" });
});

// Get users from database if admin.
users.get("/", async (req, res) => {
  try {
    // If user is not admin, return error
    if (req.session.user?.admin !== true) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const users = await Users.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

// Update a user
users.patch("/", async (req, res) => {
  res.status(500).json({ error: "Not implemented" });
});

// Delete a user if admin
users.delete("/", async (req, res) => {
  try{
    if (req.session.user?.admin !== true) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const deleted = await Users.deleteOne({ _id: req.session.user._id });
    res.status(200).json(deleted);
  } catch (error){
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

module.exports = users;
