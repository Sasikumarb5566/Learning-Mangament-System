import React from "react";

const AlertBanner = ({ message, type, onClose }) => {
  const colors = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    info: "bg-blue-100 border-blue-500 text-blue-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full p-4 border-b ${colors[type]} flex items-center justify-between z-50`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-xl font-bold focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default AlertBanner;
