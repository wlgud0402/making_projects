import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

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
};

const GoogleLoginAPI = (axiosres) => {
  return (
    <GoogleLogin
      clientId="964185854250-c45rpld9numrbbjtsbjpi8akbub3l6f1.apps.googleusercontent.com"
      buttonText="로그인"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginAPI;
