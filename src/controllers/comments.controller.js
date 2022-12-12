const CommentsService = require("../services/comments.service");

class CommentsController {
  constructor() {
    this.commentsService = new CommentsService();
  }

  createComment = async (req, res, next) => {
    try {
      const { Id } = req.params;
      const { content } = req.body;
      const { userId, nickname } = res.locals.user;

      if (!content || !userId || !Id || !nickname) {
        return res
          .status(412)
          .json({ errorMessage: "데이터의 형식이 올바르지 않습니다.." });
      }

      if (!content) {
        return res.status(400).json({ message: "댓글 내용을 입력해주세요" });
      }
      
      await this.commentsService.createComment(content, Id, userId);

      res.status(201).json({ message: "댓글이 생성되었습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
    }
  };

  findComments = async (req, res, next) => {
    try {
      const { Id } = req.params;

      const comments = await this.commentsService.findComments(Id);

      if (comments.length === 0) {
        return res.status(404).json({ message: "댓글이 존재하지않습니다." });
      }

      res.json({ data: comments });
    } catch (error) {
      res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다." });
    }
  };

  updateComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const { userId } = res.locals.user;

      if (!content) {
        return res
          .status(412)
          .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
      }

      const comment = await this.commentsService.updateComment(
        commentId,
        content
      );

      if (userId !== comment.userId) {
        return res.status(412).json({ errorMessage: "권한이 없습니다." });
      }

      res.json({ message: "댓글을 수정하였습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: "댓글 수정에 실패하였습니다." });
    }
  };

  deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = res.locals.user;

      const comment = await this.commentsService.deleteComment(commentId);

      if (userId !== comment.userId) {
        return res.status(412).json({ errorMessage: "권한이 없습니다." });
      }

      res.status(200).json({ message: "댓글이 삭제되었습니다." });
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다." });
    }
  };
}

module.exports = CommentsController;
