import React, { useEffect, FC } from "react";
import { History } from "history";
import Loader from "./Loader";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";

interface GreetingProps {
  history: History;
}

const Greeting: FC<GreetingProps> = ({history}) => {
  const { isLoading } = useTypedSelector((state) => state.user);
  const { meAction } = useActions();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      meAction();
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <div className="flex items-center flex-col">
      <div className="h-10">
        {isLoading ? <Loader /> : <h3 className="text-4xl font-bold">Token is Valid</h3>}
      </div>
    </div>
  );
};

export default Greeting;
