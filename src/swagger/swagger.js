const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openApi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "노드개인과제",
      description:
        "프로젝트 설명 Express로 게시판 CRUD와 로그인, 회원가입 구현",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // 요청 URL
      },
    ],
  },
  apis: ["./routes/*.js", "./routers/user/*.js"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }