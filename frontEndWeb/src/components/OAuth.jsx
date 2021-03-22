import React from "react";
import FacebookOAuth from "./OAuth/FacebookOAuth";
import GithubOAuth from "./OAuth/GithubOAuth";
import GoogleOAuth from "./OAuth/GoogleOAuth";

const OAuth = () => {
  return (
    <div className="flex mt-14 m-auto 2xl:w-9/12">
      <FacebookOAuth isOnLogin />
      <GoogleOAuth isOnLogin />
      <GithubOAuth isOnLogin />
    </div>
  );
};

export default OAuth;
