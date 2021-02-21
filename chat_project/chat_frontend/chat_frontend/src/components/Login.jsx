import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import GoogleLoginAPI from "./GoogleLoginAPI";

const Login = (props) => {
  return (
    <>
      <div>
        <GoogleLoginAPI />
      </div>
    </>
  );
};

export default Login;
