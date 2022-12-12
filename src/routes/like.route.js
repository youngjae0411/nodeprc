const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWares/auth-middleware");
const LikesController = require("../controllers/likes.controllers");
const likesController = new LikesController();

//좋아요 등록

router.put("/:Id", authMiddleware, likesController.updateLike);

//좋아요 게시물 조회

router.get("/", authMiddleware,likesController.findLike);

module.exports = router;
