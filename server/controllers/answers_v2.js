const answersRouter2 = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require("../models/users");

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
      populate: [
        {
          path: "ans_by",
          model: "User"
        },
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User"
          }
        }
      ]
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

answersRouter2.patch("/upvote", async (req, res) => {
  try {
    if (!req.session.user  || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update question votes
    const { answer_id } = req.query;
    const answer = await Answer.findOneAndUpdate(
      { _id: answer_id },
      { $pull: { downvotes: req.session.user._id }, $addToSet: { votes: req.session.user._id } },
      { new: true }
      );
    
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Increment user repuation
    const user = await User.findOneAndUpdate(
      { _id: req.session.user._id },
      { $inc: { reputation: 5 } },
      { new: true }
    );

    console.log(answer);
    return res.status(200).json({ messsage: "Success", votes: answer.votes.length - answer.downvotes.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

answersRouter2.patch("/downvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Update answer votes
    const { answer_id } = req.query;
    const answer = await Answer.findOneAndUpdate(
      { _id: answer_id },
      { $pull: { votes: req.session.user._id }, $addToSet: { downvotes: req.session.user._id } },
      { new: true }
    );

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Decrement user reputation
    const user = await User.findOneAndUpdate(
      { _id: req.session.user._id },
      { $inc: { reputation: -10 } },
      { new: true }
    );

    return res.status(200).json({ messsage: "Success", votes: answer.votes.length - answer.downvotes.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = answersRouter2;
