import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { myCookies } from "../App";

const TopBar = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/infos", {
      method: "GET",
      headers: {
        Accept: "application/json",
        jwt: myCookies.cookies.get("token"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setUsername(data.username);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div
      style={{ backgroundColor: "#2D62ED" }}
      className="h-20 flex shadow-lg fixed top-0 w-full"
    >
      <div className="flex">
        <h1 className="text-white font-extrabold text-3xl mt-5 ml-20">AREA</h1>
      </div>
      <div className="flex m-auto mr-10">
        <Link to="/profil">
          <div className="flex my-auto cursor-pointer transform transition duration-200 hover:scale-95">
            <div
              style={{
                backgroundImage:
                  "url(https://www.flaticon.com/svg/vstatic/svg/206/206853.svg?token=exp=1615054238~hmac=8335c95de605ea1a9240b1d9ddaabee2)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              className="w-10 h-10 mt-2 mr-4 rounded-full"
            ></div>
            <div>
              <h1 className="text-white font-bold text-xl">{username}</h1>
              <h2 className="text-gray-300">Active</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
