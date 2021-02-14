// var express = require('express');
// var app = express();
// var server = require('http').createServer(app);
// var io = require('../..')(server);
// io.on('connection', (socket) =>  {
//   socket.on('new message', (data) => {
//     socket.broadcast.emit('new message', data);
//   });
// });

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs"); //뷰엔진으로 ejs를 세팅
app.use(express.static("public")); //static 폴더 설정
app.use("/peerjs", peerServer); //peerServer

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/room/:roomNumber", (req, res) => {
  res.render("room");
});

app.get("/room/:roomNumber", (req, res) => {
  res.render("room");
});

server.listen(process.env.PORT || 3030);
