import React, { useEffect, useRef } from "react";
import "./ShowVideo.css";

const ShowVideo = (pip) => {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current.srcObject = pip.pip.stream;
    videoRef.current.muted = false;
  }, [pip.pip.stream]);
  return (
    <div>
      <div className="otherNickname">{pip.pip.nickname}</div>
      <video className="videos" controls ref={videoRef} autoPlay />
    </div>
  );
};
export default ShowVideo;
