const redis = require("redis");
const client = redis.createClient(6379, "localhost");
client.subscribe("my-chat");

export default client();

// client.on("message", function (channel, message) {
//   console.log("channel: ", channel);
//   console.log("message: ", message);
//   switch (channel) {
//     case "my-chat":
//       const data = JSON.parse(message);
//       rooms[data.roomId].forEach((socket) => {
//         socket.emit("createMessage", data);
//       });
//       break;
//     default:
//       break;
//   }
// });

// const rooms = {};

// 3. connections이 일어났을때
// io.on("connection", (socket) => {
//   //socket에서 join-room 발생시
//   socket.on("join-room", (roomId, userId) => {
//     console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
//     console.log("roomId: ", roomId);
//     console.log("userId: ", userId);
//     if (!rooms[roomId]) {
//       rooms[roomId] = [];
//     }
//     rooms[roomId].push(socket);

//     console.log("ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ");
//     console.log("rooms: ", rooms);
//   });
// });
