import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const history = useHistory();

  const [TogHome, setTogHome] = useState(
    location.pathname === "/home" ? true : false
  );
  const [TogService, setTogService] = useState(
    location.pathname === "/service" ? true : false
  );
  const [TogWidget, setTogWidget] = useState(
    location.pathname === "/widget" ? true : false
  );

  const onClickHome = () => {
    setTogHome((TogHome) => true);
    setTogService((TogService) => false);
    setTogWidget((TogWidget) => false);
    history.push("/home");
  };

  const onClickService = () => {
    setTogHome((TogHome) => false);
    setTogService((TogService) => true);
    setTogWidget((TogWidget) => false);
    history.push("/service");
  };

  const onClickWidget = () => {
    setTogHome((TogHome) => false);
    setTogService((TogService) => false);
    setTogWidget((TogWidget) => true);
    history.push("/widget");
  };

  /*const onClickSettings = () => {
    setTogHome((TogHome) => false);
    setTogService((TogService) => false);
    setTogWidget((TogWidget) => false);
    history.push("/settings");
  };*/

  return (
    <div
      style={{ backgroundColor: "#2D62ED" }}
      className="fixed z-50 top-0 w-56 h-screen text-white flex flex-col shadow-2xl"
    >
      <div className="w-2/3 ml-11 mt-5 text-center">
        <h1 className="font-extrabold text-3xl">AREA</h1>
      </div>
      <div className="w-3/4 font-bold text-lg m-auto mt-80">
        <div
          onClick={onClickHome}
          className={`cursor-pointer flex mt-8 py-3 text-white hover:text-gray-200 ${
            TogHome &&
            "bg-indigo-300 rounded-3xl animate-bounce text-red-100 hover:text-red-100"
          }`}
        >
          <i className="font-bold text-lg mx-4 fas fa-home"></i>
          <h1 className="">Home</h1>
        </div>
        <div
          onClick={onClickService}
          className={`cursor-pointer flex my-8 py-3 text-white hover:text-gray-200 ${
            TogService &&
            "bg-indigo-300 rounded-3xl animate-bounce text-red-100 hover:text-red-100"
          }`}
        >
          <i className="font-bold text-lg mx-5 fas fa-folder"></i>
          <h1>Services</h1>
        </div>
        <div
          onClick={onClickWidget}
          className={`cursor-pointer flex my-8 py-3 text-white hover:text-gray-200 ${
            TogWidget &&
            "bg-indigo-300 rounded-3xl animate-bounce text-red-100 hover:text-red-100"
          }`}
        >
          <i className="font-bold text-lg mx-5 fas fa-plus-circle"></i>
          <h1>Widget</h1>
        </div>
      </div>
      {/* <div
        onClick={onClickSettings}
        className="w-2/4 m-auto mb-10 text-center flex cursor-pointer transform transition duration-200 hover:scale-95 hover:text-gray-300"
      >
        <i className="font-bold text-lg fas fa-cog mr-3"></i>
        <h1 className="font-bold text-lg">Settings</h1>
      </div> */}
    </div>
  );
};

export default NavBar;
