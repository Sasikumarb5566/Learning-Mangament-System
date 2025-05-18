import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import NavBar from "../../components/NavBar";
import {
  getCourseVideos,
  getAllVideoProgress,
  saveProgresses,
} from "../../services/Users/UserServices";

const Videos = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [courseName, setCourseName] = useState("");
  const [completedVideos, setCompletedVideos] = useState([]);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  const playerRef = useRef(null);

  const progress = videos.length
    ? Math.floor((completedVideos.length / videos.length) * 100)
    : 0;

  const saveProgress = useCallback(
    async (currentTime) => {
      if (!selectedVideo) return;

      try {
        const duration = playerRef.current?.getDuration() || 0;
        const isComplete = currentTime >= duration - 10;

        const response = await saveProgresses({
          email: userEmail,
          courseId: id,
          videoId: selectedVideo.id,
          lastWatched: currentTime,
          completed: isComplete,
          progress: progress,
        });

        if (response.data.success) {
          console.log("Progress stored successfully");
        }
      } catch (err) {
        console.error("Error saving progress", err);
      }
    },
    [selectedVideo, userEmail, id, progress]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const videoRes = await getCourseVideos(id);
        const data = videoRes.data;
        setCourseName(data.courseName);
        setVideos(data.playlists);

        const progressRes = await getAllVideoProgress({
          email: userEmail,
          courseId: id,
        });

        const { progressList, assessmentSubmitted } = progressRes.data;
        const completed = progressList
          .filter((item) => item.completed)
          .map((item) => item.videoId);

        setCompletedVideos(completed);
        setAssessmentSubmitted(assessmentSubmitted);

        let nextVideo = null;
        if (completed.length > 0) {
          const lastCompletedId = completed[completed.length - 1];
          const lastIndex = data.playlists.findIndex(
            (v) => v.id === lastCompletedId
          );
          nextVideo = data.playlists[lastIndex + 1] || null;
        }

        if (!nextVideo && data.playlists.length > 0) {
          nextVideo = data.playlists.find((v) => !completed.includes(v.id));
        }

        setSelectedVideo(nextVideo || data.playlists[0]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userEmail]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && selectedVideo) {
        const currentTime = playerRef.current.getCurrentTime();
        saveProgress(currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedVideo, saveProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (playerRef.current && selectedVideo) {
        const currentTime = playerRef.current.getCurrentTime();
        saveProgress(currentTime);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [selectedVideo, saveProgress]);

  const handleVideoComplete = (videoId) => {
    if (!completedVideos.includes(videoId)) {
      setCompletedVideos((prev) => [...prev, videoId]);
    }
  };

  const handleEnded = () => {
    handleVideoComplete(selectedVideo.id);
    saveProgress(playerRef.current?.getDuration() || 0);

    const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id);
    const nextVideo = videos[currentIndex + 1];
    if (nextVideo) {
      setSelectedVideo(nextVideo);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-4 md:ml-64 mt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 sm:mb-6 w-full md:w-auto"
        >
          Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          {courseName}
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No videos available for this course.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {selectedVideo && (
                <div className="mb-6">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-300 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Progress: {progress}%
                    </p>
                  </div>

                  {/* Video player */}
                  <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/embed/${selectedVideo.id}?enablejsapi=1`}
                    controls
                    playing={false}
                    width="100%"
                    height="auto"
                    className="rounded-lg shadow-lg aspect-video"
                    onEnded={handleEnded}
                    onPause={() => {
                      const currentTime = playerRef.current?.getCurrentTime();
                      if (currentTime) saveProgress(currentTime);
                    }}
                  />
                  <h3 className="text-xl font-semibold mt-3">
                    {selectedVideo.title}
                  </h3>
                </div>
              )}
            </div>

            {/* Playlist */}
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="md:hidden bg-blue-500 text-white px-4 py-2 rounded w-full mb-3"
              >
                {showPlaylist ? "Hide Playlist" : "Show Playlist"}
              </button>

              <div className={`${showPlaylist ? "block" : "hidden"} md:block`}>
                <h3 className="text-lg font-semibold mb-2">Playlist</h3>
                <ul className="space-y-2">
                  {videos.map((video, index) => (
                    <li
                      key={video.id}
                      className={`cursor-pointer p-2 rounded transition-all duration-200 ${
                        selectedVideo?.id === video.id
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      {index + 1}. {video.title}
                      {completedVideos.includes(video.id) && (
                        <span className="text-green-600 font-semibold ml-2">
                          (Completed)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-4 h-10 rounded-md w-full ${
                  assessmentSubmitted
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : completedVideos.length === videos.length
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={
                  assessmentSubmitted ||
                  completedVideos.length !== videos.length
                }
                onClick={() => {
                  if (
                    !assessmentSubmitted &&
                    completedVideos.length === videos.length
                  ) {
                    navigate(`/assessment/${id}/${userEmail}`);
                  }
                }}
              >
                Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
