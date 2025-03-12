export const SignupData = (user) => {
  const { username, email, password } = user;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (username.length < 3) {
    return {
      success: false,
      message: "Username should be greater than or equal to 3 characters.",
    };
  }
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return {
      success: false,
      message: "Password should be at least 6 characters long.",
    };
  }
  return { success: true, message: "OTP sent successfully." };
};

export const LoginData = (user) => {
  const { email, password } = user;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return {
      success: false,
      message: "Password should be at least 6 characters long.",
    };
  }
  return { success: true };
};