// Question Document Schema
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 100,
    required: true,
  },
  text: {
    type: String,
  },
  tags: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    }],
    validate: {
      validator: function(tags) {
        // Ensure at least one Tag ObjectId is present in the array
        console.log(tags)
        return tags.length >= 1;
      },
      message: 'At least one tag is required.'
    }
  },
  answers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    }],
    default: [],
  },
  comments: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }],
    default: [],
  },
  asked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  posted_time: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

questionSchema.virtual("url").get(function() {
  return `posts/question/${this._id}`;
});

module.exports = mongoose.model("Question", questionSchema);
