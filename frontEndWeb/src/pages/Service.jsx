import React, { useState, useRef, useEffect } from "react";
import { myCookies } from "../App";
import FacebookOAuth from "../components/OAuth/FacebookOAuth";
import GithubOAuth from "../components/OAuth/GithubOAuth";
import GoogleOAuth from "../components/OAuth/GoogleOAuth";

import tab from "../listWidgets";

const Service = () => {
  const ref = useRef(null);
  const [oauth, setOauth] = useState([]);
  const [desactiveGoogle, setDesactiveGoogle] = useState(false);
  const [desactiveFacebook, setDesactiveFacebook] = useState(false);
  const [desactiveGithub, setDesactiveGithub] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/service/list_oauth", {
      method: "GET",
      headers: {
        Accept: "application/json",
        jwt: myCookies.cookies.get("token"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setOauth(data);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
    if (window.location.search.includes("&state=34fFs29kd09")) {
      const code = window.location.search.split("=")[1].slice(0, -6);
      const client_id = "c3aa3b836ef74b49bd696a2d347d85ae";
      const client_secret = "e5a9151acd2a4a019b008a94971cdc74";
      const auth = client_id + ":" + client_secret;
      const credentials = btoa(auth);
      fetch(
        "https://accounts.spotify.com/api/token?grant_type=authorization_code&code=" +
          code +
          "&redirect_uri=http://localhost:8081/service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + credentials,
          },
        }
      )
        .then((res) => {
          res.json().then((data) => {
            const refresh_token = data.refresh_token;
            window.location.search = "";
            if (res.status === 200) {
              fetch("http://localhost:8080/api/user/oauth", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  jwt: myCookies.cookies.get("token"),
                },
                body: JSON.stringify({
                  oauth: "spotify",
                  refresh_token: refresh_token,
                }),
              })
                .then((res) => {
                  if (res.status === 200) {
                    fetch("http://localhost:8080/api/service/list_oauth", {
                      method: "GET",
                      headers: {
                        Accept: "application/json",
                        jwt: myCookies.cookies.get("token"),
                      },
                    })
                      .then((res) => {
                        if (res.status === 200) {
                          res.json().then((data) => {
                            console.log(data);
                            setOauth(data);
                          });
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  const oauthConnect = (item) => {
    if (item.title === "Spotify") {
      const client_id = "c3aa3b836ef74b49bd696a2d347d85ae";
      const scopes = [
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-top-read",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-library-modify",
        "user-library-read",
      ];
      const url =
        "https://accounts.spotify.com/authorize?client_id=" +
        client_id +
        "&response_type=code&redirect_uri=http://localhost:8081/service&scope=" +
        scopes.join("%20") +
        "&state=34fFs29kd09&show_dialog=true";
      window.open(url, "_self");
    }
  };

  return (
    <div
      style={{ height: "810px", color: "#272D3B" }}
      className="bg-white rounded-2xl shadow-2xl w-10/12 m-auto mt-28 mr-12"
    >
      <div className="w-full h-20 pt-5 mb-10">
        <h1 className="text-center text-5xl font-extrabold mx-auto">
          Services Informations
        </h1>
        <br />
        <hr className="w-10/12 mx-auto" />
      </div>
      <div
        style={{ scrollBehavior: "smooth" }}
        ref={ref}
        className="w-10/12 h-5/6 m-auto flex overflow-x-hidden"
      >
        {tab.map((item, index) => {
          return (
            <div
              key={index}
              style={{ minWidth: "30%" }}
              className="h-5/6 border-2 shadow-xl border-blue-800 rounded-xl m-auto mr-16 relative"
            >
              {item.title === "Spotify" &&
              item.needoauth &&
              !oauth.includes(item.title.toLowerCase()) ? (
                <button
                  onClick={() => oauthConnect(item)}
                  style={{ transition: "200ms ease-in" }}
                  className="bg-blue-800 text-white p-3 absolute top-3 right-3 rounded-xl outline-none
                  hover:bg-white hover:text-blue-800 border border-blue-800 focus:outline-none"
                >
                  OAuth
                </button>
              ) : item.title === "Facebook" &&
                item.needoauth &&
                !oauth.includes(item.title.toLowerCase()) &&
                !desactiveFacebook ? (
                <div
                  onClick={() =>
                    setDesactiveFacebook(
                      (desactiveFacebook) => !desactiveFacebook
                    )
                  }
                >
                  <FacebookOAuth />
                </div>
              ) : item.title === "Github" &&
                item.needoauth &&
                !oauth.includes(item.title.toLowerCase()) &&
                !desactiveGithub ? (
                <div
                  onClick={() =>
                    setDesactiveGithub((desactiveGithub) => !desactiveGithub)
                  }
                >
                  <GithubOAuth />
                </div>
              ) : item.title === "Google" &&
                item.needoauth &&
                !oauth.includes(item.title.toLowerCase()) &&
                !desactiveGoogle ? (
                <div
                  onClick={() => {
                    setDesactiveGoogle((desactiveGoogle) => !desactiveGoogle);
                  }}
                >
                  <GoogleOAuth />
                </div>
              ) : (
                <div className="p-3 absolute top-3 right-3 rounded-xl cursor-not-allowed border">
                  OAuth
                </div>
              )}
              <img className="mx-auto w-28 mt-5" src={item.icon} alt="" />
              <h1 className="text-4xl font-bold text-center my-3">
                {item.title}
              </h1>
              <h2 className="text-xl text-center mb-3">
                Subscribe and you will be able to :
              </h2>
              {item.actions.map((it, id) => {
                return (
                  <div
                    key={id}
                    style={{ backgroundColor: "#B5C8F9" }}
                    className="border border-blue-700 rounded-2xl w-11/12 mx-auto p-4 text-sm mt-5 text-center"
                  >
                    {it.title}
                  </div>
                );
              })}
              {item.reactions.map((it, id) => {
                return (
                  <div
                    key={id}
                    style={{ backgroundColor: "#B5C8F9" }}
                    className="border border-blue-700 rounded-2xl w-11/12 mx-auto px-4 py-2 text-sm mt-5 text-center"
                  >
                    {it.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => scroll(-1390)}
        className="border-4  border-blue-800 text-blue-800 text-2xl rounded-full shadow-lg w-20 h-20
        absolute bottom-96 left-72 transform transition duration-200 hover:scale-90 outline-none focus:outline-none"
      >
        <i className="fas fa-arrow-left"></i>
      </button>
      <button
        onClick={() => scroll(1390)}
        className="border-4  border-blue-800 text-blue-800 text-2xl rounded-full shadow-lg w-20 h-20
        absolute bottom-96 right-20 transform transition duration-200 hover:scale-90 outline-none focus:outline-none"
      >
        <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
};

export default Service;
