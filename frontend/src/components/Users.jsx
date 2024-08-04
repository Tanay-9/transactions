import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import {Shimmer} from "./Shimmer";
import { loadingStore } from "../store";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config";

export const Users = () => {
  const { isLoading, setLoading } = loadingStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getData();
  }, [filter]);

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/user/bulk?filter=${filter}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const currentUser = localStorage.getItem("username");
      console.log(response.data.users);
      setUsers(response.data.users.filter((u) => u.username !== currentUser));

    } catch (error) {
      // alert("error pls signin first.");
      navigate("/signin");
      toast.error(
      'An error occurred',
        {
          autoClose: 2000, // Duration in milliseconds
        }
      );
      
    }
    finally {
      setLoading(false)
    }
  };

  if(isLoading) return <Shimmer/>

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search Users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center ">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center  h-full">
          <div className="text-md sm:text-lg" >
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center ">
        <Button
          onClick={(e) => {
            navigate(`/send?to=${user._id}&name=${user.firstName}`);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
