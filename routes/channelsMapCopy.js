const express = require("express");

const router = express.Router();

const conn = require("../mariadb");

router
  .route("/")
  .post((req, res) => {
    //채널 개별 생성
    //req.body가 json 형태로 날라옴 =>channelTitle과 userId

    // const { channelTitle } = req.body;
    //예외 처리
    if (req.body.channelTitle) {
      //req.body 통쨰로 db에 저장
      //userId가 있는 아이디인지 확인해야함
      let channel = req.body;
      db.set(id, channel);
      res
        .status(201)
        .json({ message: `${db.get(id++).channelTitle}채널을 응원` });
    } else {
      res.status(400).json({ mesage: "잘못된 request" });
    }
  })
  .get((req, res) => {
    //채널 전체 조회
    //body에 userId 옴 => 원래는 헤더에서 꺼내야함
    let { userId } = req.body;
    //논리연산자 사용
    if (db.size && userId) {
      //   const channels = {};
      //json array : json형태로 배열처럼 보냄
      const channels = [];
      //1) userId가 body에 없으면
      // console.log(db);
      //undefined가 아님
      //db에는 Map(1) { 1 => { channelTitle: 'django2', userId: 'testId2' } }
      db.forEach(function (value, key, mapobject) {
        //   channels[key] = value;
        //배열로 담음
        // channels.push(value);
        //value의 userId와 body로 온 userId와 같은지 비교
        if (value.userId === userId) {
          channels.push(value);
        }
      });
      //  console.log(1, channels);
      //userId가 있는데, 채널이 있는지 확인
      if (channels.length) {
        res.status(200).json(channels);
      } else {
        channelNotFound(res);
      }
      // } else {
      //   //2) userId가 있는데 채널이 없으면
      //   res.status(404).json({ mesage: "userId가 있는데 채널이 없음" });
      // }

      //예외처리 2가지
      //1) userId가 body에 없으면
      //2) userId가 가진 채널이 없으면
      //json 형태로 json array 보내도됨 [{}, {}, {}]
      // res.status(200).json(channels);
    } else {
      channelNotFound(res);
    }
  });

function channelNotFound(res) {
  res.status(404).json({ message: "조회할 채널 없음" });
}

// //채널 개별 수정
// router.put("/channels/:id");
// //채널 개별 삭제
// router.delete("/channels/:id");
// //채널 개별 조회
// router.get("/channels/:id");

router
  .route("/:id")
  .get((req, res) => {
    //채널 개별 조회
    let { id } = req.params;
    id = parseInt(id);

    let sql = `SELECT * FROM users Where id = ?`;
    conn.query(sql, id, function (err, results) {
      if (results.length) {
        res.status(200).json(results);
      } else {
        channelNotFound(res);
      }
    });

    //객체가 있는지 확인
    // const channelObject = db.get(id);
    // if (channelObject) {
    //   res.status(200).json(channelObject);
    // } else {
    //   res.status(404).json({ message: "Channel not found" });
    // }
  })
  .put((req, res) => {
    //채널 개별 수정
    let { id } = req.params;
    id = parseInt(id);
    //객체가 있는지 확인
    let channelObject = db.get(id);
    if (channelObject) {
      let prevChannelTitle = channelObject.channelTitle;
      channelObject.channelTitle = req.body.channelTitle;
      res
        .status(200)
        .json(
          `채널 타이틀이 ${prevChannelTitle}에서 ${channelObject.channelTitle}으로 정상적으로 수정됨`
        );
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  })
  .delete((req, res) => {
    //채널 개별 삭제
    let { id } = req.params;
    id = parseInt(id);
    //객체가 있는지 확인
    const channelObject = db.get(id);
    if (channelObject) {
      db.delete(id);
      res.status(200).json(`${channelObject.channelTitle} 정상적으로 삭제됨`);
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
  });
const db = new Map();
let id = 1;

//channel-demo.js 파일을 모듈로 사용 => 다른 파일에서 사용하게 모듈화
module.exports = router;
