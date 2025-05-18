import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation } from "react-router-dom";

const Certificates = () => {
  const certificateRef = useRef();
  const location = useLocation();
  const courseData = location.state?.course;
  const userData = location.state?.user;

  if (!courseData) {
    return <p className="text-center text-red-600 mt-10">Certificate data not found.</p>;
  }

  const name = userData.username || "Student";
  const course = courseData.courseName;
  const score = courseData.score;
  const date = new Date(courseData.assessmentSubmittedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const handleDownload = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}_Certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div
        ref={certificateRef}
        className="bg-white border-8 border-blue-600 rounded-lg p-10 shadow-xl w-full max-w-4xl text-center"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Certificate of Completion</h1>
        <p className="text-gray-700 text-xl mb-2">This is proudly presented to</p>
        <h2 className="text-3xl font-bold text-gray-900 my-4">{name}</h2>
        <p className="text-lg text-gray-700">For successfully completing the course</p>
        <h3 className="text-2xl font-semibold text-blue-600 my-2">{course}</h3>
        <p className="text-gray-700 mt-4 text-lg">
          With a score of <span className="font-semibold">{score}%</span>
        </p>
        <p className="text-gray-600 mt-6">
          Date of Completion: <strong>{date}</strong>
        </p>
        <div className="mt-10 flex justify-between items-center px-10">
          <div>
            <hr className="border-t border-gray-400 w-40 mb-1" />
            <p className="text-sm text-gray-600">Instructor Signature</p>
          </div>
          <div>
            <hr className="border-t border-gray-400 w-40 mb-1" />
            <p className="text-sm text-gray-600">Platform Seal</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificates;
