const ObjectId = require("mongoose").Types.ObjectId;
const postService = require("../services/PostService");

exports.list = async (req, res, next) => {
  try {
    let { offset, limit } = req.query;

    req.query.offset = offset || 0;
    req.query.limit = limit || 10;
    const totalRecords = await postService.getAllPost();
    if (totalRecords) {
      const list = await postService.getAllPostPaginate(
        req.query.offset,
        req.query.limit
      );

      let limit = Number(req.query.limit);
      let offset = Number(req.query.offset);

      let totalPage =
        totalRecords % limit > 0
          ? Math.floor(totalRecords / limit) + 1
          : totalRecords / limit;
      let currentPage = offset / limit + 1;

      return res.json({
        data: {
          list,
          pagination: { totalRecords, totalPage, currentPage, limit },
        },
        status: 200,
        message: "success",
      });
    } else
      return res.status(401).json({ status: 400, message: "Post not found!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || title === "" || content === "") {
      let message = "";
      if (!title || title === "") message = "Title ";
      if (!content || content === "") message += "Content ";
      message += "is Required.";
      res.send({ status: 400, message });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateId = async (req, res, next) => {
  try {
    if (req.params.id && ObjectId.isValid(req.params.id)) {
      next();
    } else
      return res.status(400).json({ status: 400, message: "Id is Invalid!" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

exports.postDetails = async (req, res) => {
  try {
    const postId = req.params.id;
    const posts = await postService.getPostById(postId);
    if (posts) {
      return res
        .status(200)
        .json({ data: posts, status: 200, message: "success" });
    } else
      return res
        .status(400)
        .json({ data: {}, status: 400, message: "Post not found!" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    req.body.author = req._userId;
    req.body.title = req.body.title.trim();
    req.body.content = req.body.content.trim();
    const post = await postService.createPost(req.body);
    if (post._id) {
      return res.json({ data: post, status: 200, message: "success" });
    }
  } catch (err) {
    console.log("error :", err.message);

    res.status(500).json({ message: err.message });
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await postService.deletePost(req.params.id);
    if (post) {
      return res.json({
        status: 200,
        message: "success",
      });
    } else
      return res.status(401).json({ status: 400, message: "Post not found!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updatePosts = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = req.body;
    const posts = await postService.updatePost(postId, post);
    if (posts) {
      return res.status(200).json({ status: 200, message: "success" });
    } else
      return res.status(400).json({ status: 400, message: "Post not found!" });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
