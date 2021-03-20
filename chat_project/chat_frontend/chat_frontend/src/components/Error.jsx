import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Error = () => {
  return (
    <div>
      <Header />
      <ErrorBody>
        <div className="errorCard">
          <h1>이 페이지는 유효하지 않습니다.</h1>
          <h2>This is not the web page you are looking for</h2>
        </div>
      </ErrorBody>
      <Footer />
    </div>
  );
};

export default Error;

const ErrorBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 74vh;

  .errorCard {
    /* border: 1px solid; */
    width: 73%;
    height: 30%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
`;
