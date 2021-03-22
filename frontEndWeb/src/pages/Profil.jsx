import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { store } from "react-notifications-component";
import { myCookies } from "../App";

import tab from "../listWidgets";

const Profil = () => {
  const history = useHistory();
  const [subscribed, setSubscribed] = useState(null);
  const [oauth, setOauth] = useState([]);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/service/subscribe_list", {
      method: "GET",
      headers: {
        Accept: "application/json",
        jwt: myCookies.cookies.get("token"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setSubscribed(data.services);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
            console.log(data);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
            setEmail(data.email);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onClickLogout = () => {
    history.push("/login");
    myCookies.cookies.remove("token");
    store.addNotification({
      title: ":)",
      message: "Succesfully logged out !",
      type: "success",
      insert: "top",
      container: "top-center",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 7000,
        onScreen: true,
      },
    });
  };

  const subscribeService = (service) => {
    if (!service.needoauth || oauth?.includes(service.title.toLowerCase())) {
      fetch("http://localhost:8080/api/service/subscribe_service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwt: myCookies.cookies.get("token"),
        },
        body: JSON.stringify({
          service: service.title.toLowerCase(),
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            setSubscribed((subscribed) => [
              ...subscribed,
              service.title.toLowerCase(),
            ]);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      history.push("/service");
      store.addNotification({
        title: "Warning",
        message: "You need to authentificate !",
        type: "danger",
        insert: "top",
        container: "top-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 7000,
          onScreen: true,
        },
      });
    }
  };

  const unsubscribeService = (service) => {
    fetch("http://localhost:8080/api/service/unsubscribe_service", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        jwt: myCookies.cookies.get("token"),
      },
      body: JSON.stringify({
        service: service,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          fetch("http://localhost:8080/api/service/subscribe_list", {
            method: "GET",
            headers: {
              Accept: "application/json",
              jwt: myCookies.cookies.get("token"),
            },
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  setSubscribed(data.services);
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
  };

  return (
    <div
      style={{ height: "810px" }}
      className="w-11/12 m-auto mt-28 flex flex-col border rounded-2xl shadow-2xl bg-white"
    >
      <div style={{ color: "#272D3B" }} className="flex w-full h-20">
        <h1 className="text-5xl font-extrabold mx-auto mt-5">Your Profile</h1>
        <Link to="/home">
          <i className="text-7xl far fa-times-circle mt-5 mr-7 cursor-pointer transform transition duration-200 hover:scale-90"></i>
        </Link>
      </div>
      <br />
      <hr className="w-10/12 mx-auto" />
      <div
        style={{ color: "#272D3B" }}
        className="text-2xl font-bold w-11/12 h-5/6 flex m-auto"
      >
        <div className="mx-auto mt-14">
          <h1>Profile's picture</h1>
          <div
            style={{
              backgroundImage:
                "url(https://www.flaticon.com/svg/vstatic/svg/206/206853.svg?token=exp=1615054238~hmac=8335c95de605ea1a9240b1d9ddaabee2)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="w-80 h-80 m-auto mt-24 rounded-full bg-gray-600 shadow-2xl"
          ></div>
        </div>
        <div className="flex mx-auto mt-14 w-2/12">
          <form className="flex flex-col w-full">
            <label>Username :</label>
            <input
              defaultValue={username}
              type="text"
              name="username"
              placeholder="Enter your first name"
              className="text-lg block w-full py-2 px-1 mt-3 mb-5 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
              required
            />
            <label>Email :</label>
            <input
              defaultValue={email}
              type="text"
              name="email"
              placeholder="Enter your first email"
              className="text-lg block w-full py-2 px-1 mt-3 mb-5 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
              required
            />
          </form>
        </div>
        <div className="mx-auto mt-14 w-3/12">
          <div className="h-1/2">
            <h1>Service subscribed :</h1>
            <h2 className="text-base font-medium">(Click for unsubscribe)</h2>
            <div className="w-full h-5/6 flex flex-wrap mt-5">
              {Array.isArray(subscribed) &&
                subscribed.map((item, index) => {
                  return (
                    <div
                      onClick={() => unsubscribeService(item)}
                      key={index}
                      style={{ transition: "200ms ease-in" }}
                      className="flex border rounded-2xl shadow-lg bg-blue-700 w-44 m-auto p-2 text-base font-medium text-white cursor-pointer hover:bg-blue-900"
                    >
                      <h1 className="m-auto">{item}</h1>
                      <i className="far fa-times-circle my-auto mr-3"></i>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="h-1/2">
            <h1 className="mt-10">Service unsubscribed :</h1>
            <h2 className="text-base font-medium">(Click for subscribe)</h2>
            <div className="w-full h-5/6 flex flex-wrap mt-5">
              {tab.map((item, index) => {
                if (
                  Array.isArray(subscribed) &&
                  subscribed.includes(item.title.toLocaleLowerCase())
                )
                  return null;
                else
                  return (
                    <div
                      onClick={() => subscribeService(item)}
                      key={index}
                      style={{ transition: "200ms ease-in" }}
                      className="flex border rounded-2xl shadow-lg bg-white w-44 m-auto p-2 text-base font-medium text-black cursor-pointer hover:bg-gray-200"
                    >
                      <h1 className="m-auto">
                        {item.title.toLocaleLowerCase()}
                      </h1>
                      <i className="far fa-arrow-alt-circle-down my-auto mr-3"></i>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onClickLogout}
        style={{ transition: "200ms ease-in" }}
        className="mb-7 ml-7 text-2xl w-48 py-3 mt-10 rounded-3xl font-bold text-white bg-blue-700
          focus:outline-none hover:bg-blue-900 hover:shadow-none"
      >
        <i className="mr-3 fas fa-sign-out-alt"></i>
        Logout
      </button>
    </div>
  );
};

export default Profil;
