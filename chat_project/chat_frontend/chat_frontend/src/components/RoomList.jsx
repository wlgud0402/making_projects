import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useHistory } from "react-router-dom";

const RoomList = () => {
  let history = useHistory();
  const [roomList, setRoomList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:8000/api/chat/room/");
      setRoomList(res.data);
      console.log(res.data);
    })();
  }, []);

  const onClickMakeRoom = async (e) => {
    let room_uuid = uuidv4();
    const res = await axios.put("http://localhost:8000/api/chat/room/", {
      uuid: room_uuid,
      number: e.target.id,
      status: "ACTIVE",
    });
    history.push(`room/${res.data}`);
  };

  const renderRoom = (room) => {
    return (
      <Card
        key={room.number}
        border="dark"
        style={{ width: "18rem" }}
        className="box"
      >
        <Card.Header>{room.number}번방</Card.Header>
        <Card.Body>
          <Card.Title>{room.name}</Card.Title>
          <button id={room.number} onClick={onClickMakeRoom}>
            만들기
          </button>
          <button id={room.number}>들어가기</button>
        </Card.Body>
      </Card>
    );
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

export default RoomList;
