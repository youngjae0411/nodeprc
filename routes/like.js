const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleWares/auth-middleware");
const { Op } = require("sequelize");
const { Posts, Likes, User } = require("../models");

//좋아요 등록

router.put("/:postId", authMiddleware, async (req, res) => {

  try{

  let { postId } = req.params;

  const post = await Posts.findOne({
    where: {
    [Op.or] : [{postId : postId}]
    }
  })

  if(post === null){
    return res.status(404).json({errorMessage : "게시글이 존재하지 않습니다."})
  }


  const likes = await Likes.findOne({
    where: {
      [Op.and] : [{postId : req.params.postId}, {userId : res.locals.user.userId}]
    }
  })
  console.log(likes)
  
  
  if(likes !== null){
    await Likes.destroy({
      where: {
        [Op.and] : [{postId : req.params.postId}, {userId : res.locals.user.userId}]
      }
    })
    return res.status(201).json({message : "좋아요가 취소되었습니다."})
  }
  await Likes.create({postId : req.params.postId, userId : res.locals.user.userId})
  res.status(201).json({message : "좋아요가 등록되었습니다."})
  
} catch (error){
  console.log(error)
  res.status(400).json({errorMessage : "게시글 좋아요에 실패하였습니다."})
}

});

//좋아요 게시물 조회

router.get("/", authMiddleware ,async (req, res) => {

  try{
  
  const likes = await Likes.findAll({
    where: {
      [Op.or] : [{userId : res.locals.user.userId}]
    },
    include: [Posts, User]
  })

   

    const result = await Promise.all(likes.map( async (posts)=> {

      const count = await Likes.count({
        where: {
          [Op.or] : [{ postId : posts.postId }]
        }
      })

      return {
        postId : posts.postId,
        userId : posts.userId,
        nickname : posts.User.nickname,
        title : posts.Post.title,
        createdAt : posts.createdAt,
        like : count
      }
    }))
    
  data = result.sort(function (a,b){
    return b.like - a.like
  })

  res.send({data})

} catch(error) {
  console.log(error)
  res.status(400).json({errorMessage : "좋아요 게시글 조회에 실패하였습니다."})
}

})

module.exports = router;