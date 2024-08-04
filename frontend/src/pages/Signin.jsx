import { useState } from "react";
import {
  Heading,
  Button,
  SubHeading,
  InputBox,
  BottomWarning,
} from "../components";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config";
export const Signin = () => {
    const navigate = useNavigate();


    const handleSignIn = async () => {
      try {
          const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
              username, 
              password
          });
       
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('firstName', res.data.firstName);
          navigate('/dashboard');
      } catch (error) {
        toast.error(
          err.response?.data?.message || 'An error occurred',
          {
            autoClose: 2000, // Duration in milliseconds
          }
        );
      }
  };


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <>
      <div className="bg-slate-300 min-h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center items-center w-full max-w-md md:max-w-lg  p-4">
          <div className="rounded-lg bg-white w-full text-center p-6 md:p-8 lg:p-10">
            <Heading label={"Sign in"} />
            <SubHeading
              label={"Enter your credentials to access your account"}
            />
            <InputBox
              onChange={(e) => setUsername(e.target.value)}
              placeholder="harkirat@gmail.com"
              label={"Email"}
            />
            <InputBox
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              label={"Password"}
            />
            <div className="pt-4">
              <Button onClick={handleSignIn} label={"Sign in"} />
            </div>
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={"Sign up"}
              to={"/signup"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
