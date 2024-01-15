const PostModel = require("../models/Post");

exports.createPost = async (post) => {
  return await PostModel.create(post);
};
exports.getAllPost = async () => {
  return await PostModel.count();
};
exports.getAllPostPaginate = async (skip, limit) => {
  return await PostModel.find()
    .populate({ path: "author", select: "username" })
    .skip(skip)
    .limit(limit);
};
exports.getPostById = async (id) => {
  return await PostModel.findById(id);
};
exports.deletePost = async (id) => {
  return await PostModel.findOneAndRemove(id);
};
exports.updatePost = async (id, post) => {
  return await PostModel.findByIdAndUpdate(id, post);
};
