import React, { useState } from "react";

const CourseCard = ({ course, isEnrolled, onEnroll }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={course.imageSrc || "/default-image.jpg"}
        alt={course.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold">{course.name}</h3>

        <button
          className="text-sm text-gray-500 underline mt-1"
          onClick={() => setShowModal(true)}
        >
          View Description
        </button>

        <p className={`text-lg font-bold text-blue-600 ${course.price === "Free" ? "text-green-500" : ""} mt-2`}>
          {course.price}
        </p>

        <button
          onClick={() => onEnroll(course)}
          className={`mt-4 w-full py-2 rounded text-white ${
            isEnrolled ? "bg-green-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
          }`}
          disabled={isEnrolled}
        >
          {isEnrolled ? "✔ Enrolled" : "Enroll Now"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">{course.description.title}</h2>

            <p className="text-gray-700 mb-3"><strong>Duration:</strong> {course.description.duration}</p>
            <p className="text-gray-700 mb-3"><strong>Author:</strong> {course.description.author}</p>

            <h3 className="mb-1 font-semibold">Course Content:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {course.description.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <p className="mt-3 text-gray-700"><strong>Assessment Date:</strong> {course.description.assessmentDate}</p>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
