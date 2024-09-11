//express 모듈 세팅
const express = require("express");

const router = express.Router();

//로그인
router.post("/login", (req, res) => {
  //body에 들어있는 id, pwd
  let { userId, pwd } = req.body;
  //pwd는 db에 해쉬화된 pwd랑 비교

  //{}가 있을 때는 값이 없어도 if문에서 있는거로 취급함
  let loginUser = {};
  db.forEach(function (user, id) {
    //a: value, b:key, c: Map
    // console.log(`a: ${a}, b: ${b}, c: ${c}`);
    //user 객체가 가지고 있는 userId
    console.log(user.userId);
    // console.log(1, typeof user.userId);//string
    // console.log(2, typeof userId);//string
    //userId가 db에 저장된 id인지 확인
    if (user.userId === userId) {
      loginUser = user; //user 객체를 가리킴
      //   console.log("db에 저장된 id와 같은 id입니다");
    }
  });

  //login user가 있는지 확인 =>빈 객체인지 확인
  //Object.keys(loginUser) 는 인자로 객체를 전달하고 배열을 반환한다
  //Object.keys(loginUser).length
  if (!isEmpty(loginUser)) {
    // console.log("입력하신 id가 있는 id임");
    //pwd가 db에 저장된 pwd인지 확인
    if (loginUser.pwd === pwd) {
      // console.log("db에 저장된 pwd와 같은 pwd입니다");
      res.status(200).json({ message: `${loginUser.name}님 로그인 됨` });
    } else {
      // console.log("db에 저장된 pwd와 다른 pwd입니다");
      res.status(400).json({ message: "db에 저장된 pwd와 다른 pwd입니다" });
    }
  } else {
    res.status(404).json({ message: "입력하신 id가 없는 id임" });
  }
});
//회원 가입
router.post("/signup", (req, res) => {
  //body에 id, pwd, name 들어옴
  let { userId, pwd, name } = req.body;
  //   console.log(req.body);
  //   console.log(userId, pwd, name);
  //req.body에 아무것도 안넣고 보내도 {}로 나옴
  //해당 id가 db에 있는지 확인함, userId, pwd, name  유효성 검사, name은 js에 있는 빌트인이라 조심
  if (userId != null && pwd != null && name != null) {
    //객체 통쨰로 넣음
    db.set(userId, req.body);
    console.log(db);
    console.log(db.get(userId));
    res.status(201).json({ message: `${db.get(userId).name}님 환영합니다` });
  } else {
    res.status(400).json({ message: `body의 값이 유효하지 않은 내용입니다` });
  }
});
//route 사용 => url이 같아서 method에 따른 callback을 다르게함
router
  .route("/users")
  .get((req, res) => {
    //req.body의 id에 있는걸로 db에서 해당 id를 가진 유저 정보 확인
    let { userId } = req.body;
    //userId = parseInt(userId, 10);
    const user = db.get(userId);
    if (user) {
      res.status(200).json({ userId: user.userId, name: user.name });
    } else {
      res
        .status(404)
        .json({ message: `id가 ${userId}에 해당하는 유저가 없습니다` });
    }
  })
  .delete((req, res) => {
    let { userId } = req.body;
    //userId = parseInt(userId, 10);
    //db.get(1)을 호출하면 Map에 저장된 객체의 **참조(주소값)**를 반환.
    // 즉, user는 실제 객체 자체가 아니라, Map에 저장된 객체의 참조를 가리키게 됨
    const user = db.get(userId);
    if (user) {
      //db.delete(1)을 호출하여 Map에서 그 객체를 삭제하더라도,
      //이미 user 변수는 해당 객체의 **참조(주소값)**를 가지고 있기 때문에 여전히 그 객체에 접근할 수 있음
      db.delete(userId);
      //db에서 그 객체에 대한 참조가 없어지거나 삭제되더라도 user는 여전히 그 객체를 가리키고 있음
      res.status(200).json({ message: `${user.name}님 다음에 또 뵙겠습니다` });
    } else {
      res
        .status(404)
        .json({ message: `userId ${userId}에 해당하는 유저가 없습니다` });
    }
  });
//회원 개별 조회
// app.get("/users/:id", (req, res) => {
//   //req.params의 id에 있는걸로 db에서 해당 id를 가진 유저 정보 확인
//   let { id } = req.params;
//   id = parseInt(id, 10);
//   const user = db.get(id);
//   if (user == undefined) {
//     res
//       .status(404)
//       .json({ message: `id가 ${user.id}에 해당하는 유저가 없습니다` });
//   } else {
//     res.status(200).json({ userId: user.id, name: user.name });
//   }
// });
// //회원 개별 탈퇴
// app.delete("/users/:id", (req, res) => {
//   let { id } = req.params;
//   id = parseInt(id, 10);
//   //db.get(1)을 호출하면 Map에 저장된 객체의 **참조(주소값)**를 반환.
//   // 즉, user는 실제 객체 자체가 아니라, Map에 저장된 객체의 참조를 가리키게 됨
//   const user = db.get(id);
//   if (user == undefined) {
//     res.status(404).json({ message: `id ${id}에 해당하는 유저가 없습니다` });
//   } else {
//     //db.delete(1)을 호출하여 Map에서 그 객체를 삭제하더라도,
//     //이미 user 변수는 해당 객체의 **참조(주소값)**를 가지고 있기 때문에 여전히 그 객체에 접근할 수 있음
//     db.delete(id);
//     //db에서 그 객체에 대한 참조가 없어지거나 삭제되더라도 user는 여전히 그 객체를 가리키고 있음
//     res.status(200).json({ message: `${user.name}님 다음에 또 뵙겠습니다` });
//   }
// });

//매개변수로 obj받고 함수 선언식이 호이스팅
function isEmpty(obj) {
  //obj가 객체인지 확인
  if (obj.constructor === Object) {
    console.log("obj는 Object 생성자로 만들어진 객체입니다.");
  }

  //비었을 때
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
}
const db = new Map();
// let id = 1;

//user-demo.js 파일을 모듈로 사용 => 다른 파일에서 사용하게 모듈화
module.exports = router;
