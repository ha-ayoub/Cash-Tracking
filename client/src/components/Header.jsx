import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log out");
      }
      setIsLoggedIn(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error.message);
      toast.error("Error during logout");
    }
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate(`/dashboard/${userId}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/user/check-auth`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="h-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div
            className="md:flex md:items-center md:gap-12 cursor-pointer"
            onClick={handleLogoClick}
          >
            Cash Tracking
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block ">
              <ul className="flex items-center gap-6 text-sm">
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link to="/sign-up">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            label={"Get Started"}
                            className="min-w-[120px] border"
                          />
                        </motion.div>
                      </Link>
                    </li>

                    <li>
                      <Link to="/sign-in">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            label={"Login"}
                            className="min-w-[120px] border"
                          />
                        </motion.div>
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <Link to="/">
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button
                            label={"Logout"}
                            className="min-w-[120px] border"
                            onClick={handleLogout}
                          />
                        </motion.div>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            <div className="block md:hidden ">
              <button
                className="rounded  p-2 text-gray-600 transition hover:text-gray-600/75"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* mobile nav */}
            <nav
              aria-label="Global"
              className={`${
                isOpen ? "translate-x-[0]" : "translate-x-[110%]"
              } fixed md:hidden border bg-white top-0 right-0 transition-all z-[990]`}
              // fix this: when isOpen true and i change width the sidebar disappears but when i go to smaller screen size it is already open.
            >
              <div className="block md:hidden z-[999]">
                <button
                  className="absolute top-4 left-5 rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
              <ul
                className={`${
                  isOpen ? "flex flex-col" : "hidden"
                }   min-h-screen w-[80vw]  justify-center items-center gap-6 text-lg z-[999] `}
              >
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link to="/sign-up">
                        <button className="min-w-[120px]">Get Started</button>
                      </Link>
                    </li>

                    <li>
                      <Link to="/sign-in">
                        <button variant="outline" className="min-w-[120px]">
                          Login
                        </button>
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <li>
                      <Link to="/">
                        <button
                          className="min-w-[120px]"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <ToastContainer />
    </header>
  );
};

export default Header;
