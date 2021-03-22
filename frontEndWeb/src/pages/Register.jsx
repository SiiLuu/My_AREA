import React from "react";
import { Link, useHistory } from "react-router-dom";
import { store } from "react-notifications-component";

const Register = () => {
  const history = useHistory();

  const onSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: event.target.email.value,
        password: event.target.password.value,
        username: event.target.username.value,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          history.push("/login");
          store.addNotification({
            title: "Thanks",
            message: "Your account has been succesfully created !",
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
        } else if (res.status === 415) {
          event.target.email.value = "";
          event.target.password.value = "";
          event.target.username.value = "";
          store.addNotification({
            title: "Error",
            message: "Bad email or password format !",
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
        } else if (res.status === 416) {
          event.target.email.value = "";
          store.addNotification({
            title: "Error",
            message: "This email already exist !",
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
          <div className="w-8/12 m-auto mt-32">
            <h1
              style={{ color: "#676C75" }}
              className="text-7xl font-extrabold pt-5"
            >
              Register
            </h1>
            <h2 style={{ color: "#676C75" }} className="text-2xl my-5">
              Register to the most popular dashboard application
            </h2>
            <hr />
            <div className="grid my-3">
              <form onSubmit={onSubmit}>
                <div className="w-8/12 py-6">
                  <label className="text-left block text-base font-semibold text-gray-600">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="text-base block w-full py-3 px-1 mt-1 text-gray-800 appearance-none border-2 rounded-lg
                border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                    required
                  />
                  <label className="text-left block mt-5 text-base font-semibold text-gray-600">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="text-base block w-full py-3 px-1 mt-1 mb-2 text-gray-800 appearance-none border-2 rounded-lg
                  border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                    required
                  />
                  <label className="text-left block mt-5 text-base font-semibold text-gray-600">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Your username"
                    className="text-base block w-full py-3 px-1 mt-1 mb-2 text-gray-800 appearance-none border-2 rounded-lg
                  border-gray-200 focus:text-gray-500 focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
                <div className="w-full text-center">
                  <button
                    type="submit"
                    style={{ transition: "200ms ease-in" }}
                    className="text-3xl w-48 pt-2 pb-4 mt-2 rounded-3xl font-extrabold text-white bg-blue-700
                  focus:outline-none hover:bg-blue-900 hover:shadow-none"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
          <p
            style={{ color: "#676C75" }}
            className="text-xl text-center mt-7 pb-10"
          >
            Already have an account ?{" "}
            <Link to={"/login"} className="hover:underline">
              Sign In.
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

export default Register;
