import React, { useEffect, useRef } from "react";
import "./ShowLocalVideo.css";
import onair from "../assets/onair.png";

const ShowLocalVideo = (pip) => {
  let displayMediaOptions = {
    video: {
      cursor: "always",
    },
    audio: true,
  };

  const shareVideoRef = useRef(null);
  // useEffect(() => {
  //   (async () => {
  //     shareVideoRef.current.srcObject = await navigator.mediaDevices.getDisplayMedia(
  //       displayMediaOptions
  //     );
  //   })();
  // }, []);
  // useEffect(()=>{
  //   shareVideoRef.current.srcObject = navigator
  // },[])

  // var myVideo = document.getElementById("videoTag1");
  // myVideo.msHorizontalMirror = true;
  // myVideo.play();

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

  // const onScreenShare = async (e) => {
  //   try {
  //     videoRef.current.srcObject = await navigator.mediaDevices.getDisplayMedia(
  //       displayMediaOptions
  //     );
  //     console.log("화면공유를 시작합니다");
  //   } catch (err) {
  //     console.log("에러: ", err);
  //   }
  // };

  // const onStopScreenShare = (e) => {
  //   console.log("공유 중지하기");
  // };

  return (
    <div>
      <video className="localVideo" ref={videoRef} autoPlay />
      <button onClick={playStop}>영상</button>
      <button onClick={muteUnmute}>소리</button>
      {/* <video id="video" ref={shareVideoRef} autoPlay></video> */}
      {/* <button onClick={onScreenShare}>화면공유</button> */}
      {/* <button onClick={onStopScreenShare}>공유 멈춤</button> */}
      <h6>{pip.pip.nickname}</h6>
    </div>
  );
};
export default ShowLocalVideo;
