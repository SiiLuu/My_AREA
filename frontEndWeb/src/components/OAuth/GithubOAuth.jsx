import React from "react";
import GitHubLogin from "react-github-login";
import { myCookies } from "../../App";
import { useHistory } from "react-router-dom";
import { store } from "react-notifications-component";

const GithubOAuth = ({ isOnLogin }) => {
  const history = useHistory();

  const responseGithub = (response) => {
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
        oauth: "github",
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
    <div className="m-auto">
      {isOnLogin ? (
        <GitHubLogin
          className="border border-gray-900 text-gray-900 bg-white px-5 py-3 hover:bg-gray-900 hover:text-white transform transition duration-300"
          authorizationUrl="https://github.com/login/oauth/authorize"
          clientId="a71f331663d1b4b25208"
          clientSecret="f611c160f7df21ec83734d6d6aeddeaabc774d1d"
          redirectUri="http://localhost:8081/github_callback"
          buttonText="Sign in with Github"
          valid={true}
          scope="repo user"
          onSuccess={responseGithub}
        />
      ) : (
        <GitHubLogin
          className="bg-blue-800 text-white p-3 absolute top-3 right-3 rounded-xl outline-none
          hover:bg-white hover:text-blue-800 border border-blue-800 focus:outline-none transition transform duration-200"
          authorizationUrl="https://github.com/login/oauth/authorize"
          clientId="a71f331663d1b4b25208"
          clientSecret="f611c160f7df21ec83734d6d6aeddeaabc774d1d"
          redirectUri="http://localhost:8081/github_callback"
          buttonText="OAuth"
          valid={true}
          scope="repo user"
          onSuccess={responseGithub}
        />
      )}
    </div>
  );
};

export default GithubOAuth;
