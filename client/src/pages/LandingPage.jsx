import React from "react";
import Button from "../components/Button";
import { Link, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
import { motion } from "framer-motion";
import Header from "../components/Header";

const LandingPage = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/loading" && <Header />}

      <div className="max-w-screen-lg mx-auto p-2 min-h-[calc(100dvh-4rem)] flex-1 flex flex-col gap-2 items-center justify-center">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-5xl text-center">
          Your Transactions, Simplified
        </h1>
        <p className="text-center font-thin opacity-50">
          Create, Manage and Conquer your Expense and Income
        </p>

        <Link to="/sign-up">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              label={"Get Started"}
              className="mt-4 py-4 w-[200px] rounded-xl font-medium text-[1.10rem] bg-black text-white hover:bg-black-2 transition-all"
            />
          </motion.div>
        </Link>
      </div>
    </>
  );
};

export default LandingPage;
