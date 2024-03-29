import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Header from "./Header";
import Footer from "./Footer";
import styled from "styled-components";
// import onair from "../assets/onair.png";
// import onair2 from "../assets/onair2.png";
// import onair3 from "../assets/onair3.png";
import onair4 from "../assets/onair4.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBroadcastTower } from "@fortawesome/free-solid-svg-icons";

window.io = io;

let socket;
const RoomList = () => {
  // const ENDPOINT = "http://localhost:5000";
  let history = useHistory();
  const [roomList, setRoomList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/chat/room/");
      setRoomList(res.data);

      // room-refresh 이벤트를 받기위한 소켓
      // socket = io(ENDPOINT, {
      //   transports: ["websocket", "polling", "flashsocket"],
      // });
      // socket = io(ENDPOINT);
      // console.log("http://3.36.99.83/socket.io");
      // socket = io("http://3.36.99.83/socket.io");
      socket = io("https://eyelikemeeting.com");
      socket.emit("join-roomlist", "데이터잘가나여!");

      socket.on("room-refresh", async (data) => {
        const refreshRes = await axios.get("/api/chat/room/");
        setRoomList(() => refreshRes.data);
      });
    })();

    return () => {
      socket.close();
    };
  }, []);

  const onClickMakeRoom = async (e) => {
    const room_name = prompt("방 제목을 입력해주세요.");
    if (room_name === null) {
      return;
    }
    if (room_name === "") {
      alert("방 제목은 필수 항목입니다.");
      return;
    }

    let room_uuid = uuidv4();
    const res = await axios.put("/api/chat/room/", {
      uuid: room_uuid,
      name: room_name,
      number: e.target.id,
      status: "ACTIVE",
    });

    history.push({
      pathname: `room/${room_uuid}`,
      state: { uuid: res.data.room_uuid },
    });
  };

  //방의 상태가 ACTIVE일때와 CLEANING일때만 보여줘야함
  const onClickIntoRoom = async (e) => {
    const id = e.target.id;
    const res = await axios.get(`/api/chat/room/?id=${id}`);
    //방이 잠금되어있다면
    if (res.data.is_private) {
      const room_password = prompt("방 비밀번호를 입력해주세요...");
      const check_res = await axios.post("/api/chat/room/", {
        password: room_password,
        id: e.target.id,
      });
      if (check_res.data.uuid) {
        history.push(`/room/${check_res.data.uuid}`);
      } else {
        alert(check_res.data.msg); //잘못된 비밀번호
        return;
      }

      //방이 공개방이라면
    } else {
      history.push(`/room/${res.data.uuid}`);
    }
  };

  const renderRoom = (room) => {
    if (room.status === "ACTIVE") {
      return (
        <ActiveCardBox key={room.number}>
          <RoomNumberImg>
            <StyleRoomNumber>{room.number}</StyleRoomNumber>
            {/* <FontAwesomeIcon
              className="inviteIcon headerIcon"
              icon={faBroadcastTower}
              size="2x"
              // onClick={onCopyToClipboard}
            /> */}

            <img src={onair4} alt={"onair"} />
          </RoomNumberImg>
          <StyleRoomName>{room.name}</StyleRoomName>
          <ButtonBox>
            <button onClick={onClickIntoRoom} id={room.number}>
              참여하기
            </button>
          </ButtonBox>
        </ActiveCardBox>
      );
    }
    if (room.status === "IDLE") {
      return (
        <IdleCardBox key={room.number}>
          <RoomNumberImg>
            <StyleRoomNumber>{room.number}</StyleRoomNumber>
          </RoomNumberImg>
          <StyleRoomName>비어있는 방입니다</StyleRoomName>
          <ButtonBox>
            <button onClick={onClickMakeRoom} id={room.number}>
              시작하기
            </button>
          </ButtonBox>
        </IdleCardBox>
      );
    }
    if (room.status === "CLEANING") {
      return (
        <CleaningCardBox key={room.number}>
          <RoomNumberImg>
            <StyleRoomNumber>{room.number}</StyleRoomNumber>
            <div className="cleaningNow">방을 정리중입니다....</div>
          </RoomNumberImg>
          <StyleRoomName>
            <div>
              <progress></progress>
            </div>
            <ButtonBox>
              <button onClick={onClickIntoRoom} id={room.number}>
                참여하기
              </button>
            </ButtonBox>
          </StyleRoomName>
        </CleaningCardBox>
      );
    }
  };

  return (
    <>
      <Header />
      <Box>
        {/* <h1>현재 방목록</h1> */}
        <ContentBox>{roomList.map(renderRoom)}</ContentBox>
      </Box>
      <Footer />
    </>
  );
};

export default RoomList;

const ButtonBox = styled.div`
  text-align: center;
  transition: all 0.9s ease-in;

  button {
    border-radius: 60px;
    font-weight: bold;
    /* background-color: #031321; */
    font-family: consolas;
    padding: 15px 30px;
    color: black;
    text-transform: uppercase;
    letter-spacing: 4px;
    text-decoration: none;
    font-size: 24px;
    overflow: hidden;
    transition: 0.2s;
    &:hover {
      color: white;
      background: #2196f3;
      box-shadow: 0 0 10px #2196f3, 0 0 40px #2196f3, 0 0 80px #2196f3;
    }
  }
`;

const Box = styled.div`
  margin-top: 55px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgb(255, 255, 255);
  margin-bottom: 30px;
`;

const ContentBox = styled.div`
  width: 1200px;
  display: flex;
  flex-wrap: wrap;
`;

const ActiveCardBox = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  transition: all 0.2s ease-in 0s;
  background-color: green;
  opacity: 0.5;
  color: rgb(255, 255, 255);
  display: block;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 25px;
  transition: all 0.2s ease-in;
  &:hover {
    opacity: 0.7;
  }
`;

const IdleCardBox = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  transition: all 0.2s ease-in 0s;
  background-color: rgb(73, 73, 74);
  opacity: 0.5;
  color: rgb(255, 255, 255);
  display: block;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 25px;
  transition: all 0.2s ease-in;
  &:hover {
    opacity: 0.7;
  }
`;

const CleaningCardBox = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 200px;
  border-radius: 10px;
  transition: all 0.2s ease-in 0s;
  background-color: blueviolet;
  opacity: 0.5;
  color: rgb(255, 255, 255);
  display: block;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 25px;
  transition: all 0.2s ease-in;
  progress {
    width: 400px;
    height: 41px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const RoomNumberImg = styled.div`
  text-align: center;
  display: flex;
  img {
    height: 60px;
  }
  .cleaningNow {
    font-weight: bold;
    font-size: 40px;
  }
`;

const StyleRoomNumber = styled.div`
  display: inline-block;
  border: 3px solid;
  font-size: 36px;
  font-weight: bold;
  margin-right: 20px;
  border-radius: 30%;
  padding: 0px 7px;
`;

const StyleRoomName = styled.div`
  font-size: 30px;
`;

/* // width: 100%;
// height: 100%;
// display: flex;
// flex-direction: column;
// -webkit-box-align: center;
// align-items: center;
// background-color: rgb(255, 255, 255);
// margin-bottom: 30px; */
