// Answer Document Schema
const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  ans_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
