const { Op } = require("sequelize");
const { Posts, Likes, User } = require("../models");
class LikesRepository {
  findLike = async (Id, userId) => {
    return Likes.findOne({
      where: {
        [Op.and]: [{ postId: Id }, { userId }],
      },
    });
  };

  findLikes = async (userId) => {
    return Likes.findAll({
      where: {
        [Op.or]: [{ userId }],
      },
      include: [Posts, User],
    });
  };

  createLike = async (Id, userId) => {
    return Likes.create({
      postId: Id,
      userId: userId,
    });
  };

  deleteLike = async (Id, userId) => {
    console.log(Id, userId);
    return Likes.destroy({
      where: {
        [Op.and]: [{ postId: Id }, { userId: userId }],
      },
    });
  };
  countLike = async (postId) => {
    return  Likes.count({
      where: {
        [Op.or]: [{postId}],
      },
    });
  }
}

module.exports = LikesRepository;
