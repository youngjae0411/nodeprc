const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: posts
 *   description: 회원가입 및 로그인
 */

router.use("/api/posts", require("./posts"));
router.use("/api/comments", require("./comment"));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 회원가입 및 로그인
 */

router.use("/api/users", require("./users"));
router.use("/api/likes", require("./like"));

module.exports = router;
