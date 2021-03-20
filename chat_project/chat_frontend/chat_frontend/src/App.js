import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import history from "./history";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import TestPeer from "./components/TestPeer";
import RoomList from "./components/RoomList"; //roomlist2
import Room from "./components/Room";
import Error from "./components/Error";
import TestCss from "./components/TestCss";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function App() {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/testpeer" component={TestPeer} />
        <Route path="/room" component={Room} />
        <Route exact path="/roomlist" component={RoomList} />
        {/* roomlist2 */}
        <Route exact path="/testcss" component={TestCss} />
        <Route path="*" component={Error} />
      </Switch>

      {/* <Route render={({ location }) => <Error />} /> */}
      {/* <Route path='*' component={Error} /> */}
    </BrowserRouter>
  );
}

export default App;
