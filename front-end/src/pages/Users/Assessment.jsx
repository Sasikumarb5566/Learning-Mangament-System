import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useParams, useNavigate
 } from "react-router-dom";
import { getAssessmentQuestions, saveAssessmentScore } from "../../services/Users/UserServices";

const Assessment = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const userEmail = localStorage.getItem("email");
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getAssessmentQuestions(courseId);
        console.log("Fetched questions:", response.data.questions);
        setQuestions(response.data.questions); 
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId]);

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q._id] === q.answer) {
        correct += 1;
      }
    });
    const finalScore = (correct / questions.length) * 100;
    setScore(finalScore);
    setSubmitted(true);

    try {
      const res = await saveAssessmentScore({
        email: userEmail,
        courseId,
        score: finalScore,
      });
      if (res.data.success) {
        navigate('/dashboard');
        console.log("Score saved!");
      }
    } catch (err) {
      console.error("Failed to save score:", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-4 md:ml-64 mt-4">
        <h2 className="text-2xl font-bold mb-6">Course Assessment</h2>

        {loading ? (
          <p className="text-gray-500">Loading questions...</p>
        ) : (
          questions.map((q, index) => (
            <div key={q._id} className="mb-6 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">
                {index + 1}. {q.question}
              </h3>
              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`cursor-pointer p-2 rounded border ${
                      selectedAnswers[q._id] === opt
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleOptionSelect(q._id, opt)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        {!submitted && !loading ? (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded mt-4"
            onClick={handleSubmit}
            // disabled={Object.keys(selectedAnswers).length !== questions.length}
          >
            Submit Assessment
          </button>
        ) : (
          submitted && (
            <div className="mt-6 text-xl font-bold text-green-700">
              Your Score: {score}%
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Assessment;
