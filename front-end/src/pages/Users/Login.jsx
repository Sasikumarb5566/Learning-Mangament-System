import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBar from "../../components/notification-bar/NotificationBar";
import LoginSignup from "../../layout/Users/LoginSignup";
import { LoginData } from "../../utils/data-validation/SignupData";
import { verifyLogin } from "../../services/Users/UserServices";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification((prev) => ({ ...prev, visible: false })), 5000);
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  const updateLocalStorage = (email) => {
    localStorage.setItem("email", email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (LoginData(formData)) {
      try {
        setIsLoading(true);
        const response = await verifyLogin(formData);
        const user = response.data;

        if (!user.success) {
          showNotification(user.message, "error");
          setIsLoading(false);
          return;
        }

        updateLocalStorage(formData.email);

        showNotification(user.message, "success");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error in verifying login:", error);
        showNotification("Login failed. Please try again.", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification("Enter a valid email and password", "error");
    }
  };

  return (
    <div className="bg-[#ecf0fe] flex items-center justify-center min-h-screen">
      {notification.visible && <NotificationBar {...notification} onClose={hideNotification} />}
      <div className="bg-white p-8 rounded-3xl shadow-xl md:max-w-md w-full max-w-sm z-10">
        <LoginSignup />
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <input
              type="email"
              placeholder="abc@gmail.com"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="border-2 w-full p-3 rounded-full mb-4"
            />
          </div>
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
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
