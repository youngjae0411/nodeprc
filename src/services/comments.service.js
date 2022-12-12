const CommentsRepository = require("../repositories/comments.repository");
const PostsRepository = require("../repositories/posts.repository");

class CommentsService {
  constructor() {
    (this.commentsRepository = new CommentsRepository()),
      (this.postsRepository = new PostsRepository());
  }

  createComment = async (content, Id, userId) => {
    const post = await this.postsRepository.findOnePost(Id);
    console.log(post)
    if (post.length === 0) throw new Error("Post doesn't exist");

    await this.commentsRepository.createComment({
      Id,
      content,
      userId,
    });
  };

  findComments = async (Id) => {
    const post = await this.postsRepository.findOnePost(Id);
    if (post.length === 0) throw new Error("Post doesn't exist");

    const comments = await this.commentsRepository.findComments({ Id });

    return await comments.map((comment) => {
      return {
        CommentsId: comment.commentId,
        userId: comment.userId,
        nickname: comment.User.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      };
    });
  };

  updateComment = async (commentId, content) => {
    const comments = await this.commentsRepository.findComment({ commentId });
    if (!comments) throw new Error("comments doesn't exist");

    await this.commentsRepository.updateComment({ commentId, content });

    return comments;
  };

  deleteComment = async (commentId) => {
    const comments = await this.commentsRepository.findComment({ commentId });
    if (!comments) throw new Error("comments doesn't exist");

    await this.commentsRepository.deleteComment({ commentId });

    return comments;
  };
}

module.exports = CommentsService;
