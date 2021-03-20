const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const axios = require("./node_modules/axios");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//redis
const redis = require("redis");
const { type } = require("os");
const client = redis.createClient(6379, "localhost");
client.subscribe("my-chat");
client.subscribe("room-refresh");

const rooms = {};

const roomList = new Set();

//axios.post요청으로 메시지를 보낸후입니다.
client.on("message", function (subscribeChannel, data) {
  switch (subscribeChannel) {
    case "my-chat":
      const messageData = JSON.parse(data);
      //my-chat이벤트로 받아온 데이터 messageData.(room_id, message, nickname);
      rooms[messageData.room_id].forEach((socket) => {
        socket.emit("createMessage", messageData);
      });
      break;
    case "room-refresh":
      setTimeout(() => {
        io.emit("room-refresh");
      }, 1000);
      break;
    default:
      break;
  }
});

//연결이 됬을때 입니다.
io.on("connection", (socket) => {
  //방에 들어온순간 peer.on이 useEffect에서 발동되고 이때 socket.emit('join-room', 방번호)
  //를 통해 방번호를 보내줍니다. 만약 방번호가 내가만든 rooms 딕셔너리에 있다면 받은 소켓을 추가해주고
  //아니라면 방번호를 키값으로한 소켓을 추가합니다. 여기서 서로다른 소켓은 서로 다른 유저를 뜻합니다.
  socket.on("join-room", (room_id, peer_id) => {
    if (!rooms[room_id]) {
      rooms[room_id] = [];
    }
    rooms[room_id].push(socket);
    rooms[room_id][rooms[room_id].length - 1]["room_id"] = room_id;
    rooms[room_id][rooms[room_id].length - 1]["peer_id"] = peer_id;

    axios.post("http://localhost:8000/api/chat/changeroomstatus/", {
      room_id: room_id,
    });
  });

  socket.on("join-roomlist", (data) => {
    roomList.add(socket);
    // socket.broadcast.emit("room-refresh 퍼블리시에 의해 발행");
  });

  //   rooms[jsonData.room_id].forEach((socket) => {
  //     console.log("에밋발생이다");
  //     socket.emit("createMessage", jsonData);
  //   });
  socket.on("user-outroom", (data) => {
    // socket.off();
    console.log("방뉘로가기 or 방 나가기");
  });

  //연결이 끊어졌을때 입니다.
  socket.on("disconnect", (closedsocket) => {
    if (rooms[socket.room_id]) {
      rooms[socket.room_id].forEach((eachsocket) => {
        eachsocket.emit(
          "user-had-left",
          eachsocket.room_id,
          eachsocket.peer_id
        );
      });
    }
    axios.post("http://localhost:8000/api/user/disconnected/", {
      peer_id: socket["peer_id"],
      room_id: socket["room_id"],
    });
    console.log("User had left!!!");

    if (roomList.has(socket)) {
      roomList.delete(socket);
    }
    setTimeout(() => {
      io.emit("room-refresh");
    }, 1000);
  });
});

app.use(router);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
