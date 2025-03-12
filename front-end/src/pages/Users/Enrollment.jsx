import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import CourseCard from "../../components/CourseCard";
import { fetchCourses, getEnrolledCourses, enrollCourse } from "../../services/Users/UserServices";
import { useAuth } from "../../AuthContext";

const Enrollment = ({ setCourses }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await fetchCourses();
        const coursesWithImages = response.data.courses.map((course) => {
          if (course.image?.data) {
            const base64String = btoa(
              new Uint8Array(course.image.data.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
            );
            return { ...course, imageSrc: `data:${course.image.contentType};base64,${base64String}` };
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
    const fetchUserEnrolledCourses = async () => {
      try {
        if (!user?.email) return;

        const response = await getEnrolledCourses(user.email);
        if (response.data.success) {
          const enrolledCourseIds = new Set(response.data.enrolledCourses.map(course => course._id));
          setEnrolledCourses(enrolledCourseIds);
          setCourses(response.data.enrolledCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchUserEnrolledCourses();
  }, [user, setCourses]);

  const handleEnroll = async (course) => {
    if (enrolledCourses.has(course._id)) return;
  
    const payload = { email: user?.email, courseId: course._id };
  
    console.log("Enrollment Payload:", payload); // Debugging
  
    try {
      const response = await enrollCourse(payload);
      console.log("Enrollment Response:", response.data); // Debugging
  
      if (response.data.success) {
        setCourses(prev => [...prev, course]);
        setEnrolledCourses(prev => new Set([...prev, course._id]));
      } else {
        console.log(response.data.msg);
      }
    } catch (error) {
      console.error("Enrollment failed:", error.response?.data || error.message);
    }
  };
  
  useEffect(() => {
    console.log("Updated enrolled courses:", enrolledCourses);
  }, [enrolledCourses]);
  
  
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
          <h3 className="text-xl font-semibold mb-3 sm:mb-4">Enroll in a New Course</h3>
          <input
            type="text"
            placeholder="Search available courses"
            className="p-2 sm:p-3 border rounded w-full mb-4 sm:mb-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {availableCourses
              .filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrolledCourses.has(course._id)}
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
