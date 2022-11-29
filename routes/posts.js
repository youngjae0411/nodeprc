const express = require("express");
const router = express.Router();

const Posting = require("../schemas/Posting")

//전체 게시물 조회 통과
router.get('/', async (req,res) => {

    const posts = await Posting.find().sort({createdAt: -1})

    const results = posts.map((posts)=> {
      return {
        postId : posts._id,
        user : posts.user,
        title : posts.title,
        createdAt : posts.createdAt,        
      }
    })
    res.json({
      data : results
    })

})


//게시물 상세조회 통과

router.get('/:_postId', async (req,res) => {
  
  let { _postId } = req.params;
  if(_postId.length !== 24){
    _postId = '000000000000000000000000'
  }
  try{
  
  const posts = await Posting.find({ _id : _postId})
  console.log(posts)
  if( _postId ==='000000000000000000000000' || posts.length === 0 ) {
    return res.status(400).json({message: '존재하지않는 게시물입니다.' })
  } else {
  const results = posts.map((posts)=> {
    return {
      postId : posts._id,
      user : posts.user,
      title : posts.title,
      content : posts.content,
      createdAt : posts.createdAt,
    }
  })
  res.json({
    data : results
  
  })}} catch (error) {
    console.log(error)
    res.status(500).json({error})
  }
})


//게시물 작성 통과
router.post('/', async (req, res) => {

  const posting = await new Posting(req.body)

  posting.save((err, doc) => {
    console.log(posting)

    if(err) return res.status(400).json({message : "데이터의 형식이 올바르지 않습니다."})
    else res.status(201).json({message: "게시글을 생성하였습니다."})
  })
})

//게시물 수정 통과

router.put('/:_postId', async (req,res) => {

   let { _postId } = req.params;
    if(_postId.length !== 24){
      _postId = '000000000000000000000000'
    }

    const posts = await Posting.findOne({_id : _postId })
    console.log(posts)

    try {

    if( _postId ==='000000000000000000000000' || posts === null ) {
      return res.status(404).json({message: '게시글 조회에 실패하였습니다.'})
    }
    
    if(posts.password !== req.body.password){
      return res.status(401).json({message: "비밀번호를 다시 확인해주세요"})
    }

    if(req.body.content === undefined && req.body.title === undefined){
      return res.status(400).json({message: "수정내용을 입력해주세요."})
    }

    if(posts.title === req.body.title && posts.content === req.body.content){
      return res.status(400).json({message: "변경사항이 없습니다."})
    }
    if([posts].length){
      await Posting.updateOne({_id : _postId }, { $set: req.body});
   }
   res.json({ message: "게시물을 수정하였습니다."})
  } catch (error){
    console.log(error)
    res.status(500).json({error})
  }
})

//게시물 삭제 통과

router.delete('/:_postId', async (req,res) => {

  let { _postId } = req.params

  if(_postId.length !== 24){
    _postId = '000000000000000000000000'
  }
  try{
  const posts = await Posting.findOne({_id : _postId})
  console.log(posts)

  if( _postId ==='000000000000000000000000' || posts === null ) {
    return res.status(404).json({message: '게시글 조회에 실패하였습니다.' })
  }

  if(posts.password !== req.body.password) {
    return res.status(401).json({ message: '비밀번호를 다시 확인해주세요.'})
  }
  
  if([posts].length > 0){
    await Posting.deleteOne({_postId})
  }
  
  res.json({message : "게시물을 삭제하였습니다."})
} catch(error) {
  
  res.status(500).json({error})
 }
})






module.exports = router;