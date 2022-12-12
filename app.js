const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const routes = require("./routes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

require("dotenv").config();

const { swaggerUi, specs } = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

app.use("/", routes);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, "포트로 서버가 열렸습니다.");
});

app.get("/", (req, res) => {
  res.send("hello world");
});
