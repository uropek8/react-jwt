import React, { useContext, useEffect, FC } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../";
import Loader from "./Loader";

const Greeting: FC = () => {
  const { authApi } = useContext(Context);

  useEffect(() => {
    const fetchAuth = async () => {
      await authApi.me();
    };
    fetchAuth();
  }, []);

  return (
    <div className="flex items-center flex-col">
      <div className="h-10">
        {authApi.isLoading ? <Loader /> : <h3 className="text-4xl font-bold">Token is Valid</h3>}
      </div>
    </div>
  );
};

export default observer(Greeting);
