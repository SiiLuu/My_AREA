import React, { useState, useEffect } from "react";
import { myCookies } from "../App";
import { store } from "react-notifications-component";

const Home = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/composant/composant_list", {
      method: "GET",
      headers: {
        Accept: "application/json",
        jwt: myCookies.cookies.get("token"),
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setList(data.composant);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const deleteWidget = (item) => {
    fetch("http://localhost:8080/api/composant/unsubscribe_composant", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        jwt: myCookies.cookies.get("token"),
      },
      body: JSON.stringify({
        fctId: item.fctId,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          fetch("http://localhost:8080/api/composant/composant_list", {
            method: "GET",
            headers: {
              Accept: "application/json",
              jwt: myCookies.cookies.get("token"),
            },
          })
            .then((res) => {
              if (res.status === 200) {
                res.json().then((data) => {
                  setList(data.composant);
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
          store.addNotification({
            title: ":)",
            message: "Succesfully removed !",
            type: "success",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div
      style={{ height: "810px", color: "#272D3B" }}
      className="bg-white rounded-2xl shadow-2xl w-10/12 flex m-auto mt-28 mr-12"
    >
      {list.length > 0 ? (
        <div className=" w-11/12 h-5/6 m-auto flex flex-wrap">
          {list.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-indigo-100 w-72 h-32 m-9 border shadow-xl rounded-2xl relative"
              >
                <p className="text-xl font-bold text-center mt-12">
                  {item.name}
                </p>
                <p className="text-red-600 text-xl font-extrabold absolute top-3 left-3">
                  {item.timer} s
                </p>
                <button
                  className="absolute -top-5 -right-4 focus:outline-none transform transition duration-200 hover:scale-125"
                  onClick={() => deleteWidget(item)}
                >
                  <i className="text-3xl fas fa-times-circle"></i>
                </button>
              </div>
            );
          })}{" "}
        </div>
      ) : (
        <div
          style={{ backgroundColor: "#B5C8F9" }}
          className="flex border border-blue-700 rounded-2xl shadow-xl w-1/3 h-20 m-auto text-2xl"
        >
          <h1 className="m-auto">You added 0 widget to your home !</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
