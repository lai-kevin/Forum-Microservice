const tagsRouter = require("express").Router();
const Tag = require("../models/tags");
const { getTagWithName, createTag, getAllTags, getTagsOfQuestionID } = require("./helpers");

// Create a tag and store to database
tagsRouter.post("/", async (req, res) => {
  try {
    const savedTag = await createTag(req.body.name)
    res.status(200).json({ message: "Successfully saved tag", tag: savedTag });
  } catch (error) {
    res.status(500).json({ message: "Failed to save answer to database" });
  }
});

// Get all tags from database. 
// If name is specified in query params, get only that tag associated with the name
// If question_id is specified in query params, get the tags of the question_id
tagsRouter.get("/", async (req, res) => {
  try {
    const name = req.query.name;
    const question_id = req.query.question_id;
    if (name) {
      const tag = await getTagWithName(name);
      res
        .status(200)
        .json({ message: `Found tag with name: ${name}`, tag: tag });
    } else if (question_id) {
      var tags = await getTagsOfQuestionID(question_id);
      res
        .status(200)
        .json(tags);
    } else {
      getAllTags().then((tags) => {
        res.status(200).json(tags);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Failed to get tags from database.",
    });
  }
});

module.exports = tagsRouter;
