import React from "react";
import { useEffect } from "react";
import Peer from "peerjs";

const Room = (props) => {
  // peerjs --port 3001 => 새로운 터미널에서 peerjs를 키고 여기서 거기로 붙는다
  // const [pips, setPips] = useState([]);
  console.log(props);

  useEffect(() => {
    (async () => {
      const peer = new Peer(undefined, {
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
      <h1>특정룸입니다 여기서 채팅과 영통!</h1>
      <video src=""></video>
    </div>
  );
};

export default Room;
