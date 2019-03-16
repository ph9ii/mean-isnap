const express = require("express");


const checkAuth = require("../middleware/check-auth");

const extractImage = require("../middleware/image");

const router = express.Router();

const PostController = require("../controllers/post/PostController");


router.post("", checkAuth, extractImage, PostController.createPost);

router.put("/:id", checkAuth, extractImage, PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost)

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;