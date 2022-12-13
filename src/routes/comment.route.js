const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWares/auth-middleware");
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

//댓글 작성 통과
router.post("/:Id/comments", authMiddleware, commentsController.createComment);

//댓글 목록 조회 통과
router.get("/:Id/comments", authMiddleware, commentsController.findComments);

//댓글 수정 통과
router.put("/comments/:commentId", authMiddleware, commentsController.updateComment);

//댓글 삭제 통과
router.delete("/comments/:commentId", authMiddleware, commentsController.deleteComment);

module.exports = router;
