import React from "react";

const Notlogged = () => {
  return (
    <div
      style={{ height: "810px", color: "#272D3B" }}
      className="bg-white rounded-2xl shadow-2xl w-10/12 flex m-auto mt-28 mr-12"
    >
      <div
        style={{ backgroundColor: "#B5C8F9" }}
        className="flex border border-blue-700 rounded-2xl shadow-xl w-1/3 h-20 m-auto text-2xl"
      >
        <h1 className="m-auto">You are not logged in !</h1>
      </div>
    </div>
  );
};

export default Notlogged;
