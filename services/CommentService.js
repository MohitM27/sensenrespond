const CommentModel = require("../models/Comment");

exports.createComment = async (comment) => {
  return await CommentModel.create(comment);
};
exports.getAllComment = async (postId) => {
  return await CommentModel.find({ postId }).populate({
    path: "author",
    select: "username",
  });
};
