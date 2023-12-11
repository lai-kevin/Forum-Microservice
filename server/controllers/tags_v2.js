const tagsRouter2 = require("express").Router();
const Tag = require("../models/tags");
const Question = require("../models/questions");

// Create an tag and store in database
tagsRouter2.post("/", async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }

  try {
    const newTag = new Tag({
      name: req.body.name,
      created_by: req.session.user._id,
    });
    const savedTag = await newTag.save();
    res.status(200).json({ message: "Successfully saved tag", tag: savedTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save tag to database" });
  }
});

// Get tag(s) database.
tagsRouter2.get("/", async (req, res) => {
  try {
    let response = {};

    // If tag name is present, return that tag
    if(req.query.tag_name){
      response = await res.status(200).json(await Tag.findOne({ name: req.query.tag_name }));
    } else {
      const tags = await Tag.find({});
      response = res.status(200).json(await Tag.find({}));
    }
    return response;
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

// Update a tag
tagsRouter2.patch("/", async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }

  try {
    // If the user created the tag, update it
    const updatedTag = await Tag.updateOne(
      { _id: req.body.tag_id, created_by: req.session.user._id },
      { name: req.body.name}
    );
    if (updatedTag) {
      res.status(200).json({ message: "Successfully updated tag" });
    } else {
      res.status(400).json({ message: "Failed to update tag" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update tag in database" });
  }
});

// Delete a tag
tagsRouter2.delete("/", async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }

  try {
    // Find all questions with the tag in its tags array and not posted by the user
    const questions = await Question.find({ asked_by: { $ne: req.session.user._id } }).populate([
      "tags",
    ]);
    
    console.log(questions)
    if (questions.length > 0) {
      res.status(400).json({ message: "Failed to delete tag. Tag is used in questions not created by you" });
      return;
    }
    // If the user created the tag, delete it
    const deletedTag = await Tag.deleteOne({ name: req.query.tag_name, created_by: req.session.user._id });
    console.log(deletedTag);
    if (deletedTag.deletedCount === 1) {
      res.status(200).json({ message: "Successfully deleted tag" });
    } else {
      res.status(400).json({ message: "Failed to delete tag" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tag from database" });
  }
});


module.exports = tagsRouter2;
