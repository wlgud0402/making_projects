import React, { useEffect, useRef } from "react";
import "./ShowVideo.css";

const ShowVideo = (pip) => {
  const videoRef = useRef(null);
  useEffect(() => {
    // pip.pip.stream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = pip.pip.stream;
    // console.log("다른사람 비디오스트림", videoRef.current.srcObject);
    // videoRef.current.muted = true;
  }, [pip.pip.stream]);
  return (
    <div>
      <div className="otherNickname">{pip.pip.nickname}</div>
      <video className="videos" controls ref={videoRef} autoPlay />
    </div>
  );
};
export default ShowVideo;
