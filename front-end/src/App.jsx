import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/Users/Login";
import Signup from "./pages/Users/Signup";
import Dashboard from "./pages/Users/Dashboard";
import Enrollment from "./pages/Users/Enrollment";
import MyCourse from "./pages/Users/MyCourse";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enrollment" element={<Enrollment />} />
          <Route path="/my-course" element={<MyCourse />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
