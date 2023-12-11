// Answer Document Schema
const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  ans_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  posted_time: {
    type: Date,
    default: Date.now,
  },
});

answerSchema.virtual("url").get(function() {
  return `posts/answer/${this._id}`;
});

module.exports = mongoose.model("Answer", answerSchema);
