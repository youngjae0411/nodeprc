const LikesService = require("../services/likes.services");

class LikesController {
  constructor() {
    this.likesService = new LikesService();
  }

  updateLike = async (req, res) => {
    try {
      const { Id } = req.params;
      const { userId } = res.locals.user;

      const like = await this.likesService.updateLike(Id, userId);

      if (like) {
        return res.status(201).json({ message: "좋아요가 취소되었습니다." });
      } else if (!like) {
        res.status(201).json({ message: "좋아요가 등록되었습니다." });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
    }
  };

  findLike = async (req, res) => {
    try {
      const {userId} = res.locals.user

      const data = await this.likesService.findLike(userId);

  
      res.send({ data });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
    }
  }
}

module.exports = LikesController;
