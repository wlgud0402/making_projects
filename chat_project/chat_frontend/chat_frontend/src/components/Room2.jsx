import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShowVideo from "./ShowVideo";
import io from "socket.io-client";
import ShowLocalVideo from "./ShowLocalVideo";
import { useHistory } from "react-router-dom";

const receivedPeerIds = new Set();
////////////////////////////////
let socket;

const Room2 = ({ location }) => {
  let history = useHistory();
  let displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  let peerRef = useRef("");
  const ENDPOINT = "http://localhost:5000";

  const [roomNumber, setRoomNumber] = useState("");
  const [localPip, setLocalPip] = useState([]);
  const [pips, setPips] = useState([]);
  const onCopyToClipboard = (e) => {
    alert("초대주소가 클립보드에 저장되었습니다.");
  };
  let uuid = document.location.href.split("/room2/")[1];
  const [disconnectedUser, setDisconnectedUser] = useState("");

  useEffect(() => {
    (async () => {
      const peer = new Peer(undefined, {
        host: "localhost",
        port: "3001",
        path: "/",
      });
      peerRef.current = peer;
      // var socket = io('http://localhost:5000', { transport : ['websocket'] });
      socket = io(ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });

      peer.on("open", async () => {
        const room_data = await axios.get(
          `http://localhost:8000/api/chat/getroom/?uuid=${uuid}`
        );
        setRoomNumber(room_data.data.room_id);

        //방에 들어왔다는것을 의미합니다. => 방번호를 보냅니다.
        socket.emit("join-room", room_data.data.room_id, peer.id);

        socket.on("createMessage", (jsonData) => {
          if (jsonData.peer_id !== peer.id) {
            console.log(
              "index.js에서 socket.emit이 발생 jsonData를 받아옴",
              jsonData.nickname,
              jsonData.message
            );
          }
        });

        ////////////여기 할차례 => index.js에서 발생시킨 user-had-left
        //가 일어나면 여기서 로직을 실행함
        //pips의 pip와 전부 비교해서 pip.peer_id 가 내가 받은
        //peer_id와 같을경우 삭제하려고 했지만 pips가 빈배열로 나온다 ㅠ
        socket.on("user-had-left", (room_id, peer_id) => {
          setDisconnectedUser(peer_id);
          console.log(room_id, "번방의", peer_id, "가갔욤");
          console.log("나가기전: pips ", pips);
          setPips((prevPips) => {
            const nextPips = pips.filter((pip) => pip.peer_id !== peer_id);
            return nextPips;
          });
        });

        socket.on("user-disconnected", () => {
          console.log("연결이 끊킨 socket: ", socket);
        });

        if (localStorage.getItem("user_token")) {
          let user_token = localStorage.getItem("user_token");
          let info = jwt_decode(user_token);

          const new_user = await axios.post(
            "http://localhost:8000/api/user/peer/",
            {
              user_id: info.user_id,
              room_id: room_data.data.room_id,
              room_uuid: uuid,
              peer_id: peer.id,
            }
          );
        } else {
          const guest_nickname = await prompt(
            "사용하실 닉네임을 입력해주세요."
          );
          console.log(
            "room_data.data.room_id",
            room_data.data.room_id,
            guest_nickname,
            peer.id,
            uuid
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
        }

        //위에서 if 로직으로 회원유저, 비회원유저를 구분하고 데이터를 저장해주었다.

        const peer_data = await axios.get(
          `http://localhost:8000/api/user/peerbyroom/${room_data.data.room_id}`
        );
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myStream.muted = true;

        let user_token = localStorage.getItem("user_token");
        let info = jwt_decode(user_token);

        //따로 관리해줄 내 정보/////////////////////
        const localPipInfo = {
          peer_id: peer.id,
          nickname: info.nickname,
          user_type: info.user_type,
          stream: myStream,
        };
        setLocalPip(localPipInfo);

        //다른유저가 보낸 콜을 받을시에
        peer.on("call", function (call) {
          console.log(
            "call을 받았다!!! 나도 뭔가를 전해주자 myStream",
            myStream
          );
          call.on("stream", async (otherStream) => {
            console.log(
              "스트림받음call.on otherstream1111111",
              otherStream,
              call
            );
            console.log("call.peer: 연락을 받은 유저의 peer", call.peer);

            const user_data = await axios.get(
              `http://localhost:8000/api/user/?peer_id=${call.peer}`
            );

            const pip = {
              peer_id: call.peer,
              nickname: user_data.data.nickname,
              user_type: user_data.data.user_type,
              stream: otherStream,
            };
            if (receivedPeerIds.has(call.peer)) {
              if (call.metadata) {
                console.log("화면공유 or 화면공유 종료");
                setPips((prevPips) => {
                  const samePeerRemovedPips = pips.filter(
                    (pip) => pip.peer_id !== call.peer
                  );
                  const newPips = [...samePeerRemovedPips, pip];
                  return newPips;
                });
              } else {
                console.log("아무런 동작도 하지 않습니다.");
              }
            } else {
              receivedPeerIds.add(call.peer);
              setPips((pips) => {
                const newPips = [...pips, pip];
                return newPips;
              });
            }
          });
          call.answer(myStream);
        });

        //같은 방에 있는 모든 peer id를 가져옴 이제 연결해주면됨!
        peer_data.data.all_peer_ids.forEach((peerdata) => {
          if (peerdata.peer_id === peer.id) return; //내가 내자신한테 할필요는 없다
          // 내가나와 연결된 사람에게 콜합니다...
          let call = peer.call(peerdata.peer_id, myStream);

          // 다른사람의 answer로 stream을 받아옵니다 ㅎㅎ
          call.on("stream", async (otherStream) => {
            console.log(
              "call.answer를 통해 다른사람의 스트림을 받아옴 otherStream: 22222",
              otherStream,
              "peerdata.peer_id::::",
              peerdata.peer_id
            );

            const user_data = await axios.get(
              `http://localhost:8000/api/user/?peer_id=${peerdata.peer_id}`
            );

            const pip = {
              peer_id: peerdata.peer_id,
              nickname: user_data.data.nickname,
              user_type: user_data.data.user_type,
              stream: otherStream,
            };
            if (receivedPeerIds.has(peerdata.peer_id)) {
            } else {
              receivedPeerIds.add(peerdata.peer_id);
              setPips((pips) => {
                const newPips = [...pips, pip];
                return newPips;
              });
            }
          });
        });
      });
    })();
    return function cleanup() {
      console.log("클린펑션실행");
      socket.emit("user-outroom", {
        room_id: "roomNumber",
        peer_id: "localPip.peer_id",
      });
      // socket.close();
    };
  }, []);

  function cleanup() {
    console.log("디스이즈 클린업 펑션");
    // socket.emit("user-outroom");
  }

  //메시지 관련
  const textMessageRef = useRef();
  const [textMessage, setTextMessage] = useState("");

  const onSubmitMessage = async (e) => {
    e.preventDefault();
    axios.post("http://localhost:8000/api/chat/getmessage/", {
      message: textMessage,
      nickname: localPip.nickname,
      room_id: roomNumber,
      peer_id: localPip.peer_id,
    });
    setTextMessage("");
    textMessageRef.current.value = "";
  };

  const onChangeTextMessage = (e) => {
    setTextMessage(e.target.value);
  };

  const onOutRoom = (e) => {
    socket.emit("user-outroom");
    history.push("/");
    // socket.close(1005, "user clicked outRoomButton");
  };

  const onShareMyScreen = async (e) => {
    const myScreenStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    const room_data = await axios.get(
      `http://localhost:8000/api/chat/getroom/?uuid=${uuid}`
    );
    console.log("room_data.data: 내 화면공유를 위해1", room_data.data);

    const peer_data = await axios.get(
      `http://localhost:8000/api/user/peerbyroom/${room_data.data.room_id}`
    );

    peer_data.data.all_peer_ids.forEach((peerdata) => {
      if (peerdata.peer_id === peerRef.current.id) return; //내가 내자신한테 할필요는 없다
      // 내가나와 연결된 사람에게 콜합니다...
      peerRef.current.call(peerdata.peer_id, myScreenStream, {
        metadata: JSON.stringify({ streamType: "SCREEN" }),
      });
    });

    //화면공유가 종류된후
    const screenTrack = myScreenStream.getTracks()[0];
    screenTrack.onended = async () => {
      const myStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      myStream.muted = true;
      peer_data.data.all_peer_ids.forEach((peerdata) => {
        if (peerdata.peer_id === peerRef.current.id) return; //내가 내자신한테 할필요는 없다
        // 내가나와 연결된 사람에게 콜합니다...
        peerRef.current.call(peerdata.peer_id, myStream, {
          metadata: JSON.stringify({ streamType: "ENDSCREEN" }),
        });
      });
    };
  };

  //   this._peer.call(peerId, localScreenStream, {
  //     metadata: JSON.stringify({ streamType: streamTypes.SCREEN }),
  // });

  return (
    <div>
      <h1>Room2.jsx</h1>
      <div>
        <CopyToClipboard text={document.location.href}>
          <button onClick={onCopyToClipboard}>초대</button>
        </CopyToClipboard>
        <form onSubmit={onSubmitMessage}>
          <input
            type="text"
            name="textMessage"
            onChange={onChangeTextMessage}
            ref={textMessageRef}
          />
          <button type="submit">제출</button>
        </form>
      </div>
      {/* 나만 보여주기 */}
      <ShowLocalVideo key={localPip.peer_id} pip={localPip} />
      <button onClick={onShareMyScreen}>내 화면을 공유해라 시발!</button>
      <button onClick={onOutRoom}>방나가기</button>
      {/* 다른사람도 보여주느곳ㄴ */}
      {pips.map((pip) => {
        if (localPip.peer_id === pip.peer_id) return;
        if (pip.peer_id === disconnectedUser) return;
        return <ShowVideo key={pip.peer_id} pip={pip} />;
      })}
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
