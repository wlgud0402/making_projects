import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShowVideo from "./ShowVideo";
import io from "socket.io-client";
import ShowLocalVideo from "./ShowLocalVideo";
import styled from "styled-components";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

const receivedPeerIds = new Set();
////////////////////////////////
let socket;
// let chattings = [];
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
  const [chattings, setChattings] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
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
        setRoomName(room_data.data.room_name);

        //방에 들어왔다는것을 의미합니다. => 방번호를 보냅니다.
        socket.emit("join-room", room_data.data.room_id, peer.id);

        socket.on("createMessage", (jsonData) => {
          if (jsonData.peer_id !== peer.id) {
            // chattings.push([jsonData.nickname, jsonData.message]);
            const new_chat = [jsonData.nickname, jsonData.message];
            console.log(chattings);
            setChattings((chatting) => {
              const newChattings = [...chatting, new_chat];
              return newChattings;
            });
            // $("ul").append(
            //   `<div class="otherMessage"><li>${jsonData.nickname}</li><li>${jsonData.message}</li></div>`
            // );
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
          call.on("stream", async (otherStream) => {
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
    return () => {
      console.log("기 가즈아ㅏㅏㅏㅏ");
      socket.off();
      // socket.close();
    };
    // return async function cleanup() {
    //   console.log("클린펑션실행");
    //   const room_data = await axios.get(
    //     `http://localhost:8000/api/chat/getroom/?uuid=${uuid}`
    //   );
    //   let user_token = localStorage.getItem("user_token");
    //   let info = jwt_decode(user_token);

    //   const user_data = await axios.get(
    //     `http://localhost:8000/api/user/?user_id=${info.user_id}`
    //   );

    //   socket.close();

    //   socket.emit("user-outroom", {
    //     room_id: room_data.data.room_id,
    //     peer_id: user_data.data.peer_id,
    //   });
    //   // socket.close();
    // };
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
    const new_chat = ["own", textMessage];
    // console.log(chattings);
    setChattings((chatting) => {
      const newChattings = [...chatting, new_chat];
      return newChattings;
    });
    // chattings.push(["own", textMessage]);
    // console.log(chattings);
    // $("ul").append(`<div class="myMessage"><li>${textMessage}</li></div>`);

    setTextMessage("");
    textMessageRef.current.value = "";
  };

  const onChangeTextMessage = (e) => {
    setTextMessage(e.target.value);
  };

  const onOutRoom = (e) => {
    socket.emit("user-outroom", localPip);
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
    <>
      <MainHeader>
        <div className="MainHeaderInfo">
          <div className="headerRoomNumber">{roomNumber}</div>
          <div className="headerRoomName">{roomName}</div>
        </div>
        <div className="MainHeaderControls">
          <div className="Controldiv">
            <CopyToClipboard text={document.location.href}>
              <FontAwesomeIcon
                className="inviteIcon headerIcon"
                icon={faUsers}
                size="2x"
                onClick={onCopyToClipboard}
              />
            </CopyToClipboard>
            <p className="arrow_box">초대하기</p>
          </div>
          <div className="Controldiv">
            <FontAwesomeIcon
              className="screenShareIcon headerIcon"
              icon={faDesktop}
              size="2x"
              onClick={onShareMyScreen}
            />
            <p className="arrow_box">화면공유</p>
          </div>
          <div className="Controldiv">
            <FontAwesomeIcon
              className="videoPlayStopIcon headerIcon"
              icon={faVideo}
              size="2x"
            />
            <p className="arrow_box">카메라끄기</p>
          </div>
          <div className="Controldiv">
            <FontAwesomeIcon
              className="muteUnMuteIcon headerIcon"
              icon={faMicrophone}
              size="2x"
            />
            <p className="arrow_box">마이크끄기</p>
          </div>
          <div className="Controldiv">
            <FontAwesomeIcon
              className="getOutRoom headerIcon"
              icon={faDoorOpen}
              size="2x"
              onClick={onOutRoom}
            />
            <p className="arrow_box">방 나가기</p>
          </div>
        </div>
      </MainHeader>

      <Main>
        <MainLeft>
          <MainVideos>
            <ShowLocalVideo key={localPip.peer_id} pip={localPip} />
            {pips.map((pip) => {
              if (localPip.peer_id === pip.peer_id) return;
              if (pip.peer_id === disconnectedUser) return;
              return <ShowVideo key={pip.peer_id} pip={pip} />;
            })}
          </MainVideos>
        </MainLeft>
        <MainRight>
          <ChatHeader>채팅</ChatHeader>
          <ChatBody>
            <ul className="messages">
              {chattings.map((chat) => {
                if (chat[0] === "own") {
                  return (
                    <div className="myOwnChatBox">
                      <li className="myOwnChat">{chat[1]}</li>
                    </div>
                  );
                } else {
                  return (
                    <>
                      <OtherUserNickname>
                        <li>{chat[0]}</li>
                      </OtherUserNickname>
                      <div className="otherChatBox">
                        <li className="otherChat">{chat[1]}</li>
                      </div>
                    </>
                  );
                }
              })}
            </ul>
          </ChatBody>
          <ChatContainer>
            {/* <textarea></textarea> */}
            <form onSubmit={onSubmitMessage}>
              <input
                type="text"
                name="textMessage"
                onChange={onChangeTextMessage}
                placeholder="메세지를 입력해주세요..."
                ref={textMessageRef}
              />
              <button type="submit">전송</button>
            </form>
          </ChatContainer>
        </MainRight>
      </Main>
    </>
  );
};

export default Room2;
// main, mainheader mainleft mainvideos mainright chatheader

const Main = styled.div`
  height: 100vh;
  display: flex;
  padding-top: 54px;
`;

const MainLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.8;
`;

const MainRight = styled.div`
  flex: 0.2;
  background-color: #242324;
  display: flex;
  flex-direction: column;
`;

const MainVideos = styled.div`
  flex-grow: 1;
  flex-wrap: wrap;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainHeader = styled.div`
  /* display: block; */
  background-color: #1c1e20;
  display: flex;
  padding: 4px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  .MainHeaderControls {
    display: flex;
    flex: 0.2;
    justify-content: space-between;

    .Controldiv {
      position: relative;
      display: inline-block;
    }
  }

  .MainHeaderInfo {
    display: flex;
    flex: 0.6;
    /*  */
  }

  .headerIcon {
    color: #d2d2d2;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
    &:hover + p.arrow_box {
      display: block;
    }
  }

  .headerRoomNumber {
    font-size: 27px;
    border: 1px solid;
    border-radius: 68%;
    background-color: white;
    padding: 2px 15px 2px 15px;
  }

  .headerRoomName {
    font-size: 27px;
    font-weight: bold;
    margin-left: 10px;
    color: white;
  }

  .getOutRoom {
    color: red;
    opacity: 0.5;
    transition: all 0.1s ease-in;

    &:hover {
      opacity: 1;
    }
  }

  .arrow_box {
    display: none;
    position: absolute;
    width: 100px;
    padding: 8px;
    left: 0;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #333;
    color: #fff;
    font-size: 14px;
  }

  .arrow_box:after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    height: 0;
    margin-left: -10px;
    border: solid transparent;
    border-color: rgba(51, 51, 51, 0);
    border-bottom-color: #333;
    border-width: 10px;
    pointer-events: none;
    content: " ";
  }

  /* .screenShareIcon {
    color: blue;
    background-color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }

  .videoPlayStopIcon {
    color: yello;
    background-color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }

  .muteUnMuteIcon {
    color: purple;
    background-color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  }
  .inviteIcon {
    color: orange;
    background-color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
  } */
`;

const ChatHeader = styled.div`
  display: block;
  color: #f5f5f5;
  text-align: center;
  padding: 15px;
  font-size: 21px;
`;
//채팅관련
const ChatBody = styled.div`
  flex-grow: 1;
  overflow-y: scroll;
  /* .myMessage {
    color: white;
    font-size: 24px;
  } */

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    padding: 0px 10px 0px 10px;
    .otherChatBox {
      display: flex;
      color: black;
      justify-content: flex-start;

      /* .otherUserNickname {
        color: white;
      } */

      .otherChat {
        background-color: darkgray;
        font-weight: bold;
        /* border: 1px solid darkgray; */
        border-radius: 50px;
        padding: 0px 10px 0px 10px;
        margin-bottom: 5px;
      }
    }

    .myOwnChatBox {
      display: flex;
      justify-content: flex-end;
      color: black;

      .myOwnChat {
        margin-bottom: 5px;
        background-color: lawngreen;
        font-weight: bold;
        /* border: 1px solid lawngreen; */
        border-radius: 50px;
        padding: 0px 10px 0px 10px;
      }
    }
  }
`;
const OtherUserNickname = styled.div`
  color: white;
  font-size: 12px;
  margin-bottom: 2px;
`;

const ChatContainer = styled.div`
  padding: 22px 12px;
  display: flex;

  input {
    flex-grow: 1;
    background-color: transparent;
    border: none;
    color: #f5f5f5;
    width: 275px;
    height: 38px;
  }

  button {
    border: none;
    background-color: green;
    height: 38px;
    border-radius: 4px;
    transition: all 0.1s ease-in;
    &:hover {
      background-color: lawngreen;
    }
  }
`;
