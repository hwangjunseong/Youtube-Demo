const express = require("express");
const app = express();
app.listen(1818);
//json모듈 미들웨어 설정
app.use(express.json());

//채널 개별 생성
app.post("/channels");
//채널 전체 조회
app.get("/channels");

app
  .route("/channels")
  .post((req, res) => {
    //채널 개별 생성
    // const { channelTitle } = req.body;
    //예외 처리
    if (req.body.channelTitle) {
      //req.body 통쨰로 db에 저장
      db.set(id, req.body);
      res
        .status(201)
        .json({ message: `${db.get(id++).channelTitle}채널을 응원` });
    } else {
      res.status(400).json({ mesage: "잘못된 request" });
    }
  })
  .get((req, res) => {
    //채널 전체 조회
    //json array : json형태로 배열처럼 보냄
    if (db.size) {
      //   const channels = {};
      const channels = [];

      db.forEach(function (value, key, mapobject) {
        //   channels[key] = value;
        //배열로 담음
        channels.push(value);
      });
      console.log(channels);
      //json 형태로 json array 보내도됨 [{}, {}, {}]
      res.status(200).json(channels);
    } else {
      res.status(404).json({ message: "조회할 채널 없음" });
    }
  });

//채널 개별 수정
app.put("/channels/:id");
//채널 개별 삭제
app.delete("/channels/:id");
//채널 개별 조회
app.get("/channels/:id");

app
  .route("/channels/:id")
  .get((req, res) => {
    //채널 개별 조회
    let { id } = req.params;
    id = parseInt(id);
    //객체가 있는지 확인
    const channelObject = db.get(id);
    if (channelObject) {
      res.status(200).json(channelObject);
    } else {
      res.status(404).json({ message: "Channel not found" });
    }
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
