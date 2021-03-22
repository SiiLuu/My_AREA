import React from "react";
import { myCookies } from "../../App";
import { useHistory } from "react-router-dom";
import { store } from "react-notifications-component";
import GoogleLogin from "react-google-login";

const GoogleOAuth = ({ isOnLogin }) => {
  const history = useHistory();

  const responseGoogle = (response) => {
    let header = null;
    if (!isOnLogin) {
      header = {
        "Content-Type": "application/json",
        jwt: myCookies.cookies.get("token"),
      };
    } else {
      header = {
        "Content-Type": "application/json",
      };
    }
    fetch("http://localhost:8080/api/user/oauth", {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        oauth: "google",
        id: "",
        refresh_token: response.code,
      }),
    })
      .then((res) => {
        if (res.status === 200 && isOnLogin) {
          res.json().then((data) => {
            myCookies.cookies.set("token", data.token);
            history.push("/home");
            store.addNotification({
              title: ":)",
              message: "Succesfully connected to your account !",
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
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {isOnLogin ? (
        <div className="m-auto">
          <GoogleLogin
            clientId="566470595427-ras2foj9kmcraicrvon62bqd6m68bon9.apps.googleusercontent.com"
            scope="profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send"
            responseType="code"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      ) : (
        <div
          className="bg-blue-800 text-white p-3 absolute top-3 right-3 rounded-xl outline-none
        hover:bg-white hover:text-blue-800 border border-blue-800 focus:outline-none transition transform duration-200 cursor-pointer"
        >
          <GoogleLogin
            clientId="566470595427-ras2foj9kmcraicrvon62bqd6m68bon9.apps.googleusercontent.com"
            scope="profile email https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.send"
            responseType="code"
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                OAuth
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      )}
    </>
  );
};

export default GoogleOAuth;
