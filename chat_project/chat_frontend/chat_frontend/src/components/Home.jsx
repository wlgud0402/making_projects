import React, { useState } from "react";
import Nav from "./Nav";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Carousel from "react-bootstrap/Carousel";

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
        history.push("/roomlist2");
      } else {
        alert("방을 만드려면 가입이 필요합니다.");
      }
    } else {
      alert("방을 시작하려면 로그인이 필요합니다");
    }
  };

  return (
    // <div>
    //   <Header />
    //   <div>
    //     <button onClick={onClickStartMeeting}>미팅시작</button>
    //   </div>
    //   <Footer />
    // </div>
    <>
      <Header />
      <Carousel>
        <Carousel.Item style={{ height: "55vh" }}>
          <img
            className="d-block w-100"
            src="https://source.unsplash.com/RCAhiGJsUUE/1920x1080"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>간편한 미팅서비스 브로드미팅!</h3>
            <p>
              어려운 화상회의가 싫으신 분을 위한 쉽고 편리한 유저 최적화 환경!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: "55vh" }}>
          <img
            className="d-block w-100"
            src="https://source.unsplash.com/wfh8dDlNFOk/1920x1080"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>영상통화, 화면공유, 채팅등 여러가지 기능의 탑재!</h3>
            <p>
              언택트 시대를 맞이한 지금 화상 서비스는 선택이아닌 필수입니다!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: "55vh" }}>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1614111345870-f0f05edc6a52?crop=entropy&
                cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MXwxfDB8MXxyYW5kb218fHx8fHx8fA&ixlib=rb-1.2.1
                &q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600/"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>초대 링크를 친구에게 공유해보세요!</h3>
            <p>
              방을 만들고 초대링크를 친구에게 보내면 즉시 서비스가 이용
              가능합니다!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <section className="py-5">
        <div className="container">
          <h1 className="font-weight-light">지금 당장 회의를 시작해 보세요!</h1>
          <p className="lead">
            빠르고 간편한 서비스, 채팅, 화면공유등을 시험해 보러 가시겠습니까?
            <button onClick={onClickStartMeeting}>미팅시작</button>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
