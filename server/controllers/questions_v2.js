const questionsRouter2 = require("express").Router();
const Question = require("../models/questions");

// Create an question and store in database
questionsRouter2.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const { title, question_text, tags } = req.body;
    const question = new Question({
      title: title,
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
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get question(s) database.
questionsRouter2.get("/", async (req, res) => {
  try {
    const { question_id, tag, page } = req.query;
    const options = {
      lean: true,
      limit: 10,
      page: page || 1,
      forceCountFn: true,
    };

    // If question_id is present, return that question
    if (question_id) {
      const question = await Question.findById(question_id);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      return res.status(200).json(question);
    }

    // If tag is present, return questions with that tag
    if (tag) {
      const questions = await Question.paginate(
        { tags: { $in: [tag] } },
        options
      );
      return res.status(200).json(questions);
    }

    // If no query parameters are present, return all questions
    const questions = await Question.paginate({}, options);
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
    const { question_id } = req.params;
    const question = await Question.findOneAndDelete({
      _id: question_id,
      asked_by: req.session.user._id,
    });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = questionsRouter2;
