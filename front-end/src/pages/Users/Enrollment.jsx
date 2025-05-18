import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import CourseCard from "../../components/CourseCard";
import {
  fetchCourses,
  getEnrolledCourses,
  enrollCourse,
} from "../../services/Users/UserServices";

const Enrollment = ({ setCourses }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all courses
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await fetchCourses();
        const coursesWithImages = response.data.courses.map((course) => {
          if (course.image?.data) {
            const base64String = btoa(
              new Uint8Array(course.image.data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            return {
              ...course,
              imageSrc: `data:${course.image.contentType};base64,${base64String}`,
            };
          }
          return course;
        });
        setAvailableCourses(coursesWithImages);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchAllCourses();
  }, []);
  
  useEffect(() => {
    if (!userEmail) return;
  
    const fetchUserEnrolledCourses = async () => {
      try {
        const response = await getEnrolledCourses(userEmail);
        if (response.data.success) {
          setEnrolledCourses(response.data.enrolledCourses);
          setCourses(response.data.enrolledCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };
  
    fetchUserEnrolledCourses();
  }); 
  
  const handleEnroll = async (course) => {
    if (enrolledCourses.some((enrolled) => enrolled._id === course._id)) return;

    try {
      const ok = window.confirm(`Are you sure to enroll the course?`);
      if(ok) {
      const response = await enrollCourse({ email: userEmail, courseId: course._id });
      if (response.data.success) {
        const updatedCourses = [...enrolledCourses, course];
        setEnrolledCourses(updatedCourses);
        console.log("Updated Enrolled Courses:", updatedCourses);
      } else {
        console.log(response.data.msg);
      } }
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data || error.message);
    }
  };
  
  if (!userEmail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl font-semibold mb-4">Please log in to enroll</h2>
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
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 w-full md:ml-64">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 sm:mb-6 w-full md:w-auto"
        >
          Back to Dashboard
        </button>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 sm:mb-4">
            Enroll in a New Course
          </h3>
          <input
            type="text"
            placeholder="Search available courses"
            className="p-2 sm:p-3 border rounded w-full mb-4 sm:mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {availableCourses
              .filter((course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course) => (

                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrolledCourses.some(
                    (enrolled) => enrolled.courseId === course._id
                  )}
                  onEnroll={handleEnroll}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
