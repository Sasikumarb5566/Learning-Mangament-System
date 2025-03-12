import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname.slice(1); 

  const isActiveLogin = activePath === "" || activePath === "/";
  const isActiveSignup = activePath === "signup" || location.search.includes("inviter");

  const handleSignupLogin = (type) => {
    navigate(`/${type}`);
  };

  return (
    <div>
      <div className="font-bold text-center mb-8 text-2xl">
        Learning Management System
      </div>
      <div className="flex justify-around border rounded-full bg-gray-200 transition-all">
        <button
          className={`w-1/2 p-3 ${
            isActiveLogin ? "bg-[#4669ff] rounded-full text-white" : ""
          }`}
          onClick={() => handleSignupLogin("")}
        >
          Login
        </button>
        <button
          className={`w-1/2 p-3 ${
            isActiveSignup ? "bg-[#4669ff] rounded-full text-white" : ""
          }`}
          onClick={() => handleSignupLogin("signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
