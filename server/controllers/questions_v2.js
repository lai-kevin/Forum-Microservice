const questionsRouter2 = require("express").Router();
const Question = require("../models/questions");
const Tag = require("../models/tags");
const Answer = require("../models/answers");
const Comment = require("../models/comment");
const questions = require("../models/questions");
const axios = require("axios");
const User = require("../models/users");

// Create an question and store in database
questionsRouter2.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { title, summary, question_text, tag_strings } = req.body;

    // Check if tags exist in database, if not, create them
    let tags = [];
    tags = await Promise.all(
      tag_strings.map(async (tag_string) => {
        const tag = await Tag.findOne({ name: tag_string });
        if (tag) {
          return tag.id;
        } else {
          const newTag = new Tag({
            name: tag_string,
            created_by: req.session.user._id,
          });
          const savedTag = await newTag.save();
          if (!savedTag) {
            return res.status(400).json({ error: "Could not save tag" });
          }
          console.log(savedTag);
          return savedTag.id;
        }
      })
    );

    console.log(tags);
    const question = new Question({
      title: title,
      summary: summary,
      text: question_text,
      tags: tags,
      asked_by: req.session.user._id,
    });
    const savedQuestion = await question.save();
    if (!savedQuestion) {
      return res.status(400).json({ error: "Could not save question" });
    }
    return res.status(201).json(savedQuestion);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal server error", json: error });
  }
});

// Get question(s) database.
questionsRouter2.get("/", async (req, res) => {
  try {
    const { question_id, tag } = req.query;

    // If question_id is present, return that question
    if (question_id) {
      const question = await Question.findById(question_id).populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.status(200).json(question);
    }

    // If tag is present, return questions with that tag
    if (tag) {
      let questions = await Question.find({ tags: { $in: [tag] } }).populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
      return res.status(200).json(questions);
    }

    // If no query parameters are present, return all questions
    let questions = await Question.find({})
      .sort({ posted_time: -1 })
      .populate([
        "tags",
        "answers",
        "asked_by",
        "comments",
        {
          path: "comments",
          populate: {
            path: "posted_by",
            model: "User",
          },
        },
      ]);
    return res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update a question
questionsRouter2.patch("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { question_id, title, text, tags } = req.body;

  const updateFields = {};
  if (title) {
    updateFields.title = title;
  }
  if (text) {
    updateFields.text = text;
  }
  if (tags) {
    updateFields.tags = tags;
  }
  const question = await Question.findOneAndUpdate(
    { _id: question_id, asked_by: req.session.user._id },
    updateFields,
    { new: true }
  );
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }
  return res.status(200).json(question);
});

// Delete a question
questionsRouter2.delete("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { question_id } = req.query;
    const question = await Question.findOneAndDelete({
      _id: question_id,
      asked_by: req.session.user._id,
    });
    console.log(req.session.user._id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

questionsRouter2.patch("/view", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { question_id } = req.query;
    const question = await Question.findOneAndUpdate(
      { _id: question_id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.status(200).json({ messsage: "Success", views: question.views });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

questionsRouter2.patch("/upvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Update question votes
    const { question_id } = req.query;
    let question = await Question.findOne({ _id: question_id });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    // Remove user ID from downvotes set if already present
    if (question.votes.includes(req.session.user._id)) {
      question = await Question.findOneAndUpdate(
        { _id: question_id },
        { $pull: { votes: req.session.user._id } },
        { new: true }
      );
      if (question) {
        // Increment user repuation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -5 } },
          { new: true }
        );
      }
    } else {
      // Add user ID to votes set if not already present
      question = await Question.findOneAndUpdate(
        { _id: question_id },
        {
          $pull: { downvotes: req.session.user._id },
          $addToSet: { votes: req.session.user._id },
        },
        { new: true }
      );
      if (question) {
        // Increment user repuation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 5 } },
          { new: true }
        );
      }
    }

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      messsage: "Success",
      votes: question.votes.length - question.downvotes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

questionsRouter2.patch("/downvote", async (req, res) => {
  try {
    if (!req.session.user || req.session.user.reputation < 50) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Update question votes
    const { question_id } = req.query;
    let question = await Question.findOne({ _id: question_id });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Remove user ID from votes set if already present
    if (question.downvotes.includes(req.session.user._id)) {
      question = await Question.findOneAndUpdate(
        { _id: question_id },
        { $pull: { downvotes: req.session.user._id } },
        { new: true }
      );
      if (question) {
        // Increment user reputation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: 10 } },
          { new: true }
        );
      }
    } else {
      // Add user ID to votes set if not already present
      question = await Question.findOneAndUpdate(
        { _id: question_id },
        {
          $pull: { votes: req.session.user._id },
          $addToSet: { downvotes: req.session.user._id },
        },
        { new: true }
      );
      if (question) {
        // Decrement user reputation
        const user = await User.findOneAndUpdate(
          { _id: req.session.user._id },
          { $inc: { reputation: -10 } },
          { new: true }
        );
      }
    }

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      messsage: "Success",
      votes: question.votes.length - question.downvotes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = questionsRouter2;
