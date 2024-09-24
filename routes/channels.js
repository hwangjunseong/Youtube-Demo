const express = require("express");

const router = express.Router();

const conn = require("../mariadb");
//오류를 받아주는 validationResult
const { body, param, validationResult } = require("express-validator");

//내가 만든 validate 모듈화 설정 => validate를 미들웨어 형태로 함
const validate = (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    console.log(err.array());
    //json array 형태로 보냄
    return res.status(400).json(err.array());
  }
};

//body에서 꺼내오는 body 메소드 사용
//cb함수 앞은 callback함수 부르기 전에 먼저 요청하는지 자리
router
  .route("/")
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자를 입력해주세요"),
      body("name")
        .notEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage("2글자 이상의 문자를 입력해주세요"),
    ],
    (req, res) => {
      validateErr(req, res);
      //채널 개별 생성
      // req.body 안에 name과 user_id 들어감
      const { name, userId } = req.body;

      let sql = `INSERT INTO channels ( name, user_id) VALUES (?, ?)`;
      let values = [name, userId];
      conn.query(sql, values, function (err, results) {
        // console.log("channelpost", results);
        //에러에 대해 if else 문으로 분기처리하면 안되고 try catch , async throw 처럼 해야함
        //값을 던졌는데 서버에서 sql 처리 못했다면 500
        if (err) {
          console.log(err);
          return res.status(400).end();
        } else {
          res.status(201).json(results);
        }
      });
    }
  )
  .get(
    [
      body("userId").notEmpty().isInt().withMessage("숫자를 입력해주세요"),
      validate,
    ],
    (req, res) => {
      //채널 전체 조회
      // validateErr(req, res);

      //body에 userId 옴 => 원래는 헤더에서 꺼내야함
      let { userId } = req.body;
      let sql = `SELECT * FROM channels Where user_id = ?`;
      //단축평가를 사용해서 userId가 없을 떄의 에러 처리
      //userId가 있어야 뒤에꺼 동작, 없으면 뒤에 읽히지 않음
      // userId &&

      conn.query(sql, userId, function (err, results) {
        // console.log(results);
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) {
          res.status(200).json(results);
        } else {
          // channelNotFound(res);
          return res.status(404).end();
        }
      });
    }
  );

// function channelNotFound(res) {
//   res.status(404).json({ message: "조회할 채널 없음" });
// }
//param에서 꺼내오는 param 메서드 사용
router
  .route("/:id")
  .get(
    param("id").notEmpty().withMessage("채널 id를 입력해주세요"),
    (req, res) => {
      //채널 개별 조회
      validateErr(req, res);

      let { id } = req.params;
      id = parseInt(id);

      let sql = `SELECT * FROM channels Where id = ?`;
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.length) {
          res.status(200).json(results);
        } else {
          // channelNotFound(res);
          return res.status(400).end();
        }
      });
    }
  )
  .put(
    [
      param("id").notEmpty().withMessage("채널 id를 입력해주세요"),
      body("name")
        .notEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage("2글자 이상의 문자를 입력해주세요"),
    ],

    (req, res) => {
      //채널 개별 수정
      validateErr(req, res);

      let { id } = req.params;
      id = parseInt(id);

      let sql = `UPDATE  channels SET name=? Where id=?`;
      let values = [req.body.name, id];
      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        //update 할게 없을 떄
        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          //update 할게 있을 떄
          res.status(200).json(results);
        }
      });
    }
  )
  .delete(
    param("id").notEmpty().withMessage("채널 id를 입력해주세요"),
    (req, res) => {
      //채널 개별 삭제
      validateErr(req, res);
      let { id } = req.params;
      id = parseInt(id);
      let sql = `DELETE FROM channels Where id = ?`;
      conn.query(sql, id, function (err, results) {
        // console.log(results.length); //1
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        //console.log(results);
        //delete 할게 없을 떄
        if (results.affectedRows == 0) {
          return res.status(400).end();
        } else {
          //delete 할게 있을 떄
          res.status(200).json(results);
        }
      });
    }
  );

function validateErr(req, res) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    console.log(err.array());
    //json array 형태로 보냄
    return res.status(400).json(err.array());
  }
}

//channel-demo.js 파일을 모듈로 사용 => 다른 파일에서 사용하게 모듈화
module.exports = router;
