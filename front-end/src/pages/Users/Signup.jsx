import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginSignup from "../../layout/Users/LoginSignup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import NotificationBar from "../../components/notification-bar/NotificationBar";
import { SignupData } from "../../utils/data-validation/SignupData";
import { generateOtp, verifyOtp } from "../../services/Users/UserServices";

const UserSignup = () => {
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

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };
  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification((prev) => ({ ...prev, visible: false })), 5000);
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const inviterLinkParam = queryParams.get("inviter");
    if (inviterLinkParam) {
      setFormData((prevData) => ({
        ...prevData,
        inviter: inviterLinkParam,
      }));
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isOtpSent) {
      const validationResponse = SignupData(formData);
      console.log(formData.username)
      if (validationResponse.success) {
        try {
          setIsLoading(true);
          const response = await verifyOtp(formData);
          const user = response.data;
          if (!user.success) {
            showNotification(user.message, "error");
            setIsLoading(false);
            return;
          }
          showNotification(user.message, "success");
          navigate("/dashboard",{state: {email: formData.email}});
          setIsLoading(false);
        } catch (error) {
          console.error("Error in verifying OTP: ", error);
          setIsLoading(false);
        }
      } else {
        showNotification(validationResponse.message, "error");
        console.log(validationResponse.message);
      }
    } else {
      const validationResponse = SignupData(formData);
      if (validationResponse.success) {
        try {
          setIsLoading(true);
          const response = await generateOtp(formData);
          const user = response.data;
          if (!user.success) {
            showNotification(user.message, "error");
            setIsLoading(false);
            return;
          }
          showNotification(user.message, "success");
          setIsOtpSent(true);
          setIsLoading(false);
        } catch (error) {
          console.error("Error in generating OTP: ", error);
          setIsLoading(false);
        }
      } else {
        showNotification(validationResponse.message, "error");
      }
    }
  };

  return (
    <div className="bg-[#ecf0fe] flex items-center justify-center min-h-screen">
      {notification.visible && (
        <NotificationBar
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
      <div className="bg-white p-8 rounded-3xl shadow-xl md:max-w-md w-full max-w-sm">
        <LoginSignup />
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="email"
              placeholder="abc@gmail.com"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="password"
              placeholder="Create Password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
          </div>
          {isOtpSent && (
            <div className="flex relative flex-col">
              <div>
                <p className="text-gray-500 ml-2 text-sm">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-1 mt-1" />
                  OTP will expire in 10 minutes
                </p>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      otp: e.target.value,
                    })
                  }
                  required
                  className="border-2 w-full p-3 rounded-full mb-4"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="bg-[#4669ff] p-3 rounded-full text-white w-full hover:bg-[#3853cc] transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex space-x-2 justify-center items-center dark:invert p-1">
                <span className="sr-only">Loading...</span>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.14s]"></div>
                <div className="h-3 w-3 bg-black rounded-full animate-bounce"></div>
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
