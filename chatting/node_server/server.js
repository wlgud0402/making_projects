const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

//redis
const redis = require("redis");
const client = redis.createClient(6379, "localhost");

app.set("view engine", "ejs"); //뷰엔진으로 ejs를 세팅
app.use(express.static("public")); //static 폴더 설정
app.use("/peerjs", peerServer); //peerServer

// 1. 홈으로 이동시
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`); //uuidv4()함수를 이용해 새로 id생성후 그곳으로 redirect
  //   res.status(200).send("hello world"); == HttpResponse
});

// 2. url에 uuid를 소지한채로 방으로 이동
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room }); //url에서 room은 홈에서 리다이렉트된 uuid를 뜻함
});

// client.on("subscribe", function (channel, message) {
//   console.log("client subscribe channel " + channel);
// });

client.on("message", function (channel, message) {
  console.log("channel: ", channel);
  console.log("message: ", message);
  switch (channel) {
    case "my-chat":
      const data = JSON.parse(message);
      rooms[data.roomId].forEach((socket) => {
        socket.emit("createMessage", data);
      });

      break;
    default:
      break;
  }
});

client.subscribe("my-chat");
client.subscribe("ddonggo-chat");

const rooms = {};

// socket.emit("join-room", ROOM_ID, id);
// 3. connections이 일어났을때
io.on("connection", (socket) => {
  //socket에서 join-room 발생시
  socket.on("join-room", (roomId, userId) => {
    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
    console.log("roomId: ", roomId);
    console.log("userId: ", userId);
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket);

    console.log("ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ");
    console.log("rooms: ", rooms);

    /*
    // socket을 roomId로 join시킴
    socket.join(roomId);
    // socket이 roomId를 가진 모든곳에 user-connected 발생시킴
    socket.to(roomId).broadcast.emit("user-connected", userId);
    // socket이 message이벤트를 받았을때
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
     */
  });
});

server.listen(process.env.PORT || 3030);
