import { useEffect, useState } from "react";
import React from "react";
import Peer from "peerjs";
// peerjs --port 3001 => 새로운 터미널에서 peerjs를 키고 여기서 거기로 붙는다
const TestPeer = () => {
  // const [pips, setPips] = useState([]);

  useEffect(() => {
    (async () => {
      const peer = new Peer(String(Date.now()), {
        host: "localhost",
        port: "3001",
        path: "/",
      });

      peer.on("open", () => {
        console.log(peer.id);
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
      <h1>형이 테스트할 공간입니다.</h1>
      <video />
      {/* <참여자들 pis={pips}/> */}
    </div>
  );
};

export default TestPeer;
