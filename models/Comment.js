const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  postId: {type: Schema.Types.ObjectId, ref: 'Post'},
  content: String,
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
