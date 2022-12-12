const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWares/auth-middleware.js");
const PostsController = require('../controllers/posts.controller')
const postsController = new PostsController


router.get("/", postsController.findAllPosts);

router.get("/:Id", postsController.findOnePost);

router.post("/", authMiddleware, postsController.createPost);

router.put("/:Id", authMiddleware, postsController.updatePost); 

router.delete("/:Id", authMiddleware, postsController.deletePost);

module.exports = router;
