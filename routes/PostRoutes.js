const express = require("express");
const { validate, create,validateId, list,deletePost ,updatePosts,postDetails} = require("../controllers/PostController");
const authToken = require("../middleware/authToken");
const router = express.Router();

router.post("/", authToken, validate, create);
router.get("/", list);
router.get("/:id", validateId, postDetails);
router.put("/:id", validateId, updatePosts);

router.delete("/:id", authToken, deletePost);

module.exports = router;
