const answersRouter2 = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");

// Create an answer and store in database
answersRouter2.post("/", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    var newAnswer = new Answer({
      text: req.body.text,
      ans_by: req.session.user._id,
    });

    const savedAnswer = await newAnswer.save();

    // Push the answer into its question
    await Question.findOneAndUpdate(
      { _id: req.body.question_id },
      { $push: { answers: newAnswer._id } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Successfully saved answer", answer: savedAnswer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save answer to database" });
  }
});

// Get answer(s) database.
answersRouter2.get("/", async (req, res) => {});

// Update an answer
answersRouter2.patch("/", async (req, res) => {});

// Delete an answer
answersRouter2.delete("/", async (req, res) => {});

module.exports = answersRouter2;
