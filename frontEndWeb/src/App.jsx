import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";

import ReactNotification from "react-notifications-component";
import Cookies from "universal-cookie";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Service from "./pages/Service";
import Widget from "./pages/Widget";
import Profil from "./pages/Profil";
import ClientApk from "./pages/ClientApk";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";

import "react-notifications-component/dist/theme.css";

export var myCookies = {
  cookies: new Cookies(),
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <ReactNotification />
      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/client.apk" && <TopBar />}
      {location.pathname !== "/login" &&
        location.pathname !== "/" &&
        location.pathname !== "/register" &&
        location.pathname !== "/client.apk" &&
        location.pathname !== "/profil" && <NavBar />}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home} />
        <Route path="/client.apk" component={ClientApk} />
        <Route path="/service" component={Service} />
        <Route path="/widget" component={Widget} />
        <Route path="/profil" component={Profil} />
      </Switch>
    </>
  );
};

export default App;
