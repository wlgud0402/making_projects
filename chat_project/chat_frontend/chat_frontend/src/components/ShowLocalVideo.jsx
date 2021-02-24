import React, { useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import "./ShowVideo.css";

const ShowLocalVideo = (pip) => {
  const videoRef = useRef(null);
  useEffect(() => {
    // pip.pip.stream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = pip.pip.stream;
    videoRef.current.muted = true;
  }, [pip.pip.stream]);
  return (
    <div>
      <video ref={videoRef} autoPlay />
      <h6>{pip.pip.nickname}</h6>
    </div>
  );
};
export default ShowLocalVideo;
