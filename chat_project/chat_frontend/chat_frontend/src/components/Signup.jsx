import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassWord, setConfirmPassWord] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPassWordChange = (e) => {
    setPassWord(e.target.value);
  };

  const onConfirmPassWordChange = (e) => {
    setConfirmPassWord(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
      confirm_password: confirmPassWord,
    };
    console.log(data);
    axios
      .post("http://localhost:8000/resigter", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>회원가입</h3>
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

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="비밀번호 확인"
          onChange={onConfirmPassWordChange}
        />
      </div>
      <button className="btn btn-primary btn-block">회원가입</button>
    </form>
  );
};

export default Signup;
