import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../config";
export const SendMoney = () => {
  const [params] = useSearchParams();
  const id = params.get("to");
  const name = params.get("name");
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="border text-card-foreground bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center">Send Money</h2>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold truncate">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount (in Rs)
                </label>
                <input
                  type="number"
                  id="amount"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter amount"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    await axios.post(
                      `${BACKEND_URL}/api/v1/account/transfer`,
                      { to: id, amount },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success("Transaction complete");
                  } catch (err) {
                    toast.error(err.response?.data?.message || "An error occurred", {
                      autoClose: 1000,
                    });
                  } finally {
                    navigate("/dashboard");
                  }
                }}
                className="w-full justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};