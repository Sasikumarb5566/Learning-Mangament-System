import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { getEnrolledCourses, myCourse } from "../../services/Users/UserServices";

const MyCourse = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserCourses = async () => {
      try {
        setLoading(true);

        const response = await myCourse(userEmail);
        const enrollDetails = await getEnrolledCourses(userEmail);

        if (response.data.success) {
          const mergedCourses = response.data.courses.map((course) => {
            const courseProgress =
              enrollDetails.data.enrolledCourses.find(
                (p) => p.courseId === course._id
              )?.progress || 0;

            // Convert image data if available
            let imageSrc = "/default-image.jpg"; // Default image
            if (course.image?.data) {
              const base64String = btoa(
                new Uint8Array(course.image.data.data).reduce(
                  (data, byte) => data + String.fromCharCode(byte),
                  ""
                )
              );
              imageSrc = `data:${course.image.contentType};base64,${base64String}`;
            }

            return { ...course, progress: courseProgress, imageSrc };
          });

          setCourses(mergedCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [userEmail]);

  if (!userEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl font-semibold mb-4">
          Please log in to view your courses
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <NavBar />
      <div className="p-6 w-full md:ml-64">
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        {loading ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow-lg rounded-lg p-4"
              >
                <img
                  src={course.imageSrc}
                  alt={course.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-4">{course.name}</h3>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Instructor:</span>{" "}
                  {course.description.author}
                </p>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.progress || 0}% Completed
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/course/${course._id}`)}
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
