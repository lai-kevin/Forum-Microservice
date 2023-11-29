const answersRouter = require("express").Router();
const Answer = require("../models/answers");
const Question = require("../models/questions");

//Create an answer and store in database
answersRouter.post("/", async (req, res) => {
  try {
    var newAnswer = new Answer({
      text: req.body.text,
      ans_by: req.body.ans_by,
      ans_date_time: req.body.ans_date_time,
    });

    const savedAnswer = await newAnswer.save();

    // Push the answer into its question
    await Question.findOneAndUpdate(
      { _id: req.body.question_id },
      { $push: { answers: newAnswer._id } },
      { new: true }
    )

    res
      .status(200)
      .json({ message: "Successfully saved answer", answer: savedAnswer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save answer to database" });
  }
});

// Get all answers from database.
// If question_id is defined in query params, get only the answers associated with question_id
answersRouter.get("/", async (req, res) => {
  try {
    const question_id = req.query.question_id;
    if (question_id) {
      Question.findById(question_id)
        .then(async (question) => {
          const answerPromises = question.answers.map(
            async (answerObjectId) => {
              return await Answer.find({ _id: answerObjectId });
            }
          );
          return await Promise.all(answerPromises);
        })
        .then((result) => {
          result = result.flat();
          res
            .status(200)
            .json({ message: "Found answers for question", answers: result });
        });
    } else {
      Answer.find().then((answers) => {
        res.status(200).json(answers);
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Failed to get answers from database.",
    });
  }
});

module.exports = answersRouter;
