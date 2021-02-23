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
    const room_name = prompt("방 제목을 입력해주세요.");
    let room_uuid = uuidv4();
    const res = await axios.put("http://localhost:8000/api/chat/room/", {
      uuid: room_uuid,
      name: room_name,
      number: e.target.id,
      status: "ACTIVE",
    });
    // history.push(`room/${room_uuid}`, { pass: "pass" });
    history.push({ pathname: `room/${room_uuid}`, state: { pasS: "pass" } });
  };

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
        history.push(`room/${check_res.data.uuid}`);
      } else {
        alert(check_res.data.msg);
        return;
      }

      //방이 공개방이라면
    } else {
      console.log("공개방", res.data.uuid);
      history.push(`room/${res.data.uuid}`);
    }
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
          <Card.Title>방제목: {room.name}</Card.Title>
          <button id={room.number} onClick={onClickMakeRoom}>
            만들기
          </button>
          {/* history.push(`room/${res.data}`); */}
          {/* <Link to=`/room/${room.uuid}`>들어가기</Link> */}
          <button id={room.number} onClick={onClickIntoRoom}>
            들어가기
          </button>
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
