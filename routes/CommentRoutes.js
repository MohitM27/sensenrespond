const express = require("express");
const { validate,validateId, create, list } = require("../controllers/CommentController");
const authToken = require("../middleware/authToken");
const router = express.Router();

router.post("/", authToken, validate, create);
router.get("/:id",validateId, list);

module.exports = router;
