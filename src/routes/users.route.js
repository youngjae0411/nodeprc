const express = require("express");
const router = express.Router();

const auth = require("../middleWares/auth");
const UsersController = require('../controllers/users.controller')
const usersController = new UsersController

//회원가입
/**
 * @swagger
 * /users/signup:
 *  post:
 *    summary: "유저 등록"
 *    description: "POST 방식으로 유저를 등록한다."
 *    tags: [Users]
 *    requestBody:
 *      description: 유저 등록
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                description: "유저 닉네임"
 *              password:
 *                type: string
 *                description: "유저 비밀번호"
 *              confirmPassword:
 *                type: string
 *                description: "유저 비밀번호 확인"
 *    responses:
 *      "201":
 *        description: 회원가입에 성공하였습니다
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example:
 *                    message : '회원 가입에 성공하였습니다.'
 *      "401":
 *        description: 등록하려는 닉네임이 중복되었습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example:
 *                    errorMessage : '중복된 닉네임입니다.'
 *      "401":
 *        description: 아이디형식.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example:
 *                    errorMessage : '중복된 닉네임입니다.'
 *
 */

router.post("/signup", auth, usersController.signUp);

//로그인
/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: "유저 로그인"
 *    description: "POST 방식으로 유저를 로그인한다."
 *    tags: [Users]
 *    requestBody:
 *      description: 유저 로그인
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nickname:
 *                type: string
 *                description: "유저 닉네임"
 *              password:
 *                type: string
 *                description: "유저 비밀번호"
 *    responses:
 *      "201":
 *        description: 로그인에 성공하였습니다.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example:
 *                    token : token
 *      "401":
 *        description: 로그인 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example:
 *                    errorMessage: "로그인에 실패하였습니다."
 */

//로그인

router.post("/login", auth, usersController.login);

module.exports = router;
