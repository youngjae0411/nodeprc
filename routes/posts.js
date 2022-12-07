const express = require("express");
const authMiddleware = require("../middleWares/auth-middleware");
const router = express.Router();
const { Op } = require("sequelize");
const { Posts, Likes, User } = require("../models")

//전체 게시물 조회 통과
router.get('/', async (req,res) => {

  try{
    const posts = await Posts.findAll({
      include: [{
        model : User,
        attributes : ['nickname']
      }],
      order: [["createdAt", "desc"]]
    })

    if(posts.length === 0){
      return res.status(200).json({message: "글을 먼저 작성해주세요!"})
    }

   
    const results =  await Promise.all(posts.map( async (posts)=> {

      const count = await Likes.count({
        where: {
          [Op.or] : [{ postId : posts.postId }]
        }
      })

      return {
        postId : posts.postId,
        userId : posts.userId,
        nickname : posts.User.nickname,
        title : posts.title,
        createdAt : posts.createdAt,
        like : count
      }
    }))
    res.json({
      data :  results
    })} catch (error){
      console.log(error)
      res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
    }

})


//게시물 상세조회 통과

router.get('/:Id', async (req,res) => {
  
  let { Id } = req.params;

  try{

  const posts = await Posts.findAll({
    where: {
      [Op.or] : [{postId : Id}]
    },
    include: [{
      model : User,
      attributes : ['nickname']
    }]
  })

  console.log(posts)
  if(posts.length === 0 ) {
    return res.status(400).json({message: '존재하지않는 게시물입니다.' })
  } else {

    
    const results =  await Promise.all(posts.map( async (posts)=> {

      const count = await Likes.count({
        where: {
          [Op.or] : [{ postId : posts.postId }]
        }
      })
    return {
      postId : posts.postId,
      userId : posts.userId,
      nickname : posts.User.nickname,
      title : posts.title,
      content : posts.content,
      createdAt : posts.createdAt,
      like : count
    }
  }))

  res.json({
    data : results
  
  })}} catch (error) {
    console.log(error)
    res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})
  }
})


//게시물 작성 통과
router.post('/', authMiddleware, async (req, res) => {
  console.log(11111111111111)
  try{
    
    if(req.body.title === undefined || req.body.content === undefined || req.body.title.length === 0 || req.body.content.length === 0 ){
      return res.status(412).json({errorMessage: "데이터의 형식이 올바르지 않습니다.."})
    }

  await Posts.create({title : req.body.title, content : req.body.content, userId : res.locals.user.userId, nickname :res.locals.user.nickname  })
  res.status(201).json({message: "게시글이 생성되었습니다."})
  } catch(error){
    console.log(error.message)
    res.status(400).json({errorMessage: "게시글 작성에 실패하였습니다."})
  }
  })


//게시물 수정 통과

router.put('/:Id', authMiddleware, async (req,res) => {


  try {
    
   let { Id } = req.params;

   const posts = await Posts.findOne({
    where: {
      [Op.or] : [{postId : Id}]
    },
    include: [{
      model : User,
      attributes : ['nickname']
    }]
  })
    console.log(res.locals.user)

    

    if(posts === null ) {
      return res.status(404).json({message: '게시글 조회에 실패하였습니다.'})
    }

    if(res.locals.user.userId !== posts.userId) {
      return res.status(412).json({errorMessage : "권한이 없습니다."})
    }
    
    if(req.body.content === undefined && req.body.title === undefined){
      return res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
    }

    if(posts.title === req.body.title && posts.content === req.body.content){
      return res.status(400).json({message: "변경사항이 없습니다."})
    }

      await Posts.update({title : req.body.title, content : req.body.content}, {where: {postId : Id}});
   
   res.json({ message: "게시물을 수정하였습니다."})
  } catch (error){
    console.log(error)
    res.status(400).json({errorMessage: "게시글 수정에 실패하였습니다."})
  }
})

//게시물 삭제 통과

router.delete('/:Id', authMiddleware, async (req,res) => {

  let { Id } = req.params

  try{
    const posts = await Posts.findOne({
      where: {
        [Op.or] : [{postId : Id}]
      }
    })
  console.log(posts)

  if(posts === null ) {
    return res.status(404).json({message: '게시글이 존재하지않습니다.' })
  }

  if(res.locals.user.userId !== posts.userId) {
    return res.status(412).json({errorMessage : "권한이 없습니다."})
  }
  
  if([posts].length > 0){
    await Posts.destroy({
      where: {postId : Id }
    })
  }
  res.json({message : "게시물을 삭제하였습니다."})
} catch(error) {
  console.log(error)
  res.status(400).json({errorMessage: "게시글 삭제에 실패하였습니다."})
 }
})






module.exports = router;