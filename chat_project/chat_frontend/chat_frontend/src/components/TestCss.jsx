import React from "react";
import Carousel from "react-bootstrap/Carousel";
import styled from "styled-components";
import Footer from "./Footer";
import Header from "./Header";

// const STYLE = {
//   carouselBox: {
//     height: "600px",
//   },
//   infoColor: {
//     color: "green",
//   },
//   warningColor: {
//     color: "orange",
//   },
//   errorColor: {
//     color: "red",
//   },
// };

class TestCss extends React.Component {
  render() {
    return (
      //   <>
      //     <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      //       <div class="container">
      //         <a class="navbar-brand" href="#">
      //           Start Bootstrap
      //         </a>
      //         <button
      //           class="navbar-toggler"
      //           type="button"
      //           data-toggle="collapse"
      //           data-target="#navbarResponsive"
      //           aria-controls="navbarResponsive"
      //           aria-expanded="false"
      //           aria-label="Toggle navigation"
      //         >
      //           <span class="navbar-toggler-icon"></span>
      //         </button>
      //         <div class="collapse navbar-collapse" id="navbarResponsive">
      //           <ul class="navbar-nav ml-auto">
      //             <li class="nav-item active">
      //               <a class="nav-link" href="#">
      //                 Home
      //                 <span class="sr-only">(current)</span>
      //               </a>
      //             </li>
      //             <li class="nav-item">
      //               <a class="nav-link" href="#">
      //                 About
      //               </a>
      //             </li>
      //             <li class="nav-item">
      //               <a class="nav-link" href="#">
      //                 Services
      //               </a>
      //             </li>
      //             <li class="nav-item">
      //               <a class="nav-link" href="#">
      //                 Contact
      //               </a>
      //             </li>
      //           </ul>
      //         </div>
      //       </div>
      //     </nav>

      //     <header>
      //       <div
      //         id="carouselExampleIndicators"
      //         class="carousel slide"
      //         data-ride="carousel"
      //       >
      //         <ol class="carousel-indicators">
      //           <li
      //             data-target="#carouselExampleIndicators"
      //             data-slide-to="0"
      //             class="active"
      //           ></li>
      //           <li
      //             data-target="#carouselExampleIndicators"
      //             data-slide-to="1"
      //           ></li>
      //           <li
      //             data-target="#carouselExampleIndicators"
      //             data-slide-to="2"
      //           ></li>
      //         </ol>
      //         <div class="carousel-inner" role="listbox">
      //           <div
      //             class="carousel-item active"
      //             style="background-image: url('https://source.unsplash.com/RCAhiGJsUUE/1920x1080')"
      //           >
      //             <div class="carousel-caption d-none d-md-block">
      //               <h3 class="display-4">First Slide</h3>
      //               <p class="lead">This is a description for the first slide.</p>
      //             </div>
      //           </div>
      //           <div
      //             class="carousel-item"
      //             style="background-image: url('https://source.unsplash.com/wfh8dDlNFOk/1920x1080')"
      //           >
      //             <div class="carousel-caption d-none d-md-block">
      //               <h3 class="display-4">Second Slide</h3>
      //               <p class="lead">
      //                 This is a description for the second slide.
      //               </p>
      //             </div>
      //           </div>
      //           <div
      //             class="carousel-item"
      //             style="background-image: url('https://source.unsplash.com/O7fzqFEfLlo/1920x1080')"
      //           >
      //             <div class="carousel-caption d-none d-md-block">
      //               <h3 class="display-4">Third Slide</h3>
      //               <p class="lead">This is a description for the third slide.</p>
      //             </div>
      //           </div>
      //         </div>
      //         <a
      //           class="carousel-control-prev"
      //           href="#carouselExampleIndicators"
      //           role="button"
      //           data-slide="prev"
      //         >
      //           <span
      //             class="carousel-control-prev-icon"
      //             aria-hidden="true"
      //           ></span>
      //           <span class="sr-only">Previous</span>
      //         </a>
      //         <a
      //           class="carousel-control-next"
      //           href="#carouselExampleIndicators"
      //           role="button"
      //           data-slide="next"
      //         >
      //           <span
      //             class="carousel-control-next-icon"
      //             aria-hidden="true"
      //           ></span>
      //           <span class="sr-only">Next</span>
      //         </a>
      //       </div>
      //     </header>

      //   <section class="py-5">
      //     <div class="container">
      //       <h1 class="font-weight-light">Half Page Image Slider</h1>
      //       <p class="lead">
      //         The background images for the slider are set directly in the HTML
      //         using inline CSS. The images in this snippet are from{" "}
      //         <a href="https://unsplash.com">Unsplash</a>!
      //       </p>
      //     </div>
      //   </section>
      //   </>
      //   height: 65vh;
      //   min-height: 350px;
      <>
        <Header />
        <Carousel>
          <Carousel.Item style={{ height: "55vh" }}>
            <img
              className="d-block w-100"
              src="https://source.unsplash.com/RCAhiGJsUUE/1920x1080"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>간편한 미팅서비스 브로드미팅!</h3>
              <p>
                어려운 화상회의가 싫으신 분을 위한 쉽고 편리한 유저 최적화 환경!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item style={{ height: "55vh" }}>
            <img
              className="d-block w-100"
              src="https://source.unsplash.com/wfh8dDlNFOk/1920x1080"
              alt="Third slide"
            />

            <Carousel.Caption>
              <h3>영상통화, 화면공유, 채팅등 여러가지 기능의 탑재!</h3>
              <p>
                언택트 시대를 맞이한 지금 화상 서비스는 선택이아닌 필수입니다!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item style={{ height: "55vh" }}>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1614111345870-f0f05edc6a52?crop=entropy&
              cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MXwxfDB8MXxyYW5kb218fHx8fHx8fA&ixlib=rb-1.2.1
              &q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1600/"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>초대 링크를 친구에게 공유해보세요!</h3>
              <p>
                방을 만들고 초대링크를 친구에게 보내면 즉시 서비스가 이용
                가능합니다!
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <section class="py-5">
          <div class="container">
            <h1 class="font-weight-light">지금 당장 회의를 시작해 보세요!</h1>
            <p class="lead">
              빠르고 간편한 서비스, 채팅, 화면공유등을 시험해 보러 가시겠습니까?
              <button>회의 시작</button>
            </p>
          </div>
        </section>
        <Footer />
      </>
    );
  }
}

export default TestCss;
