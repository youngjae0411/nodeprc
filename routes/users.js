const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize");
const { User } = require("../models");
const auth = require("../middleWares/auth");

//회원가입

router.post('/signup' , auth ,async (req,res) => {

  try{
    
  const users = await User.findAll({
    where: {
      [Op.or] : [{nickname : req.body.nickname}]
    }
  })
  console.log(users)
  if(users.length !== 0){
    return res.status(412).json({errorMessage : "중복된 닉네임입니다."})
  }
  if (!/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{2,10}$/.test(req.body.nickname))
  return res.status(412).json({errorMessage: "ID의 형식이 일치하지 않습니다."});

  if(req.body.password !== req.body.confirmPassword) {
    return res.status(412).json({errorMessage : "패스워드가 일치하지 않습니다."})
  }

  if(req.body.password.length < 4) {
    return res.status(412).json({errorMessage: "패스워드의 형식이 일치하지 않습니다."})
  }

  const psCheck = req.body.password.includes(req.body.nickname)

  if(psCheck){
    return res.status(412).json({errorMessage: "패스워드에 닉네임이 포함되어 있습니다."})
  }

  await User.create({nickname : req.body.nickname, password : req.body.password})
  res.status(201).json({message : '회원 가입에 성공하였습니다.'})



}catch (error){
  console.log(error)
  res.status(400).json({errorMessage : "요청한 데이터 형식이 올바르지 않습니다."})
}
})

//로그인

router.post('/login' , auth ,async (req,res) => {

  try{
    const users = await User.findOne({
      where: {
        [Op.or] : [{nickname : req.body.nickname}]
      }
    })

  if(!users || req.body.password !== users.password) {
    return res.status(400).json({errorMessage: "닉네임 또는 패스워드를 확인해주세요."})
  }

  const token = jwt.sign({ userId: users.userId },process.env.SECRET,
    {expiresIn : 60 * 60}
    );

  return res.cookie('token', token).status(201).json({token : token})
  
  }catch (error) {
    console.log(error)
    return res.status(400).json({errorMessage: "로그인에 실패하였습니다."})
  }
})


module.exports = router;