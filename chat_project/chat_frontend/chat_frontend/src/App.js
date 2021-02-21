import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import history from "./history";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Login from "./components/Login";
import Signup from "./components/Signup";

import { BrowserRouter, Route } from "react-router-dom";
import GoogleLoginAPI from "./components/GoogleLoginAPI";
// import { Switch} from "react-router-dom";

function App() {
  return (
    <BrowserRouter history={history}>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} history={history} />
      {/* <div className="App">
        <Nav />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
          </div>
        </div>
      </div> */}
    </BrowserRouter>
  );
}

export default App;
