const answersRouter2 = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");

// Create an answer and store in database
answersRouter2.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    var newAnswer = new Answer({
      text: req.body.text,
      ans_by: req.session.user._id,
    });

    const savedAnswer = await newAnswer.save();

    // Push the answer into its question
    const update = await Question.findOneAndUpdate(
      { _id: req.body.question_id },
      { $push: { answers: newAnswer._id } },
      { new: true }
    );
    if(!update) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Successfully saved answer", answer: savedAnswer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save answer to database" });
  }
});

// Get answer(s) of question database.
answersRouter2.get("/", async (req, res) => {
  try {
    const question_id = req.query.question_id;
    const questionWithAnswers = await Question.findOne({ _id: question_id }).populate({
      path: "answers",
      populate: {
        path: "ans_by",
        model: "User"
      }
    });
    res.status(200).json(questionWithAnswers.answers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve answers from database" });
  }
});

// Update an answer
answersRouter2.patch("/", async (req, res) => {});

// Delete an answer
answersRouter2.delete("/", async (req, res) => {
  if(!req.session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try{
    const deletedAnswer = await Answer.deleteOne({ _id: req.body.answer_id });
    if(!deletedAnswer) {
      res.status(404).json({ error: "Answer not found" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete answer from database" });
  }
});

module.exports = answersRouter2;
