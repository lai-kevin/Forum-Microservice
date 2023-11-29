const questionsRouter2 = require("express").Router();
const Question = require("../models/questions");
const {
  getTagWithName,
  createTag,
  getAllQuestions,
  searchQuestions,
  getQuestionsOfTagId,
  getQuestionById,
} = require("./helpers");

// Create an question and store in database
questionsRouter2.post("/", async (req, res) => {
  
});

// Get question(s) database.
questionsRouter2.get("/", async (req, res) => {
  
});

// Update a question
questionsRouter2.patch("/", async (req, res) => {
  
});

// Delete a question
questionsRouter2.delete("/", async (req, res) => {
  
});

module.exports = questionsRouter2;
