  import axios from 'axios';

  const baseUrl = import.meta.env.VITE_USER_API_BASE_URL || 'http://localhost:5052';

  export const generateOtp = async (user) => {
    return axios.post(`${baseUrl}/otp/generate`, user);
  };

  export const verifyOtp = async (user) => {
    return axios.post(`${baseUrl}/otp/verify`, user);
  };

  export const verifyLogin = async(user) => {
    return axios.post(`${baseUrl}/verify/login`, user);
  }

  export const getCurrentUser = async(email) => {
    return axios.get(`${baseUrl}/current/user`, { params: { email } });
  }

  export const fetchCourses = async() => {
    return axios.get(`${baseUrl}/course/available`);
  }

  export const enrollCourse = async ({ email, courseId }) => {
    return axios.post(`${baseUrl}/course/enroll`, { email, courseId });
  };
  
  export const getEnrolledCourses = async (email) => {
    return axios.get(`${baseUrl}/user/enrolled-courses`, { params: { email } });
  };

  export const myCourse = async(email) => {
    return axios.get(`${baseUrl}/user/my-course`, {params: {email}});
  }

  export const getCourseVideos = async (courseId) => {
    return axios.get(`${baseUrl}/api/courses/${courseId}/videos`);
  };