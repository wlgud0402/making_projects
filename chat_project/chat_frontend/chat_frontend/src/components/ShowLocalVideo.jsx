import React, { useEffect, useRef } from "react";
import "./ShowLocalVideo.css";

const ShowLocalVideo = (pip) => {
  const videoRef = useRef(null);
  useEffect(() => {
    videoRef.current.srcObject = pip.pip.stream;
    videoRef.current.muted = true;
  }, [pip.pip.stream]);

  //영상멈추기
  const playStop = () => {
    console.log("영상 멈춤, 재생");
    const enabled = videoRef.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
      videoRef.current.srcObject.getVideoTracks()[0].enabled = false;
      // setPlayVideo(); 이미지변환
    } else {
      // setStopVideo();
      videoRef.current.srcObject.getVideoTracks()[0].enabled = true;
    }
  };

  //음소거
  const muteUnmute = () => {
    console.log("소리, 음소거");
    const enabled = videoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      // setUnmuteButton();
    } else {
      // setMuteButton();
      videoRef.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  };

  return (
    <div>
      <video className="localVideo" ref={videoRef} autoPlay />
      <button onClick={playStop}>영상</button>
      <button onClick={muteUnmute}>소리</button>
      <h6>{pip.pip.nickname}</h6>
    </div>
  );
};
export default ShowLocalVideo;
