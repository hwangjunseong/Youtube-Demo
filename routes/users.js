//express 모듈 세팅
const express = require("express");

const router = express.Router();

const conn = require("../mariadb");

//로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  let sql = `SELECT * FROM users Where email = ?`;
  conn.query(sql, email, function (err, results) {
    //db에 해당 이메일 가진사람 있는지 확인
    let loginUser = results[0];

    //email 또는 비밀번호가 잘못되었는지 통으로 알려줌
    if (loginUser && loginUser.password === password) {
      res.status(200).json({ message: `${loginUser.name}님 로그인 됨` });
    } else {
      res.status(404).json({ message: "email 또는 비밀번호가 틀렸습니다" });
    }
  });
});
//회원 가입
router.post("/signup", (req, res) => {
  //req.body에 아무것도 안넣고 보내도 {}로 나옴
  //{}가 있을 때는 값이 없어도 if문에서 있는거로 취급함if(req.body)했을 떄
  if (req.body == {}) {
    res.status(400).json({ message: `body의 값이 유효하지 않은 내용입니다` });
  } else {
    const { email, name, password, contact } = req.body;
    console.log(email, name, password, contact);
    //여러 개의 문자열을 한번에 묶에서 보내려고 배열에 묶어서 보냄
    let sql = `INSERT INTO users ( email, name, password, contact) VALUES (?, ?, ?, ?)`;
    let values = [email, name, password, contact];
    conn.query(sql, values, function (err, results) {
      res.status(201).json(results);
    });
  }
});
//route 사용 => url이 같아서 method에 따른 callback을 다르게함
router
  .route("/users")
  .get((req, res) => {
    //원래는 req.body에 넣지않고 JWT로 함
    const { email } = req.body;

    //email에 들어갈 애가 ?에 들어감
    let sql = `SELECT * FROM users Where email = ?`;
    conn.query(sql, email, function (err, results) {
      res.status(200).json(results);
    });
  })
  .delete((req, res) => {
    const { email } = req.body;

    //email에 들어갈 애가 ?에 들어감
    //DELETE는 Where과 같이쓰기
    conn.query(
      `DELETE FROM users Where email = ?`,
      email,
      function (err, results) {
        // console.log(results.length); //1
        console.log(results);
        res.status(200).json(results);
      }
    );
  });

//user-demo.js 파일을 모듈로 사용 => 다른 파일에서 사용하게 모듈화
module.exports = router;
