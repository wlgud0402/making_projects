import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import history from "./history";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter, Route } from "react-router-dom";
import TestPeer from "./components/TestPeer";
import RoomList2 from "./components/RoomList2";
import Room2 from "./components/Room2";
import Error from "./components/Error";
import TestCss from "./components/TestCss";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function App() {
  return (
    <BrowserRouter history={history}>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/testpeer" component={TestPeer} />

      <Route path="/room2" component={Room2} />
      <Route exact path="/roomlist2" component={RoomList2} />
      <Route exact path="/testcss" component={TestCss} />
      {/* <Route render={({ location }) => <Error />} /> */}
      {/* <Route path='*' component={Error} /> */}
    </BrowserRouter>
  );
}

export default App;
