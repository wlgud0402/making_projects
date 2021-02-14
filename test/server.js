// const content = require("fs").readFileSync(__dirname + "/test.html", "utf8");
const httpServer = require("http").createServer();

const io = require("socket.io")(httpServer, {
  path: "/abc",
  cors: {
    origin: "*",
  },
});

const sockets = [];

const socket_map = {
  "asdf-dfd-fd-fd-fdf": [],
};

const roomId = "abc";
io.on("connection", (socket) => {
  socket.join(roomId);
  console.log("접속됨");
  sockets.push(socket);
  socket.on("message", (data) => {
    console.log(data);
    io.to(roomId).emit("createMessage", data);
  });
});

setInterval(() => {
  console.log("갯수", sockets.length);
  sockets.forEach((socket) => {
    socket.emit("chat", "ZZZZZZZZZZZ");
  });
}, 10000);

httpServer.listen(3000, () => {
  console.log("ok");
});
