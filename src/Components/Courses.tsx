import {
  FaBook,
  FaChartBar,
  FaSignOutAlt,
  FaStickyNote,
  FaTachometerAlt,
  FaTags,
  FaStar,
  FaCalendarAlt,
  FaRegCalendarCheck,
  FaCheckCircle,
  FaBookOpen,
  FaLayerGroup,
  FaUser,
  FaProjectDiagram,
  FaInfoCircle,
} from "react-icons/fa";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface GuideType {
  id: number;
  semester?: string | null;
  status: "ONGOING" | "COMPLETED";
  category: "LOW" | "MODERATE" | "HIGH";
  date: string;
  notes?: string | null;
}

interface SubjectType {
  id: number;
  subject_name: string;
  category: string;
  status: "Pending" | "Ongoing" | "Completed";
  grade?: string | null;
  semester?: string | null;
  school_year?: string | null;
  guides: GuideType[];
}

function Courses() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true },
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          subjects: SubjectType[];
        }>("http://localhost:8000/api/subjects/", { withCredentials: true });

        if (response.data.success) {
          setSubjects(response.data.subjects);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <aside className="w-64 bg-purple-900 text-white flex flex-col justify-between p-6 shadow-lg fixed h-full">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Course Tracker
          </h2>
          <nav className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/homepage")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaTachometerAlt /> Dashboard
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaBook /> Courses
            </button>
            <button
              onClick={() => navigate("/Notes")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaStickyNote /> Notes
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaProjectDiagram /> Projects
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaUser /> Profile
            </button>

            {/* 🆕 Added Guide Menu */}
            <button
              onClick={() => navigate("/guide")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaInfoCircle /> Guide
            </button>

            <button
              onClick={() => navigate("/status")}
              className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left"
            >
              <FaChartBar /> Status
            </button>
          </nav>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition w-full"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 ml-64">
        <div className="bg-purple-900 p-6 rounded-2xl shadow-xl mb-6 flex items-center justify-start">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-purple-200">
            <FaBookOpen className="text-cyan-400" /> Your Courses
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-200">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="text-center text-gray-300">No subjects found.</p>
        ) : (
          <>
            {Object.entries(
              subjects.reduce((acc, subj) => {
                if (!acc[subj.category]) acc[subj.category] = [];
                acc[subj.category].push(subj);
                return acc;
              }, {}),
            ).map(([category, subjectsInCategory]) => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-purple-200">
                  <FaLayerGroup className="text-cyan-400" /> {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectsInCategory.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-purple-950 p-6 rounded-2xl shadow-lg border border-purple-700 hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-cyan-400">
                        <FaBook /> {subject.subject_name}
                      </h3>

                      <p className="text-gray-300 mb-3">
                        {subject.description}
                      </p>

                      <div className="text-sm space-y-2 text-gray-400">
                        <p className="flex items-center gap-2">
                          <FaTags className="text-purple-400" />
                          <span className="font-semibold text-purple-300">
                            Category:
                          </span>{" "}
                          {subject.category}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold text-purple-300">
                            Grade:
                          </span>{" "}
                          {subject.grade ?? "N/A"}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-400" />
                          <span className="font-semibold text-purple-300">
                            Semester:
                          </span>{" "}
                          {subject.semester}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaRegCalendarCheck className="text-green-400" />
                          <span className="font-semibold text-purple-300">
                            School Year:
                          </span>{" "}
                          {subject.school_year}
                        </p>

                        <p className="flex items-center gap-2">
                          <FaCheckCircle
                            className={`${
                              subject.status === "Completed"
                                ? "text-green-400"
                                : subject.status === "Pending"
                                  ? "text-yellow-400"
                                  : subject.status === "Ongoing"
                                    ? "text-red-400"
                                    : "text-gray-400"
                            }`}
                          />
                          <span className="font-semibold text-purple-300">
                            Status:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-sm font-semibold
      ${
        subject.status === "Completed"
          ? "bg-green-700 text-white"
          : subject.status === "Pending"
            ? "bg-yellow-600 text-black"
            : subject.status === "Ongoing"
              ? "bg-red-700 text-white"
              : "bg-gray-600 text-white"
      }`}
                          >
                            {subject.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default Courses;
