const express = require('express')
const UsersService = require('../services/users.service')

class UsersController {
  constructor () {
    this.usersService = new UsersService();
  }

  signUp = async (req, res) => {
    
    try {
      const { nickname, password, confirmPassword} = req.body

      if (!/^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{2,9}$/.test(nickname))
        return res
          .status(412)
          .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
  
      if (password !== confirmPassword) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드가 일치하지 않습니다." });
      }
  
      if (password.length < 4) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드의 형식이 일치하지 않습니다." });
      }

  
      const psCheck = password.includes(nickname);
  
      if (psCheck) {
        return res
          .status(412)
          .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
      }

      await this.usersService.signUp(
        nickname,
        password
      );

      res.status(201).json({ message: "회원 가입에 성공하였습니다." });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
    }
  }

  login = async (req, res) => {

    try {
      
      const { nickname, password } = req.body

      const token = await this.usersService.login(
        nickname,
        password
      );

      return res
        .cookie("authorization", "Bearer%" + token)
        .status(201)
        .json({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
    }
  }
}

module.exports = UsersController 