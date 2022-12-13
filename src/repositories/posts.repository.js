const { Posts, Likes, User } = require("../models");
const { Op } = require("sequelize");
class PostsRepository {
  findAllPosts = async () => {
    return Posts.findAll({
      include: [
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
      order: [["updatedAt", "desc"]],
    });
  };

  findOnePost = async (Id) => {
    return Posts.findAll({
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
  };

  createPost = async (data) => {
    await Posts.create({
      title: data.title,
      content: data.content,
      userId: data.userId,
      nickname: data.nickname,
    });
  };

  updatePost = async (Id, title, content) => {
    const post = await Posts.update(
      { title, content },
      { where: { postId: Id } }
    );
    return post;
  };

  deletePost = async (Id) => {
    await Posts.destroy({
      where: { postId: Id },
    });
  };
}

module.exports = PostsRepository;
