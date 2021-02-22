import React, { useEffect } from "react";
import Peer from "peerjs";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Room2 = (props) => {
  // let link = document.location.href;
  // let idx = link.indexOf("/room2/");
  // let uuid = link.substring(idx + 7, link.length);
  let uuid = document.location.href.split("/room2/")[1];
  useEffect(() => {
    (async () => {
      const peer = new Peer(undefined, {
        host: "localhost",
        port: "3001",
        path: "/",
      });

      const room_data = await axios.get(
        `http://localhost:8000/api/chat/getroom/?uuid=${uuid}`
      );

      if (localStorage.getItem("user_token")) {
        let user_token = localStorage.getItem("user_token");
        let info = jwt_decode(user_token);

        axios.post("http://localhost:8000/api/user/peer/", {
          user_id: info.user_id,
          room_id: room_data.data.room_id,
          peer_id: peer.id,
        });
        console.log(
          "uuid로 room_id를 찾고, JWT토큰으로 유저를찾아서 room_id, peer_id 넣어줌"
        );
      } else {
        console.log("JWT토큰이없다 => 아직 어떤 처리도되지않았다.");
      }

      peer.on("open", () => {
        console.log("peer.on 'OPEN 실행!' => peer.id", peer.id);
      });

      peer.on("call", function (call) {
        console.log("따르릉");
        call.on("stream", function (stream) {
          console.log("따르릉스트림", stream);
        });
      });

      peer.on("call", async function (call) {
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        call.answer(myStream);
      });

      window.start = async (otherPeerId) => {
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log(myStream);

        console.log("전화걸자...!");

        var call = peer.call(otherPeerId, myStream);
        call.on("stream", (otherStream) => {
          console.log("답장");
          console.log(otherStream);
        });
      };
    })();
  }, []);

  return (
    <div>
      <h1>각방</h1>
      <div>
        <h5>대화창ㄴ</h5>
      </div>
    </div>
  );
};

export default Room2;
