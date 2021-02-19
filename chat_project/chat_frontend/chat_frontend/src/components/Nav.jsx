import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div>
      <div className="navbar">
        <Link to={"/login"} className="nav-link">
          로그인
        </Link>
        <Link to={"/signup"} className="nav-link">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default Nav;
