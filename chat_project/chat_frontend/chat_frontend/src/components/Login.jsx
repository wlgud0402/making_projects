import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleLoginAPI from "./GoogleLoginAPI";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPassWordChange = (e) => {
    setPassWord(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    console.log(data);
    axios
      .post("http://localhost:8000/login", data)
      .then((res) => {
        localStorage.setItem("toekn", res.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h3>로그인</h3>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="이메일"
            onChange={onEmailChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="비밀번호"
            onChange={onPassWordChange}
          />
        </div>
        <button className="btn btn-primary btn-block">로그인</button>
      </form>
      <div>
        <GoogleLoginAPI />
      </div>
      <div>
        <h6>
          아직회원이 아니신가요?<Link to={"/signup"}>회원가입</Link>
        </h6>
      </div>
    </>
  );
};

export default Login;
