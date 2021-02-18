import React from "react";
import axios from "axios";
const { v4: uuidv4 } = require("uuid");

const Test = () => {
  const onSubmit = (e) => {
    axios.post("/api/chat/", {
      data: "메시지데이터!?!",
    });
    e.preventDefault();
  };

  const makeRoom = (e) => {
    console.log("방만들기");
    e.preventDefault();
  };

  return (
    <div>
      <h1>test.jsx</h1>
      <form onSubmit={onSubmit}>
        <button type="submit">axios요청 전송</button>
      </form>

      <form onClick={makeRoom}>
        <button>방만들기</button>
      </form>
    </div>
  );
};

export default Test;
