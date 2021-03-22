import React, { useState, useEffect } from "react";
import { myCookies } from "../App";
import { store } from "react-notifications-component";
import { useHistory } from "react-router-dom";

import tab from "../listWidgets";

const Widget = () => {
  const history = useHistory();

  const [subscribed, setSubscribed] = useState(null);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState(null);
  const [action, setAction] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [timer, setTimer] = useState("");
  const [id, setId] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const [params, setParams] = useState("");
  const [TogleParam, setTogleParam] = useState(false);
  const [params2, setParams2] = useState("");
  const [TogleParam2, setTogleParam2] = useState(false);

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
    setTitle(selected?.title);
    setAction(selected?.actions[0]);
  }, [selected]);

  const onclickCreate = () => {
    if (
      name === "" ||
      title === null ||
      timer === "" ||
      id === null ||
      trigger === null ||
      (TogleParam === true && params === "") ||
      (TogleParam2 === true && params2 === "")
    )
      store.addNotification({
        title: "Warning",
        message: "Please fill all infos!",
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
    else {
      let arg = null;
      if (params === "") arg = [params2];
      else arg = [params];
      fetch("http://localhost:8080/api/composant/subscribe_composant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          jwt: myCookies.cookies.get("token"),
        },
        body: JSON.stringify({
          name: name,
          timer: timer,
          fctId: trigger,
          args: arg,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            history.push("/home");
            store.addNotification({
              title: ":)",
              message: "Successfully created !",
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
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <div
      style={{ height: "810px", color: "#272D3B" }}
      className="bg-white rounded-2xl shadow-2xl w-10/12 m-auto mt-28 mr-12"
    >
      <div className="w-full h-20">
        <h1 className="text-center text-5xl font-extrabold mx-auto pt-5">
          Create a widget
        </h1>
        <br />
        <hr className="w-10/12 mx-auto" />
      </div>
      <div
        style={{ color: "#272D3B" }}
        className="w-11/12 h-5/6 m-auto mt-10 text-xl font-bold"
      >
        <div>
          <h1>Select a widget service :</h1>
          <div className="flex my-10">
            {subscribed?.length > 0 ? (
              tab.map((item, index) => {
                if (!subscribed?.includes(item.title.toLowerCase()))
                  return null;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelected(tab[index]);
                      setTogleParam(false);
                      setTogleParam2(false);
                      setAction(null);
                      setReaction(null);
                      setId(null);
                      setTrigger(null);
                    }}
                    style={{ transition: "200ms ease-in" }}
                    className={`flex rounded-2xl shadow-lg ${
                      title === item.title
                        ? "bg-blue-700  text-white  hover:bg-blue-900"
                        : "border bg-white text-black hover:bg-gray-200"
                    } w-36 my-auto mr-10 p-2 text-base font-medium cursor-pointer`}
                  >
                    <h1 className="m-auto">{item.title}</h1>
                  </div>
                );
              })
            ) : (
              <div
                className="flex rounded-xl shadow-lg border bg-indigo-50 text-black
                my-auto mr-10 py-3 px-7 text-xl font-bold"
              >
                <h1 className="m-auto">You are subscribed to 0 services</h1>
              </div>
            )}
          </div>
        </div>
        <div className="flex">
          <div className="mr-28">
            <h1>Enter a widget name :</h1>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter a wdiget name"
              className="text-base block w-96 py-2 px-1 mt-10 mb-10 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
              required
            />
          </div>
          <div>
            <h1>Enter a refresh timer (seconds) :</h1>
            <input
              type="text"
              onChange={(e) => setTimer(e.target.value)}
              value={timer}
              placeholder="Enter a refresh timer"
              className="text-base block w-40 py-2 px-1 mt-10 mb-10 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
              required
            />
          </div>
        </div>
        {selected && (
          <div className="flex">
            <div className="mr-24">
              <h1>Select an action :</h1>
              <div className="flex my-10">
                {selected.actions.map((item, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setAction(item.title);
                        setReaction(selected?.reactions[0]);
                        setId(item.id);
                        setTrigger(null);
                        setTogleParam2(false);
                        item.params === true
                          ? setTogleParam(true)
                          : setTogleParam(false);
                      }}
                      style={{ transition: "200ms ease-in" }}
                      className={`flex rounded-2xl shadow-lg ${
                        action === item.title
                          ? "bg-blue-700  text-white  hover:bg-blue-900"
                          : "border bg-white text-black hover:bg-gray-200"
                      } my-auto mr-10 py-2 px-5 text-base font-medium cursor-pointer`}
                    >
                      <h1 className="m-auto">{item.title}</h1>
                    </div>
                  );
                })}
              </div>
            </div>
            {TogleParam && (
              <div>
                <h1>Select a parameter :</h1>
                <input
                  type="text"
                  onChange={(e) => setParams(e.target.value)}
                  value={params}
                  placeholder="Enter a parameter"
                  className="text-base block w-96 py-2 px-1 mt-10 mb-10 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                  required
                />
              </div>
            )}
          </div>
        )}
        <div className="flex">
          <div className="mr-24">
            {selected && reaction && <h1>Select a reaction :</h1>}
            <div className="flex my-10">
              {selected &&
                reaction &&
                selected.reactions.map((item, index) => {
                  if (item.id !== id && id !== "oui") return null;
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setReaction(item.title);
                        setTrigger(item.id);
                        item.params === true
                          ? setTogleParam2(true)
                          : setTogleParam2(false);
                      }}
                      style={{ transition: "200ms ease-in" }}
                      className={`flex rounded-2xl shadow-lg ${
                        reaction === item.title
                          ? "bg-blue-700  text-white  hover:bg-blue-900"
                          : "border bg-white text-black hover:bg-gray-200"
                      } my-auto mr-10 py-2 px-5 text-base font-medium cursor-pointer`}
                    >
                      <h1 className="m-auto">{item.title}</h1>
                    </div>
                  );
                })}
            </div>
          </div>
          {TogleParam2 && (
            <div>
              <h1>Select a parameter :</h1>
              <input
                type="text"
                onChange={(e) => setParams2(e.target.value)}
                value={params2}
                placeholder="Enter a parameter"
                className="text-base block w-96 py-2 px-1 mt-10 mb-10 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                required
              />
            </div>
          )}
        </div>
        <div className="w-4/12 absolute bottom-8 right-1/4">
          <button
            onClick={() => {
              setSelected(null);
              setName("");
              setTogleParam(false);
              setTimer("");
              setAction(null);
              setReaction(null);
              setParams("");
              setTogleParam2(false);
              setParams2("");
            }}
            style={{ transition: "200ms ease-in" }}
            className="outline-none border border-black mb-7 ml-7 text-2xl w-44 py-3 mt-10 mr-28 rounded-3xl font-bold text-black bg-white
          focus:outline-none hover:bg-gray-500 hover:border-white hover:text-white hover:shadow-none"
          >
            Clear
          </button>
          <button
            type="submit"
            onClick={onclickCreate}
            style={{ transition: "200ms ease-in" }}
            className="mb-7 ml-7 text-2xl w-44 py-3 mt-10 rounded-3xl font-bold text-white bg-blue-700
          focus:outline-none hover:bg-blue-900 hover:shadow-none"
          >
            Create
          </button>
        </div>
        {selected && (
          <img
            className="w-32 absolute bottom-60 right-60"
            src={selected.icon}
            alt="service icon"
          />
        )}
      </div>
    </div>
  );
};

export default Widget;
