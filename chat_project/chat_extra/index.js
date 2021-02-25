const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//redis
const redis = require("redis");
const client = redis.createClient(6379, "localhost");
client.subscribe("my-chat");

const rooms = {};

//axios.post요청으로 메시지를 보낸후입니다.
client.on("message", function (subscribeChannel, data) {
  console.log("구독한 채널: ", subscribeChannel);
  console.log("받아온 데이터: ", data);
  switch (subscribeChannel) {
    case "my-chat":
      const jsonData = JSON.parse(data);
      console.log(
        "my-chat에서 발생한 이밴트로 데이터 받아옵",
        jsonData.message
      );
      rooms[jsonData.room_id].forEach((socket) => {
        socket.emit("createMessage", jsonData);
      });
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
  socket.on("join-room", (room_id) => {
    console.log("We have a new connection!!!!");
    if (!rooms[room_id]) {
      rooms[room_id] = [];
    }
    rooms[room_id].push(socket);
  });

  //socket.emit로 보낸 메시지를 받았을때 입니다.
  socket.on("createMessage", (message) => {
    // if (!rooms[room_id]) {
    //   rooms[room_id] = [];
    // }
    // rooms[room_id].push(socket);

    console.log(
      "메시지를 과연 잘 받아왔을까? 이제 이걸 추가해주면 끝인데",
      message
    );
  });

  //연결이 끊어졌을때 입니다.
  socket.on("disconnect", () => {
    console.log("User had left!!!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
