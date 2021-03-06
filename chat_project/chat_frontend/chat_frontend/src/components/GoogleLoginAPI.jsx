import React from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

// const googleLogin = async (accesstoken) => {
//   let res = await axios.post("http://localhost:8000/rest-auth/google/", {
//     access_token: accesstoken,
//   });
//   console.log(res);
//   return await res.status;
// };
// let history = useHistory();
const responseGoogle = async (response) => {
  let idx = response.profileObj.email.indexOf("@");
  let nickname = response.profileObj.email.substring(0, idx);

  const axiosres = await axios.post("http://localhost:8000/api/user/", {
    google_id: response.profileObj.googleId,
    email: response.profileObj.email,
    nickname: nickname,
    user_type: "MEMBER",
  });
  localStorage.setItem("user_token", axiosres.data.user_token);
};

const GoogleLoginAPI = () => {
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
