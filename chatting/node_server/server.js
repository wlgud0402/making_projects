const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const redisAdapter = require("socket.io-redis");
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

// const link = async () => {
//   try {
//     await io.of("/").adapter.remoteJoin("<my-id>", "room1");
//   } catch (e) {
//     // the socket was not found
//   }
// };

app.set("view engine", "ejs"); //뷰엔진으로 ejs를 세팅
app.use(express.static("public")); //static 폴더 설정
app.use("/peerjs", peerServer); //peerServer

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`); //uuidv4()함수를 이용해 새로 id생성후 그곳으로 redirect
  //   res.status(200).send("hello world"); == HttpResponse
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room }); //url에서 room은 홈에서 리다이렉트된 uuid를 뜻함
});

server.listen(process.env.PORT || 3030);
