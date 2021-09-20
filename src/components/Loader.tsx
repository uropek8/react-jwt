import React, { FC } from "react";
import loader from "../assets/svg/spinning-circles.svg";

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <img className="w-10" src={loader} alt="loader" />
    </div>
  );
};

export default Loader;
