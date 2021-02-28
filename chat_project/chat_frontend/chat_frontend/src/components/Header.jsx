import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import jwt_decode from "jwt-decode";
import GoogleLoginAPI from "./GoogleLoginAPI";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

const Header = () => {
  const history = useHistory();
  const moveToLogin = () => history.push("/login");
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user_token")) {
      let user_token = localStorage.getItem("user_token");
      let info = jwt_decode(user_token);
      setUserInfo(info);
    }
  }, []);

  // const onUserProfileClick = (e) => {
  //   e.stopPropagation();
  //   // app.toggleProfileDropdown();
  // };
  const onLogout = (e) => {
    localStorage.clear();
    setUserInfo("");
  };

  const onChangeNickname = async (e) => {
    console.log("닉네임 변경클릭");
    if (localStorage.getItem("user_token")) {
      let user_token = localStorage.getItem("user_token");
      let info = jwt_decode(user_token);
      console.log(info);
      const newNickname = prompt("새로운 닉네임을 입력해주세요.");
      if (newNickname !== null) {
        if (newNickname.length !== 0) {
          //제대로된 입력
          const newInfo = await axios.put(
            "http://localhost:8000/api/user/changeUserNickname/",
            { user_id: userInfo.user_id, new_nickname: newNickname }
          );
          localStorage.setItem("user_token", newInfo.data.user_token);

          let newUserToken = localStorage.getItem("user_token");
          let newUserInfo = jwt_decode(newUserToken);
          setUserInfo(newUserInfo);
          alert("닉네임이 변경 되었습니다.");
        } else {
          alert("닉네임이 입력되지 않았습니다"); //닉네임을 입력하지 않고서 제출
        }
      } else {
        return; //닉네임 입력창에서 esc발생
      }
    }
  };

  if (userInfo !== "") {
    return (
      <Wrapper>
        <Contents>
          <LogoContainer>
            <Link to="/">BroadMeeting</Link>
          </LogoContainer>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {userInfo.nickname}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item variant="secondary" onClick={onChangeNickname}>
                닉네임변경
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item variant="secondary" onClick={onLogout}>
                로그아웃
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Contents>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <Contents>
          <LogoContainer>
            <Link to="/">BroadMeeting</Link>
          </LogoContainer>
          <GoogleLoginAPI />
        </Contents>
      </Wrapper>
    );
  }
};

export default Header;

const Wrapper = styled.div`
  height: 65px;
  display: flex;
  justify-content: center;
  background-color: #6c757d;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  a {
    color: white;
    margin-left: 7px;
    font-size: 21px;
    font-weight: bold;
    text-decoration: none;
  }
`;

const Contents = styled.div`
  width: 70%;
  height: 65px;
  & > a {
    color: white;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// const User = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   position: relative;
//   cursor: pointer;
// `;

// const ProfileImg = styled.img`
//   border-radius: 50%;
//   width: 36px;
//   height: 36px;
//   margin-right: 10px;
// `;

// const Nickname = styled.div`
//   color: white;
//   font-size: 16px;
//   font-weight: 400;
// `;

// const GoogleLoginLink = styled.a`
//   color: white;
//   font-size: 16px;
//   font-weight: 400;
// `;

// const LoginButton = styled.button`
//   border-radius: 20px;
//   background-color: white;
//   color: #004dce;
//   border: none;
//   cursor: pointer;
//   font-size: 16px;
//   font-weight: 400;
//   padding: 5px 15px;
//   &:focus {
//     outline: none;
//   }
//   transition: all 0.2s ease-in;
//   &:hover {
//     opacity: 0.7;
//   }
// `;

// const Dropdown = styled.div`
//   position: absolute;
//   top: 50px;
//   right: 0;
//   min-width: 162px;
//   padding-bottom: 8px;
//   background: #262626;
//   -webkit-box-shadow: 0 0 5px rgb(0 0 0 / 20%);
//   box-shadow: 0 0 5px rgb(0 0 0 / 20%);
//   border-radius: 0 0 6px 6px;
//   z-index: 1;
//   list-style: none;
// `;

// const DropdownItem = styled.div`
//   font-size: 17px;
//   font-weight: 200;
//   height: 50px;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   color: white;
//   padding: 0px 22px;
//   cursor: pointer;
//   &:hover {
//     background-color: #494a4a;
//   }
// `;

// body {
//     padding: 0;
//     margin: 0;
//   }

//   video {
//     height: 300px;
//     width: 400px;
//     object-fit: cover;
//   }

//   #video-grid {
//     display: flex;
//     justify-content: center;
//   }

//   .main {
//     height: 100vh;
//     display: flex;
//   }

//   .main__left {
//     flex: 0.8;
//     display: flex;
//     flex-direction: column;
//   }

//   .main__right {
//     flex: 0.2;
//   }

//   .main__videos {
//     flex-grow: 1;
//     background-color: black;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .main__controls {
//     display: flex;
//     background-color: #1c1e20;
//     color: #d2d2d2;
//     padding: 5px;
//     justify-content: space-between;
//   }

//   .main__controls__block {
//     display: flex;
//   }

//   .main__controls__button {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     padding: 8px 10px;
//     min-width: 80px;
//     cursor: pointer;
//   }

//   .main__controls__button i {
//     font-size: 24px;
//   }

//   .main__controls__button:hover {
//     background-color: #343434;
//     border-radius: 5px;
//   }

//   .leave__meeting {
//     color: #eb534b;
//   }

//   .main__right {
//     display: flex;
//     flex-direction: column;
//     background-color: #242324;
//     border-left: 1px solid;
//   }

//   .main__header {
//     color: #f5f5f5;
//     text-align: center;
//   }

//   .main__chat_window {
//     flex-grow: 1;
//     overflow-y: scroll;
//     /* overflow-y:scroll을 통해 화면이 넘어가면 scroll으로 넘어가게됨 */
//   }

//   .main__message_container {
//     display: flex;
//     padding: 22px 12px;
//   }

//   .main__message_container input {
//     flex-grow: 1;
//     background-color: transparent;
//     border: none;
//     color: #f5f5f5;
//   }

//   .messages {
//     color: white;
//     list-style: none;
//   }

//   .unmute,
//   .stop {
//     color: #cc3b33;
//   }
