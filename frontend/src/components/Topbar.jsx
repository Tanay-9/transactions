import { useEffect } from "react";
import axios from "axios";
import { balance } from "../store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const Topbar = ({ change }) => {
  const { setData, data } = balance();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/account/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data.balance);
        console.log(res.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [change, setData]); // Adding setData to dependencies

  const currUser = localStorage.getItem("firstName") || "User";

  return (
    <div className="shadow sm:h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full sm:ml-4 font-bold">
        Money Transfer
        <p style={{ color: data < 1000 ? "red" : "black" }}>
          Current balance: ${Math.ceil(data)}
          {data < 1000 ? " Low" : ""}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-center h-full sm:mr-4">
          Hello, {currUser}
        </div>
        <div className="rounded-full h-8 w-8 sm:h-12 sm:w-12 bg-slate-200 flex justify-center items-center  sm:mt-1 sm:mr-2">
          <div className="flex flex-col justify-center h-full items-center">
            <p className="sm:text-xs text-xl">{currUser.slice(0, 1)}</p>   
          </div>
        </div>
      </div>
    </div>
  );
};
