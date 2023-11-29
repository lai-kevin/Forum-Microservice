const tagsRouter2 = require("express").Router();
const Tag = require("../models/tags");
const { getTagWithName, createTag, getAllTags, getTagsOfQuestionID } = require("./helpers");

// Create an answer and store in database
tagsRouter2.post("/", async (req, res) => {
  
});

// Get answer(s) database.
tagsRouter2.get("/", async (req, res) => {
  
});

// Update an answer
tagsRouter2.patch("/", async (req, res) => {
  
});

// Delete an answer
tagsRouter2.delete("/", async (req, res) => {
  
});

module.exports = tagsRouter2;
