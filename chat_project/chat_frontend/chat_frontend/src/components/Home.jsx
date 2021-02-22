import React, { useState } from "react";
import Nav from "./Nav";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  // const [userInfo, setUserInfo] = useState("");

  let history = useHistory();
  if (localStorage.getItem("user_token")) {
    let user_token = localStorage.getItem("user_token");
    let info = jwt_decode(user_token);
    console.log("있어!", info);
  } else {
    console.log("없어!");
  }
  // { user_id : 12, email   : "wlgudrlgus@naver.com", nickname: "wlgudrlgus"}
  const onClickStartMeeting = (e) => {
    if (localStorage.getItem("user_token")) {
      let user_token = localStorage.getItem("user_token");
      let user_info = jwt_decode(user_token);
      if (user_info.user_type === "MEMBER") {
        // console.log(uuidv4());
        history.push("/roomlist");
      } else {
        console.log("가입은 안된 게스트유저");
      }
    } else {
      alert("방을 시작하려면 로그인이 필요합니다");
    }
  };

  return (
    <div>
      <Nav />
      <h2>홈입니다 로그인되있나???</h2>
      <button onClick={onClickStartMeeting}>미팅시작</button>
    </div>
  );
};

export default Home;
