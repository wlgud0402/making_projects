import React from "react";
import GoogleLogin from "react-google-login";

const responseGoogle = (response) => {
  console.log(response);
  console.log(response.profileObj);
};

const GoogleLoginAPI = () => {
  return (
    <GoogleLogin
      clientId="964185854250-c45rpld9numrbbjtsbjpi8akbub3l6f1.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginAPI;
