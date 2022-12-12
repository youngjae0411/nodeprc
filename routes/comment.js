const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const authMiddleware = require("../middleWares/auth-middleware");
const { User, Posts, Comments } = require("../models");

//댓글 작성 통과
router.post("/:Id", authMiddleware, async (req, res) => {
  let { Id } = req.params;

  try {
    const posts = await Posts.findAll({
      where: {
        [Op.or]: [{ postId: Id }],
      },
    });
    console.log(posts);

    if (posts.length === 0) {
      return res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }

    if (req.body.content === undefined || req.body.content.length === 0) {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    }

    const postId = req.params.Id;
    const content = req.body.content;

    await Comments.create({
      postId: postId,
      userId: res.locals.user.userId,
      content: content,
    });

    res.status(201).json({ message: "댓글이 생성되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

//댓글 목록 조회 통과
router.get("/:Id", async (req, res) => {
  let { Id } = req.params;

  try {
    const posts = await Posts.findOne({
      where: {
        [Op.or]: [{ postId: Id }],
      },
      order: [["createdAt", "desc"]],
    });

    if (posts === null) {
      return res.status(404).json({ message: "존재하지 않는 게시물입니다." });
    }

    const Comment = await Comments.findAll({
      where: {
        [Op.or]: [{ postId: Id }],
      },
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
    });
    console.log(Comment);
    if (Comment.length === 0) {
      return res.status(404).json({ message: "댓글이 존재하지않습니다." });
    }

    const results = Comment.map((Comments) => {
      return {
        CommentsId: Comments.commentId,
        userId: Comments.userId,
        nickname: Comments.User.nickname,
        content: Comments.content,
        createdAt: Comments.createdAt,
      };
    });
    res.json({ data: results });
  } catch (error) {
    res.status(500).json(error);
  }
});

//댓글 수정 통과
router.put("/:CommentsId", authMiddleware, async (req, res) => {
  let { CommentsId } = req.params;

  try {
    const comments = await Comments.findOne({
      where: {
        [Op.or]: [{ commentId: CommentsId }],
      },
    });
    console.log(res.locals.user);

    if (comments === null) {
      return res.status(404).json({ message: "존재하지않는 댓글입니다." });
    }

    if (res.locals.user.userId !== comments.userId) {
      return res.status(412).json({ errorMessage: "권한이 없습니다." });
    }

    if (req.body.content === undefined || req.body.content.length === 0) {
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    await Comments.update(
      { content: req.body.content },
      { where: { commentId: CommentsId } }
    );

    res.json({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

//댓글 삭제 통과
router.delete("/:CommentsId", authMiddleware, async (req, res) => {
  let { CommentsId } = req.params;

  try {
    const comments = await Comments.findOne({
      where: {
        [Op.or]: [{ commentId: CommentsId }],
      },
    });

    if (comments === null) {
      return res.status(404).json({ message: "존재하지않는 댓글입니다." });
    }

    if (res.locals.user.userId !== comments.userId) {
      return res.status(412).json({ errorMessage: "권한이 없습니다." });
    }

    if (comments !== null) {
      await Comments.destroy({
        where: { commentId: CommentsId },
      });
    }

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
