import React, { useEffect, useRef } from "react";
import "./ShowVideo.css";

const ShowLocalVideo = (pip) => {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current.srcObject = pip.pip.stream;
    videoRef.current.muted = true;
    console.log("내비디오 스트림", videoRef.current.srcObject);
  }, [pip.pip.stream]);
  return (
    <div>
      <video ref={videoRef} autoPlay />
      <h6>{pip.pip.nickname}</h6>
    </div>
  );
};
export default ShowLocalVideo;
