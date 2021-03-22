import React from "react";
import { Link, useHistory } from "react-router-dom";
import { store } from "react-notifications-component";
import { myCookies } from "../App";

import OAuth from "../components/OAuth";

const Login = () => {
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            myCookies.cookies.set("token", data.token);
            history.push("/home");
            store.addNotification({
              title: ":)",
              message: "Succesfully connect to your account !",
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
          });
        } else if (res.status === 418) {
          event.target.email.value = "";
          event.target.password.value = "";
          store.addNotification({
            title: "Error",
            message: "Credentials error !",
            type: "danger",
            insert: "top",
            container: "top-center",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true,
            },
          });
        } else if (res.status === 419) {
          store.addNotification({
            title: "Error",
            message: "Validate your account !",
            type: "danger",
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
    <div className="flex h-screen">
      <div className="h-full w-3/5">
        <div className="bg-white rounded-2xl shadow-2xl w-10/12 mx-auto">
          <div className="w-8/12 m-auto mt-16">
            <h1
              style={{ color: "#676C75" }}
              className="text-7xl font-extrabold pt-10"
            >
              Login
            </h1>
            <h2 style={{ color: "#676C75" }} className="text-2xl my-5">
              Login to the most popular dashboard application
            </h2>
            <hr />
            <div className="grid my-5">
              <form className="mt-5" onSubmit={onSubmit}>
                <div className="w-8/12 py-6">
                  <label className="text-left block text-base font-semibold text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="text-base block w-full py-3 px-1 mt-2 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                    required
                  />
                  <label className="text-left block mt-10 text-base font-semibold text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="text-base block w-full py-3 px-1 mt-2 mb-4 text-gray-800 appearance-none border-2 rounded-lg
                  border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                <div className="w-full text-center">
                  <button
                    type="submit"
                    style={{ transition: "200ms ease-in" }}
                    className="text-3xl w-48 pt-2 pb-4 mt-5 rounded-3xl font-extrabold text-white bg-blue-700
                  focus:outline-none hover:bg-blue-900 hover:shadow-none"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          <OAuth />
          <p
            style={{ color: "#676C75" }}
            className="text-xl text-center mt-14 pb-10"
          >
            Don't have an account ?{" "}
            <Link to={"/register"} className="hover:underline">
              Create an account.
            </Link>
          </p>
        </div>
      </div>
      <div
        className="h-full w-2/5 rounded-l-xl"
        style={{ background: "#81A0F4" }}
      ></div>
    </div>
  );
};

export default Login;
