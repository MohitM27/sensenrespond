const ObjectId = require("mongoose").Types.ObjectId;
const commentService = require("../services/CommentService");

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
exports.list = async (req, res, next) => {
  try {
    const totalRecords = await commentService.getAllComment(new ObjectId(req.params.id));
    if (totalRecords) {
      return res.json({
        data: totalRecords,
        status: 200,
        message: "success",
      });
    } else
      return res
        .status(401)
        .json({ status: 400, message: "Comments not found!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content || postId === "" || content === "") {
      let message = "";
      if (!postId || postId === "" || !ObjectId.isValid(postId))
        message = "postId ";
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

exports.create = async (req, res) => {
  try {
    req.body.author = req._userId;
    req.body.content = req.body.content.trim();
    const post = await commentService.createComment(req.body);
    if (post._id) {
      return res.json({ data: post, status: 200, message: "success" });
    }
  } catch (err) {
    console.log("error :", err.message);

    res.status(500).json({ message: err.message });
  }
};
