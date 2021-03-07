import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import jwt_decode from "jwt-decode";
// import GoogleLoginAPI from "./GoogleLoginAPI";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";

const Header = () => {
  // const history = useHistory();
  // const moveToLogin = () => history.push("/login");
  const [userInfo, setUserInfo] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user_token")) {
      let user_token = localStorage.getItem("user_token");
      let info = jwt_decode(user_token);
      setUserInfo(info);
    }
  }, []);

  const onLogout = (e) => {
    localStorage.clear();
    setUserInfo("");
  };

  const onChangeNickname = async (e) => {
    if (localStorage.getItem("user_token")) {
      let user_token = localStorage.getItem("user_token");
      let info = jwt_decode(user_token);
      const newNickname = prompt("새로운 닉네임을 입력해주세요.");
      if (newNickname !== null) {
        if (newNickname.length !== 0) {
          //제대로된 입력
          const newInfo = await axios.put("/api/user/changeUserNickname/", {
            user_id: userInfo.user_id,
            new_nickname: newNickname,
          });
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

  const responseGoogle = async (response) => {
    let idx = response.profileObj.email.indexOf("@");
    let nickname = response.profileObj.email.substring(0, idx);

    const axiosres = await axios.post("/api/user/", {
      google_id: response.profileObj.googleId,
      email: response.profileObj.email,
      nickname: nickname,
      user_type: "MEMBER",
    });
    localStorage.setItem("user_token", axiosres.data.user_token);

    let user_token = localStorage.getItem("user_token");
    let info = jwt_decode(user_token);
    setUserInfo(info);
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
          <GoogleLogin
            clientId="964185854250-c45rpld9numrbbjtsbjpi8akbub3l6f1.apps.googleusercontent.com"
            buttonText="로그인"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
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
  background-color: #343a40;
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
