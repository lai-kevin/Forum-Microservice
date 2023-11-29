// Tag Document Schema

const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

tagSchema.virtual("url").get(function() {
  return `posts/tag/${this._id}`;
});


module.exports = mongoose.model("Tag", tagSchema);