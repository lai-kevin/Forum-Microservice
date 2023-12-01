const commentsRouter = require("express").Router();
const Comment = require("../models/comment");
const Answer = require("../models/answers");
const Question = require("../models/questions");
// Create a comment and store in database
commentsRouter.post("/", async (req, res) => {
  if (!req.session.user){
    res.status(401).json({ message: "You must be logged in to comment" });
    return;
  }

  try {
    const answer_id = req.body.answer_id;
    const question_id = req.body.question_id;
    const newComment = new Comment({
      text: req.body.text,
      posted_by: req.body.comment_by,
    });
    const savedComment = await newComment.save();

    // Push the comment into its answer if answer is defined
    if (answer_id) {
      const update = await Answer.findOneAndUpdate(
        { _id: answer_id },
        { $push: { comments: newComment._id } },
        { new: true }
      );
      if (update) res.status(200).json({ message: "Successfully saved comment", comment: savedComment });
      return;
    }
    // Push the comment into its question if question is defined
    if (question_id) {
      const update = await Question.findOneAndUpdate(
        { _id: question_id },
        { $push: { comments: newComment._id } },
        { new: true }
      );
      if (update) res.status(200).json({ message: "Successfully saved comment", comment: savedComment });
      return;
    }
    res.status(400).json({ message: "Error saving comment" });
  } catch (error) {
    res.status(500).json({ message: "Error saving comment", error: error.message });
  }
});

// Get comment(s) database.
commentsRouter.get("/", async (req, res) => {});

// Update a comment
commentsRouter.patch("/", async (req, res) => {});

// Delete a comment
commentsRouter.delete("/", async (req, res) => {});

module.exports = commentsRouter;
