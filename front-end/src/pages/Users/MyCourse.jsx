import { getEnrolledCourses } from "../../services/Users/UserServices";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../AuthContext";

const MyCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const email = location.state?.email;
  useEffect(() => {
    if (!user?.email) return;

    const fetchCourses = async () => {
      try {
        const response = await getEnrolledCourses(user.email);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchCourses();
  }, [user?.email]);

  return (
    <div className="flex flex-col md:flex-row">
      <NavBar />
      <div className="p-6 w-full md:ml-64">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        {courses.length === 0 ? (
          <p className="text-gray-500">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-lg rounded-lg p-4"
              >
                <img
                  src={course.imageSrc || "/default-image.jpg"}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-4">{course.name}</h3>
                <p className="text-sm text-gray-500">
                  Instructor: {course.instructor}
                </p>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.progress}% Completed
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/course/${course.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
                >
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;
