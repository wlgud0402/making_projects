const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const peers = {};
myVideo.muted = true;

let peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  // port: "443", //using heroku
  port: "3030",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream); //새로운 유저의 call에 대한 응답
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    //message보내는걸 여기 넣어도 됨

    socket.on("user-disconnected", (userId) => {
      if (peers[userId]) peers[userId].close();
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id); //peer로 id 자동적으로 생성
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream); //userId (형을) stream (내 스트림)으로 call
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream); //형의 stream을 기존의 videoStream에 추가
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
};

//stream가져오고 video 시작하는 함수
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

//text입력시 scroll을 제일 아래로 내려줌
const scrollToBottom = () => {
  let d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

let text = $("input");
let roomId = $("#roomId").val();

$("html").keydown((e) => {
  if (e.which == 13 && text.val().length !== 0) {
    // socket.emit("message", text.val());
    axios.post(
      "http://localhost:8000/api/",
      { message: text.val(), roomId: roomId },
      config
    );
    text.val("");
  }
});

socket.on("createMessage", (message) => {
  $(".messages").append(`<li class="message"><b>user</b>${message.msg}</li>`);
  scrollToBottom();
});

//음소거
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>음소거</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span>음소거해제</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

// 영상멈추기
const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `
  <i class="fas fa-video"></i>
  <span>멈추기</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
  <span>재생</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
