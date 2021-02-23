import React, { useEffect } from "react";
import Peer from "peerjs";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Room2 = (props) => {
  const onCopyToClipboard = (e) => {
    alert("초대주소가 클립보드에 저장되었습니다.");
  };

  const videoGrid = document.getElementById("video-grid");

  let uuid = document.location.href.split("/room2/")[1];
  useEffect(() => {
    (async () => {
      const peer = new Peer(undefined, {
        host: "localhost",
        port: "3001",
        path: "/",
      });
      console.log("uuid주소에서 바다옴", uuid);

      peer.on("open", async () => {
        console.log("peer.on 'OPEN 실행!' => peer.id", peer.id);
        const room_data = await axios.get(
          `http://localhost:8000/api/chat/getroom/?uuid=${uuid}`
        );

        console.log("room_data.data => room_id찾음", room_data.data);

        if (localStorage.getItem("user_token")) {
          let user_token = localStorage.getItem("user_token");
          let info = jwt_decode(user_token);

          const hello = await axios.post(
            "http://localhost:8000/api/user/peer/",
            {
              user_id: info.user_id,
              room_id: room_data.data.room_id,
              room_uuid: uuid,
              peer_id: peer.id,
            }
          );
          console.log(
            hello.data,
            "이미가입된 유저uuid로 room_id를 찾고, JWT토큰으로 유저를찾아서 room_id, peer_id 넣어줌"
          );
        } else {
          console.log(
            "JWT토큰이없다 => 아직 어떤 처리도되지않았다. 게스트만들어주기"
          );
          const guest_nickname = await prompt(
            "사용하실 닉네임을 입력해주세요."
          );
          const guest_data = await axios.post(
            "http://localhost:8000/api/user/peer/guest",
            {
              nickname: guest_nickname,
              peer_id: peer.id,
              room_id: room_data.data.room_id,
              room_uuid: uuid,
            }
          );
          localStorage.setItem("user_token", guest_data.data.user_token);
          console.log("비로그인유저 처리 완료", guest_data.data);
        }

        console.log(
          "룸아이디를 통해 연결된 유저들의( 같은 방유저 ) peerid를 모두 가져옴"
        );

        const peer_data = await axios.get(
          `http://localhost:8000/api/user/peerbyroom/${room_data.data.room_id}`
        );
        console.log(peer_data.data.all_peer_ids);

        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myStream.muted = true;

        // document.getElementById("my_video").srcObject = myStream;
        // const myVideo = await document.createElement("video");
        // myVideo.muted = true;

        // const video = document.createElement("video");
        // addVideoStream(myVideo, myStream);

        //다른유저가 보낸 콜을 받을시에
        peer.on("call", function (call) {
          console.log("call그자체", call);
          console.log(
            "call을 받았다!!! 나도 뭔가를 전해주자 myStream",
            myStream
          );

          call.on("stream", (otherStream) => {
            console.log("전화받구아더스터림", otherStream);
          });

          call.answer(myStream);
        });

        //같은 방에 있는 모든 peer id를 가져옴 이제 연결해주면됨!
        peer_data.data.all_peer_ids.forEach((peerdata) => {
          if (peerdata.peer_id === peer.id) return; //내가 내자신한테 할필요는 없다
          // 내가나와 연결된 사람에게 콜합니다...ㄴㄴ
          let call = peer.call(peerdata.peer_id, myStream);
          // 다른사람의 answer로 stream을 받아옵니다 ㅎㅎ
          call.on("stream", (otherStream) => {
            console.log(
              "call.answer를 통해 다른사람의 스트림을 받아옴 otherStream: ",
              otherStream
            );

            // const video = document.createElement("video");
            // video.srcObject = otherStream;
            // video.muted = true;
            // video.addEventListener("loadedmetadata", () => {
            //   video.play();
            // });
            // videoGrid.append(video);
          });
        });
      });
    })();
  }, []);

  return (
    <div>
      <h1>Room2.jsx</h1>
      <div>
        <CopyToClipboard text={document.location.href}>
          <button onClick={onCopyToClipboard}>초대</button>
        </CopyToClipboard>
      </div>
      <div id="video-grid">
        <video id="my_video" autoPlay />
      </div>
    </div>
  );
};

export default Room2;

// navigator.mediaDevices.getUserMedia(
//   { video: true, audio: true },
//   (stream) => {
//     const call = peer.call("another-peers-id", stream);
//     call.on("stream", (remoteStream) => {
//       // Show stream in some <video> element.
//     });
//   },
//   (err) => {
//     console.error("Failed to get local stream", err);
//   }
// );

// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//   });
//   videoGrid.append(video);
// };
