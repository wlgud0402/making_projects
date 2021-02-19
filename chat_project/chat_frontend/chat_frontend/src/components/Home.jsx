import React from "react";
import axios from "axios";

const Home = () => {
  axios.get("http://localhost:8000/user").then(
    (res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    }
  );

  return (
    <div>
      <h2>You are not logged in</h2>
    </div>
  );
};

export default Home;
