const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: posts
 *   description: 회원가입 및 로그인
 */

router.use("/api/posts", require("./posts.route"));
router.use("/api", require("./comment.route"));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 회원가입 및 로그인
 */

router.use("/api/users", require("./users.route"));
router.use("/api/likes", require("./like.route"));

module.exports = router;
