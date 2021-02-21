import React from "react";
import { Link } from "react-router-dom";
import GoogleLoginAPI from "./GoogleLoginAPI";
import jwt_decode from "jwt-decode";

const Nav = () => {
  // let user_token = localStorage.getItem("user_token");
  // let info = jwt_decode(user_token);
  return (
    <div>
      <div className="navbar">
        <h5>BroadMeeting</h5>
        <GoogleLoginAPI />
        <Link to={"/login"} className="nav-link">
          로그인
        </Link>
      </div>
    </div>
  );
};

export default Nav;
