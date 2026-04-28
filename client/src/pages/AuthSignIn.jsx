import React, { useState } from "react";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";

const AuthSignIn = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/user/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        }
      );

      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        navigate(`/dashboard/${data.id}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.message);
    }
  }

  return (
    <>
      {location.pathname !== "/loading" && <Header />}
      <div className="max-w-screen-xl mx-auto p-2 min-h-[calc(100dvh-4rem)] flex-1 flex flex-col gap-2 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] w-full flex flex-col gap-2 border rounded-xl p-4"
        >
          <h1 className="text-2xl font-bold text-center">
            Welcome Back to CashTracking
          </h1>
          <p className="text-center text-sm font-thin opacity-50">
            Login to CashTracking and manage your Expenses
          </p>
          <div className="mt-4 flex flex-col gap-1">
            <label
              htmlFor="email"
              className="cursor-pointer text-[0.9rem] md:text-[1rem]"
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="cursor-pointer text-[0.9rem] md:text-[1rem]"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="123321"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none p-2 border rounded-md placeholder:font-thin placeholder:text-sm"
              required
            />
          </div>
          <motion.div whileTap={{ scale: 0.95 }} className="mt-2 flex w-max ">
            <Button label={"Login"} className="bg-black text-white" />
          </motion.div>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold underline cursor-pointer"
            >
              Create One
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default AuthSignIn;
