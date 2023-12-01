const tagsRouter2 = require("express").Router();
const Tag = require("../models/tags");

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
    const tags = await Tag.find({});
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

// Update a tag
tagsRouter2.patch("/", async (req, res) => {

});

// Delete a tag
tagsRouter2.delete("/", async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    res.status(400).json({ error: "Not logged in" });
    return;
  }

  try {
    // If the user created the tag, delete it
    const deletedTag = await Tag.deleteOne({ name: req.query.name, created_by: req.session.user._id });
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
