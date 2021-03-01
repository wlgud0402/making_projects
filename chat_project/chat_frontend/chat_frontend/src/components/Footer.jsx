import styled from "styled-components";

export default function Footer() {
  return (
    <div>
      <Info>
        © 2021 Jihyung Kim CO., LTD. ALL RIGHTS RESERVED.
        <p>contact: 010-6805-0402</p>
      </Info>
    </div>
  );
}

// const Info = styled.div`
// color: #94949a;
// height: 90px;
// display: flex;
// justify-content: center;
// align-items: center;
// background-color: #1b1b1b;
// `;

const Info = styled.div`
  /* position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 15px 0;
  text-align: center;
  color: white;
  background: #1b1b1b; */
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  color: #94949a;
  height: 90px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: #1b1b1b;
`;
