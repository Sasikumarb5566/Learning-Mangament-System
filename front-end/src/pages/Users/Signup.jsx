import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginSignup from "../../layout/Users/LoginSignup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import NotificationBar from "../../components/notification-bar/NotificationBar";
import { SignupData } from "../../utils/data-validation/SignupData";
import { generateOtp, verifyOtp } from "../../services/Users/UserServices";

const UserSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    inviter: "",
    otp: "",
  });
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  useEffect(() => {
    const inviterParam = new URLSearchParams(location.search).get("inviter");
    if (inviterParam) {
      setFormData((prev) => ({ ...prev, inviter: inviterParam }));
    }
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification((prev) => ({ ...prev, visible: false })), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const validationResponse = SignupData(formData);
    if (!validationResponse.success) {
      showNotification(validationResponse.message, "error");
      setIsLoading(false);
      return;
    }
  
    try {
      if (isOtpSent) {
        // Verify OTP and Sign Up
        const response = await verifyOtp(formData);
        if (!response.data.success) {
          showNotification(response.data.message, "error");
        } else {
          showNotification(response.data.message, "success");
  
          // 🔹 Update localStorage on successful signup
          localStorage.setItem("email", formData.email);
  
          // Navigate to Dashboard
          navigate("/dashboard");
        }
      } else {
        // Generate OTP
        const response = await generateOtp(formData);
        if (!response.data.success) {
          showNotification(response.data.message, "error");
        } else {
          showNotification(response.data.message, "success");
          setIsOtpSent(true);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[#ecf0fe] flex items-center justify-center min-h-screen">
      {notification.visible && (
        <NotificationBar message={notification.message} type={notification.type} />
      )}
      <div className="bg-white p-8 rounded-3xl shadow-xl md:max-w-md w-full max-w-sm">
        <LoginSignup />
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
          </div>

          {isOtpSent && (
            <div className="flex relative flex-col">
              <p className="text-gray-500 ml-2 text-sm">
                <FontAwesomeIcon icon={faInfoCircle} className="mr-1 mt-1" />
                OTP will expire in 10 minutes
              </p>
              <input
                type="number"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleInputChange}
                required
                className="border-2 w-full p-3 rounded-full mb-4"
              />
            </div>
          )}

          <button
            type="submit"
            className={`bg-[#4669ff] p-3 rounded-full text-white w-full transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3853cc]"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex space-x-2 justify-center items-center">
                <span className="sr-only">Loading...</span>
                <div className="h-3 w-3 bg-white rounded-full animate-bounce"></div>
                <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            ) : isOtpSent ? (
              "Verify and Sign Up"
            ) : (
              "Generate OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
