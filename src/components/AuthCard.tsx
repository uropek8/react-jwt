import React, { useState, useContext, FC } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "..";

interface AuthCardProos {
  type: string;
}

const AuthCard: FC<AuthCardProos> = ({ type }) => {
  const { authApi } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "login") {
      await authApi.login({ email, password });
      
      window.location.href = "/";
    } else {
      await authApi.register({ email, password });
      
      window.location.href = "/login";
    }
  };

  return (
    <div className="max-w-sm w-full flex bg-white rounded-lg p-8 shadow-sm">
      <form className="flex flex-col w-full" onSubmit={handleSubmitForm}>
        <div className="flex flex-col mb-5">
          <label className="text-gray-900 text-sans font-light mb-1">Email</label>
          <input
            className="w-full rounded-md border-gray-200"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            value={email}
            required
          />
        </div>
        <div className="flex flex-col mb-7">
          <label className="text-gray-900 text-sans font-light mb-1">Password</label>
          <input
            className="w-full rounded-md border-gray-200"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            value={password}
            required
          />
        </div>
        <div className="flex justify-between">
          <Link
            className="text-white text-base font-semibold uppercase bg-gray-500 py-2 px-5 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            to={type === "login" ? "/signup" : "/login"}
          >
            {type !== "login" ? "login" : "sing up"}
          </Link>
          <button className="text-white text-base font-semibold uppercase bg-blue-500 py-2 px-5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
            {type === "login" ? type : "sing up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default observer(AuthCard);
