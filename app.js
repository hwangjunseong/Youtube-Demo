const express = require("express");
const app = express();
app.listen(1818);
//http외의 모듈 => json모듈 미들웨어 설정
app.use(express.json());
const userRouter = require("./routes/users");
const channelRouter = require("./routes/channels");

//미들웨어 사용하겠다고 선언
app.use("/", userRouter);
//공통된 url을 뺴냄
app.use("/channels", channelRouter);
