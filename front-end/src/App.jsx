import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/Users/Login";
import Signup from "./pages/Users/Signup";
import Dashboard from "./pages/Users/Dashboard";
import Enrollment from "./pages/Users/Enrollment";
import MyCourse from "./pages/Users/MyCourse";
import Videos from "./pages/Users/Videos";
import Assessment from "./pages/Users/Assessment";
import AllCertificates from "./pages/Users/AllCertificates";
import Certificates from "./components/Certificates";

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
          <Route path="/course/:id/videos" element={<Videos />} />
          <Route path="/assessment/:id/:email" element={<Assessment />} />
          <Route path="/certificate" element={<AllCertificates />} />
          <Route path="/single-certificate" element={<Certificates />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
