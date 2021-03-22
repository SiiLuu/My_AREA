import React from "react";
import FacebookLogin from "react-facebook-login";
import { myCookies } from "../../App";
import { useHistory } from "react-router-dom";
import { store } from "react-notifications-component";

const FacebookOAuth = ({ isOnLogin }) => {
  const history = useHistory();

  const responseFacebook = (response) => {
    let header = null;
    if (!isOnLogin)
      header = {
        "Content-Type": "application/json",
        jwt: myCookies.cookies.get("token"),
      };
    else
      header = {
        "Content-Type": "application/json",
      };
    fetch("http://localhost:8080/api/user/oauth", {
      method: "POST",
      headers: header,
      body: JSON.stringify({
        oauth: "facebook",
        id: response.id,
        refresh_token: response.accessToken,
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
    <div className="m-auto">
      {isOnLogin ? (
        <FacebookLogin
          size="small"
          appId="404790304108197"
          fields="name,email,picture"
          scope="public_profile, email, groups_access_member_info"
          callback={responseFacebook}
          icon="fa-facebook"
        />
      ) : (
        <FacebookLogin
          appId="404790304108197"
          fields="name,email,picture"
          scope="public_profile, email, groups_access_member_info"
          callback={responseFacebook}
          cssClass="bg-blue-800 text-white p-3 absolute top-3 right-3 rounded-xl outline-none
          hover:bg-white hover:text-blue-800 border border-blue-800 focus:outline-none transition transform duration-200"
          textButton="OAuth"
        />
      )}
    </div>
  );
};

export default FacebookOAuth;
