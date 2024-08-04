import { useEffect } from "react";
import { Topbar, Users } from "../components";
import { useNavigate } from "react-router-dom";
import { myStore } from "../store";

export const Dashboard = () => {
  const change = myStore((state) => state.increaseTime);

  return (
    <>
      <Topbar change={change} />
      <div className="m-2 sm:m-5">
        <Users />
      </div>
    </>
  );
};
