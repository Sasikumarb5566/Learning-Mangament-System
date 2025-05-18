import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { getCompletedCertificates } from "../../services/Users/UserServices";
import { useNavigate } from "react-router-dom";

const AllCertificates = () => {
  const userEmail = localStorage.getItem("email");
  const [certificates, setCertificates] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedCertificates = async () => {
      try {
        const res = await getCompletedCertificates(userEmail);
        const fetchedCertificates = res?.data?.completedCourses || [];
        const userDetails = res?.data?.user || {};
        setUser(userDetails);
        setCertificates(fetchedCertificates);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
        setCertificates([]);
        setUser(res.data.user)
        console.log(user);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCertificates();
  }, [userEmail]);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-4 md:ml-64 mt-4">
        <h1 className="text-2xl font-bold mb-4">All Certificates</h1>
        {loading ? (
          <p>Loading...</p>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certificates.map((certificate, index) => (
              <div key={index} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">
                  {certificate.courseName}
                </h2>
                <p className="text-sm text-gray-500">
                  Completed on:{" "}
                  {new Date(
                    certificate.assessmentSubmittedDate
                  ).toLocaleDateString()}
                </p>
                <p>Score: {certificate.score}%</p>
                <button
                  onClick={() => {
                    navigate("/single-certificate", {
                      state: { course: certificate, user },
                    });
                  }}
                  className="text-blue-500 underline mt-2 inline-block"
                >
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No certificates found.</p>
        )}
      </div>
    </div>
  );
};

export default AllCertificates;
