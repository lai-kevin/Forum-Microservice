const users = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");

// Create an answer and store in database
users.post("/", async (req, res) => {
  
});

// Get answer(s) database.
users.get("/", async (req, res) => {
  
});

// Update an answer
users.patch("/", async (req, res) => {
  
});

// Delete an answer
users.delete("/", async (req, res) => {
  
});


module.exports = users;
