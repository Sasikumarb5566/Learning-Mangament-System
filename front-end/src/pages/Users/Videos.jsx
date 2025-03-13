import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player"; // Import React Player
import NavBar from "../../components/NavBar";
import { getCourseVideos } from "../../services/Users/UserServices"; // Fetch course videos

const Videos = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(true); // Toggle playlist for mobile

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // 🔹 Replace this with YouTube playlist videos
        const youtubePlaylist = [
          { id: "QFaFIcGhPoM", title: "React Tutorial #1" },
          { id: "Ke90Tje7VS0", title: "React Tutorial #2" },
          { id: "0riHps91AzE", title: "React Tutorial #3" },
        ];

        setVideos(youtubePlaylist);
        setSelectedVideo(youtubePlaylist[0]); // Default to first video
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex-1 p-4 md:ml-64 mt-4 ">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
          Django Web Development
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-center">
            No videos available for this course.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="md:col-span-2">
              {selectedVideo && (
                <div className="mb-6">
                  <div className="w-full max-w-full">
                    <ReactPlayer
                      url={`https://www.youtube.com/embed/${selectedVideo.id}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&iv_load_policy=3&fs=0`}
                      controls
                      width="100%"
                      height="auto"
                      className="rounded-lg shadow-lg aspect-video"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mt-3">
                    {selectedVideo.title}
                  </h3>
                </div>
              )}
            </div>

            {/* Playlist Section */}
            <div className="bg-white p-4 shadow-lg rounded-lg">
              {/* Toggle Button for Mobile */}
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="md:hidden bg-blue-500 text-white px-4 py-2 rounded w-full mb-3"
              >
                {showPlaylist ? "Hide Playlist" : "Show Playlist"}
              </button>

              {/* Playlist Items (Visible only when showPlaylist is true on mobile) */}
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
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Videos;
