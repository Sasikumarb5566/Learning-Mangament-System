import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import loginError from "../../assets/login.png";
import { getCurrentUser } from "../../services/Users/UserServices";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ username: "" });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser(user?.email);
        const details = response.data;
        setCurrentUser({ username: details.data.username });
      } catch (err) {
        console.error("Error in fetching current user:", err);
      }
    };

    if (user?.email) {
      fetchCurrentUser();
      setCourses([
        { id: 1, name: "React Basics", progress: 80 },
        { id: 2, name: "Node.js API Development", progress: 50 },
      ]);
    }
  }, [user?.email]);

  if (!user?.email) {
    return (
      <div className="bg-[#ecf0fe] flex flex-col gap-2 items-center justify-center min-h-screen ">
        <div className="flex items-center gap-4 mb-6">
          <img src={loginError} alt="login" className="w-28" />
          <div className="font-bold text-5xl">Go back...</div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-[#4669ff] hover:bg-[#435dcf] text-white p-2 px-12 rounded-xl"
        >
          Login
        </button>
      </div>
    );
  }

  const progressData = [
    { name: "Week 1", progress: 20 },
    { name: "Week 2", progress: 40 },
    { name: "Week 3", progress: 60 },
    { name: "Week 4", progress: 80 },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-6 mt-16 md:mt-0 md:ml-64">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {currentUser.username}!</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{course.name}</h3>
              <p className="text-gray-600">Progress: {course.progress}%</p>
              <div className="w-full bg-gray-200 h-3 rounded mt-2">
                <div
                  className="bg-[#3853cc] h-3 rounded"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#2563EB"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
