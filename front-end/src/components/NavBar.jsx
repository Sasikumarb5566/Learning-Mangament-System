import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaRegCalendarCheck,
  FaTrophy,
  FaVideo,
  FaBars,
} from "react-icons/fa";

const NavBar = ({ email }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-[#3853cc] text-white p-5 md:fixed md:h-full flex flex-col justify-between 
      ${
        isOpen ? "md:w-64 w-full" : "w-full h-16"
      } transition-all duration-300 md:w-64`}
    >
      <div className="relative md:h-screen">
        <h2 className="text-xl font-bold mb-12 flex items-center justify-between">
          {isOpen ? "LMS Dashboard" : "LMS"}
          <FaBars
            className="cursor-pointer md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          />
        </h2>

        <ul className={`space-y-3 ${!isOpen ? "hidden md:block" : ""}`}>
          <li
            className="flex items-center gap-2 cursor-pointer hover:text-gray-300"
            onClick={() => navigate("/my-course")}
          >
            <FaBook /> My Courses
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
            <FaRegCalendarCheck /> Assignments
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
            <FaTrophy /> Certificates
          </li>
          <li className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
            <FaVideo /> Live Classes
          </li>
        </ul>
        <div
          className={`mt-auto  ${
            isOpen ? "block" : "hidden md:block"
          }`}
        >
          {" "}
          <button
            onClick={() => navigate("/enrollment", { state: { email } })}
            className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4 md:mt-auto md:mb-3 md:absolute md:bottom-3"
          >
            Enroll a New Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
