//express 모듈 세팅
const express = require("express");

const router = express.Router();

const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");
//jwt 모듈
const jwt = require("jsonwebtoken");
//dotenv 모듈
const dotenv = require("dotenv");
dotenv.config();

//validate에 오는 req, res, next express 가 넣어주는거
const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next(); // 에러 없다면 다음 미들웨어로 넘어감
  } else {
    //console.log(err.array());
    //json array 형태로 보냄
    return res.status(400).json(err.array());
  }
};
//로그인
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("이메일 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;

    let sql = `SELECT * FROM users Where email = ?`;
    conn.query(sql, email, function (err, results) {
      //db에 해당 이메일 가진사람 있는지 확인
      let loginUser = results[0];

      //email 또는 비밀번호가 잘못되었는지 통으로 알려줌
      if (loginUser && loginUser.password === password) {
        //token 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          {
            //JWT 유효기간 설정
            expiresIn: "30m", //30분
            issuer: "Junseong", //발행한 사람
          }
        );
        console.log(token);
        //JWT를 쿠키에 동봉 => //쿠키 안에 "token"이라는 상자만들고 거기에 token 담아줌
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(200).json({ message: `${loginUser.name}님 로그인 됨` });
      } else {
        //404는 찾고자 하는 리소스가 없을 때임
        //403은 인증이 안되었을 때 보내는거
        res.status(403).json({ message: "email 또는 비밀번호가 틀렸습니다" });
      }
    });
  }
);
//회원 가입
router.post(
  "/signup",
  [
    body("email")
      .notEmpty()
      .isString()
      .isEmail()
      .withMessage("이메일 확인 필요"),
    body("name").notEmpty().isString().withMessage("채널이름 확인 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    body("contact").notEmpty().isString().withMessage("연락처 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, name, password, contact } = req.body;
    console.log(email, name, password, contact);
    //여러 개의 문자열을 한번에 보내려고 배열에 묶어서 보냄
    let sql = `INSERT INTO users ( email, name, password, contact) VALUES (?, ?, ?, ?)`;
    let values = [email, name, password, contact];
    conn.query(sql, values, function (err, results) {
      if (err) {
        return res.status(400).end();
      } else {
        res.status(201).json(results);
      }
    });
  }
);
//route 사용 => url이 같아서 method에 따른 callback을 다르게함
router
  .route("/users")
  .get(
    [
      body("email")
        .notEmpty()
        .isString()
        .isEmail()
        .withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      //원래는 req.body에 넣지않고 JWT로 함
      const { email } = req.body;

      //email에 들어갈 애가 ?에 들어감
      let sql = `SELECT * FROM users Where email = ?`;
      conn.query(sql, email, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) {
          res.status(200).json(results);
        } else {
          return res.status(400).end();
        }
      });
    }
  )
  .delete(
    [
      body("email")
        .notEmpty()
        .isString()
        .isEmail()
        .withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      const { email } = req.body;

      //email에 들어갈 애가 ?에 들어감
      //DELETE는 Where과 같이쓰기
      conn.query(
        `DELETE FROM users Where email = ?`,
        email,
        function (err, results) {
          if (err) {
            return res.status(400).end();
          }
          if (results.affectedRows == 0) {
            return res.status(400).end();
          } else {
            //delete 할게 있을 떄
            res.status(200).json(results);
          }
        }
      );
    }
  );

//user-demo.js 파일을 모듈로 사용 => 다른 파일에서 사용하게 모듈화
module.exports = router;
