import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShowVideo from "./ShowVideo";
import io from "socket.io-client";
import Clock from "react-live-clock";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
// import { faLockOpen } from "@fortawesome/free-solid-svg-icons";

const receivedPeerIds = new Set();
////////////////////////////////
let socket;
// let chattings = [];
const Room2 = ({ location }) => {
  const videoRef = useRef(null);
  let history = useHistory();
  let displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: false,
  };

  let peerRef = useRef("");
  const ENDPOINT = "http://localhost:5000";
  const chatBodyRef = useRef();
  const [chattings, setChattings] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomLock, setRoomLock] = useState("");
  const [localPip, setLocalPip] = useState([]);
  const [pips, setPips] = useState([]);
  const [userNickname, setUserNickname] = useState("");
  const [userType, setUserType] = useState("");
  const [videoState, setVideoState] = useState("");
  const [soundState, setSoundState] = useState("");

  //채팅이 쳐진후 스크롤을 가장 아래로 => chattings.length가 변하면 실행
  useEffect(() => {
    const chatBodyElement = chatBodyRef.current;
    chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
  }, [chattings.length]);
  // const scrollToBottom = () => {
  //   const chatBodyElement = chatBodyRef.current;
  //   chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
  //   console.log(chatBodyRef);
  // };

  const onCopyToClipboard = (e) => {
    alert("초대주소가 클립보드에 저장되었습니다.");
  };
  let uuid = document.location.href.split("/room2/")[1];
  const [disconnectedUser, setDisconnectedUser] = useState("");

  // useEffect(() => {
  //   return () => {
  //     console.log("...");
  //   };
  // }, []);

  // peerjs --port 3001 => 새로운 터미널에서 peerjs를 키고 여기서 거기로 붙는다
  // const [pips, setPips] = useState([]);

  useEffect(() => {
    (async () => {
      const peer = new Peer(undefined, {
        host: "localhost",
        port: "3001",
        path: "/",
      });
      peerRef.current = peer;
      socket = io(ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });

      peer.on("open", async () => {
        const room_data = await axios.get(`/api/chat/getroom/?uuid=${uuid}`);
        setRoomNumber(room_data.data.room_id);
        setRoomName(room_data.data.room_name);
        setRoomLock(room_data.data.is_private);
        setVideoState(true);
        setSoundState(true);

        //방에 들어왔다는것을 의미합니다. => 방번호를 보냅니다.
        socket.emit("join-room", room_data.data.room_id, peer.id);

        socket.on("createMessage", (jsonData) => {
          if (jsonData.peer_id !== peer.id) {
            const new_chat = [jsonData.nickname, jsonData.message];
            setChattings((chatting) => {
              const newChattings = [...chatting, new_chat];
              return newChattings;
            });
          }
        });

        socket.on("user-had-left", (room_id, peer_id) => {
          setDisconnectedUser(peer_id);
          setPips((prevPips) => {
            const nextPips = pips.filter((pip) => pip.peer_id !== peer_id);
            return nextPips;
          });
        });

        // socket.on("user-disconnected", () => {
        //   console.log("연결이 끊킨 socket: ", socket);
        // });

        if (localStorage.getItem("user_token")) {
          let user_token = localStorage.getItem("user_token");
          let info = jwt_decode(user_token);

          setUserNickname(info.nickname);
          setUserType(info.user_type);

          await axios.post("/api/user/peer/", {
            user_id: info.user_id,
            room_id: room_data.data.room_id,
            room_uuid: uuid,
            peer_id: peer.id,
          });
        } else {
          const guest_nickname = prompt("사용하실 닉네임을 입력해주세요.");
          const guest_data = await axios.post("/api/user/peer/guest", {
            nickname: guest_nickname,
            peer_id: peer.id,
            room_id: room_data.data.room_id,
            room_uuid: uuid,
          });
          localStorage.setItem("user_token", guest_data.data.user_token);
          let guest_token = localStorage.getItem("user_token");
          let info = jwt_decode(guest_token);
          setUserNickname(info.nickname);
          setUserType(info.user_type);
        }

        //위에서 if 로직으로 회원유저, 비회원유저를 구분하고 데이터를 저장해주었다.

        const peer_data = await axios.get(
          `/api/user/peerbyroom/${room_data.data.room_id}`
        );
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myStream.muted = true;

        videoRef.current.srcObject = myStream;
        videoRef.current.muted = true;

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
              `/api/user/?peer_id=${call.peer}`
            );

            const pip = {
              peer_id: call.peer,
              nickname: user_data.data.nickname,
              user_type: user_data.data.user_type,
              stream: otherStream,
            };
            if (receivedPeerIds.has(call.peer)) {
              if (call.metadata) {
                setPips((prevPips) => {
                  const samePeerRemovedPips = pips.filter(
                    (pip) => pip.peer_id !== call.peer
                  );
                  const newPips = [...samePeerRemovedPips, pip];
                  return newPips;
                });
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
            const user_data = await axios.get(
              `/api/user/?peer_id=${peerdata.peer_id}`
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
      socket.close();
    };
  }, []);

  //메시지 관련
  const textMessageRef = useRef();
  const [textMessage, setTextMessage] = useState("");

  const onSubmitMessage = async (e) => {
    e.preventDefault();
    axios.post("/api/chat/getmessage/", {
      message: textMessage,
      nickname: localPip.nickname,
      room_id: roomNumber,
      peer_id: localPip.peer_id,
    });
    const new_chat = ["own", textMessage];
    setChattings((chatting) => {
      const newChattings = [...chatting, new_chat];
      return newChattings;
    });

    setTextMessage("");
    textMessageRef.current.value = "";
  };

  const onChangeTextMessage = (e) => {
    setTextMessage(e.target.value);
  };

  const onOutRoom = (e) => {
    // socket.emit("user-outroom", localPip);
    history.push("/");
    socket.close();
    // socket.close(1005, "user clicked outRoomButton");
  };

  const onShareMyScreen = async (e) => {
    const myScreenStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );

    const room_data = await axios.get(`/api/chat/getroom/?uuid=${uuid}`);
    const peer_data = await axios.get(
      `/api/user/peerbyroom/${room_data.data.room_id}`
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

  const playStop = () => {
    const enabled = videoRef.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
      videoRef.current.srcObject.getVideoTracks()[0].enabled = false;
      setVideoState(false);
    } else {
      videoRef.current.srcObject.getVideoTracks()[0].enabled = true;
      setVideoState(true);
    }
  };

  //음소거
  const muteUnmute = () => {
    const enabled = videoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      setSoundState(false);
    } else {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = true;
      setSoundState(true);
    }
  };

  const onLockRoom = async (e) => {
    if (userType === "MEMBER") {
      const roomPassword = prompt("비밀번호를 설정하세요");
      if (roomPassword === null) {
        return;
      }
      if (roomPassword === "") {
        alert("비밀번호는 필수 항목입니다.");
        return;
      }
      const roomIsPrivate = await axios.get(`/api/chat/room/?id=${roomNumber}`);

      //비밀번호가 없던방!
      if (roomIsPrivate.data.uuid) {
        const res = await axios.post(`/api/chat/roompassword/`, {
          room_id: roomNumber,
          room_password: roomPassword,
        });
        setRoomLock(!roomLock);
        alert(res.data.msg);
      }
    } else {
      alert("비밀번호설정은 방 개설자만 할수 있습니다.");
    }
  };

  const onUnLockRoom = async () => {
    if (userType === "MEMBER") {
      const res = await axios.put(`/api/chat/roompassword/`, {
        room_id: roomNumber,
      });
      setRoomLock(!roomLock);
      alert(res.data.msg);
    } else {
      alert("비밀번호설정은 방 개설자만 할수 있습니다.");
    }
  };

  return (
    <>
      <MainHeader>
        <div className="MainHeaderInfo">
          <div className="headerRoomNumber">{roomNumber}</div>
          <div className="headerRoomName">{roomName}</div>
        </div>
        <div className="MainHeaderControls">
          <div className="Controldiv">
            {!roomLock ? (
              <FontAwesomeIcon
                className="inviteIcon headerIcon"
                icon={faLockOpen}
                size="2x"
                onClick={onLockRoom}
              />
            ) : (
              <FontAwesomeIcon
                className="inviteIcon headerIcon"
                icon={faLock}
                size="2x"
                onClick={onUnLockRoom}
              />
            )}
            {!roomLock ? (
              <p className="arrow_box">잠금 하기</p>
            ) : (
              <p className="arrow_box">잠금 해제</p>
            )}
          </div>
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
            {videoState === true ? (
              <FontAwesomeIcon
                className="videoPlayStopIcon headerIcon"
                icon={faVideo}
                size="2x"
                onClick={playStop}
              />
            ) : (
              <FontAwesomeIcon
                className="videoPlayStopIcon headerIcon slashStyle"
                icon={faVideoSlash}
                size="2x"
                onClick={playStop}
              />
            )}
            {videoState === true ? (
              <p className="arrow_box">카메라 끄기</p>
            ) : (
              <p className="arrow_box">카메라 켜기</p>
            )}
          </div>

          {/*  */}

          <div className="Controldiv">
            {soundState === true ? (
              <FontAwesomeIcon
                className="muteUnMuteIcon headerIcon"
                icon={faMicrophone}
                size="2x"
                onClick={muteUnmute}
              />
            ) : (
              <FontAwesomeIcon
                className="muteUnMuteIcon headerIcon slashStyle"
                icon={faMicrophoneSlash}
                size="2x"
                onClick={muteUnmute}
              />
            )}
            {soundState === true ? (
              <p className="arrow_box">마이크 끄기</p>
            ) : (
              <p className="arrow_box">마이크 켜기</p>
            )}
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
        <div className="clockDiv">
          <Clock
            className="clock"
            format={"HH:mm"}
            ticking={true}
            timezone={"Asia/Seoul"}
          />
        </div>
      </MainHeader>

      <Main>
        <MainLeft>
          <MainVideos>
            <div className="myVideo">
              <div className="myNickname">{userNickname}</div>
              <video className="localVideo" ref={videoRef} autoPlay />
            </div>
            {pips.map((pip) => {
              if (localPip.peer_id === pip.peer_id) return;
              if (pip.peer_id === disconnectedUser) return;
              return <ShowVideo key={pip.peer_id} pip={pip} />;
            })}
          </MainVideos>
        </MainLeft>
        <MainRight>
          <ChatHeader>채팅</ChatHeader>
          <ChatBody ref={chatBodyRef}>
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

  .localVideo {
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    -moz-transform: rotateY(180deg); /* Firefox */
  }

  .myNickname {
    z-index: 10;
    position: absolute;
    color: white;
    font-size: 23px;
    font-weight: bold;
  }

  .otherNickname {
    z-index: 10;
    position: absolute;
    color: white;
    font-size: 23px;
    font-weight: bold;
  }
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

  .clockDiv {
    flex: 0.2;
    color: white;
    font-size: 31px;
    font-weight: bold;

    .clock {
      float: right;
      padding-right: 10px;
    }
  }

  .MainHeaderControls {
    display: flex;
    flex: 0.2;
    justify-content: space-between;

    .Controldiv {
      position: relative;
      display: inline-block;

      .slashStyle {
        color: red;
      }
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

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    padding: 0px 10px 0px 10px;
    .otherChatBox {
      display: flex;
      color: black;
      justify-content: flex-start;

      .otherChat {
        background-color: darkgray;
        font-weight: bold;
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
