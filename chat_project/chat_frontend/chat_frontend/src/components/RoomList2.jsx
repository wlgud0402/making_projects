import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

let socket;
const RoomList2 = () => {
  const ENDPOINT = "http://localhost:5000";
  let history = useHistory();
  const [roomList, setRoomList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:8000/api/chat/room/");
      setRoomList(res.data);
      console.log(res.data);

      // room-refresh 이벤트를 받기위한 소켓
      socket = io(ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      socket.emit("join-roomlist", "데이터잘가나여!");

      socket.on("room-refresh", async (data) => {
        console.log("roomlist에서 room-refresh가 일어납니다.");
        const refreshRes = await axios.get(
          "http://localhost:8000/api/chat/room/"
        );
        setRoomList(refreshRes.data);
        console.log("리프레시데이터", refreshRes.data);
      });
    })();
  }, []);

  const onClickMakeRoom = async (e) => {
    const room_name = prompt("방 제목을 입력해주세요.");
    let room_uuid = uuidv4();
    const res = await axios.put("http://localhost:8000/api/chat/room/", {
      uuid: room_uuid,
      name: room_name,
      number: e.target.id,
      status: "ACTIVE",
    });

    history.push({
      pathname: `room2/${room_uuid}`,
      state: { uuid: res.data.room_uuid },
    });
  };

  //방의 상태가 ACTIVE일때와 CLEANING일때만 보여줘야함
  const onClickIntoRoom = async (e) => {
    const id = e.target.id;
    const res = await axios.get(
      `http://localhost:8000/api/chat/room/?id=${id}`
    );
    console.log(typeof res.data);
    //방이 잠금되어있다면
    if (res.data.is_private) {
      const room_password = prompt("방 비밀번호를 입력해주세요...");
      console.log(room_password);
      const check_res = await axios.post(
        "http://localhost:8000/api/chat/room/",
        { password: room_password, id: e.target.id }
      );
      if (check_res.data.uuid) {
        history.push(`/room2/${check_res.data.uuid}`);
      } else {
        alert(check_res.data.msg); //잘못된 비밀번호
        return;
      }

      //방이 공개방이라면
    } else {
      console.log("공개방", res.data.uuid);
      history.push(`/room2/${res.data.uuid}`);
    }
  };

  const renderRoom = (room) => {
    if (room.status === "ACTIVE") {
      return (
        <Card
          key={room.number}
          border="dark"
          style={{ width: "18rem" }}
          className="box"
        >
          <Card.Header>{room.number}번방</Card.Header>
          <Card.Body>
            <Card.Title>방제목: {room.name}</Card.Title>
            <button id={room.number} onClick={onClickIntoRoom}>
              들어가기
            </button>
          </Card.Body>
        </Card>
      );
    } else {
      return (
        <Card
          key={room.number}
          border="dark"
          style={{ width: "18rem" }}
          className="box"
        >
          <Card.Header>{room.number}번방</Card.Header>
          <Card.Body>
            <Card.Title>방제목: {room.name}</Card.Title>
            <button id={room.number} onClick={onClickMakeRoom}>
              만들기
            </button>
          </Card.Body>
        </Card>
      );
    }
    // return (
    // );
  };

  return (
    <div className="box">
      <h1>전체방목록</h1>
      <div className="grid">{roomList.map(renderRoom)}</div>
      {/* {roomList.map((room) => {
        return (
          <div className="grid">
            <h1>{room.number}</h1>
            <h1>{room.name}</h1>
            <h1>{room.status}</h1>
            <h1>{room.password}</h1>
          </div>
        );
      })} */}
    </div>
  );
};

export default RoomList2;
