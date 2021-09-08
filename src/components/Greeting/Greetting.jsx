import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../..";
import Loader from "../Loader/Loader";

const Greeting = () => {
  const { jwtApi } = useContext(Context);

  useEffect(() => {
    jwtApi.setLoading(true);
    jwtApi.me();
    jwtApi.setLoading(false);
  }, []);

  return (
    <div className="flex items-center flex-col">
      <div className="h-10">
        {jwtApi.isLoading ? <Loader /> : <h3 className="text-4xl font-bold">Token is Valid</h3>}
      </div>
    </div>
  );
};

export default observer(Greeting);
