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
  FaCheckSquare,
} from "react-icons/fa";

import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  const menuItems = [
    { path: "/homepage", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/courses", label: "Courses", icon: <FaBook /> },
    { path: "/Notes", label: "Notes", icon: <FaStickyNote /> },
    { path: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
    { path: "/guide", label: "Guide", icon: <FaInfoCircle /> },
    { path: "/status", label: "Status", icon: <FaCheckSquare /> },
  ];

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
    <div className="min-h-screen flex bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border-r border-purple-500/20 text-white flex flex-col justify-between p-6 shadow-2xl fixed h-full z-20">
        <div>
          <div className="mb-8 text-center">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 mb-3">
              <FaBook className="text-3xl text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Course Tracker
            </h2>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-left transition-all duration-300 ${
                  location.pathname === item.path ?
                    "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105"
                  : "hover:bg-white/10 hover:translate-x-1"
                }`}>
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-300 w-full shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <FaSignOutAlt /> <span className="font-semibold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 relative z-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            <FaBook className="text-cyan-400" /> Courses
          </h1>
          <p className="text-gray-300 text-lg mt-2">
            Manage and track all your enrolled courses
          </p>
        </div>

        {loading ?
          <div className="text-center py-20">
            <div className="inline-block">
              <svg
                className="animate-spin h-12 w-12 text-purple-400"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-300 mt-4 text-lg">
                Loading your courses...
              </p>
            </div>
          </div>
        : subjects.length === 0 ?
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20">
              <FaBook className="text-6xl text-purple-400 mb-4 mx-auto" />
              <p className="text-gray-300 text-xl">No courses found</p>
              <p className="text-gray-400 mt-2">
                Start by adding your first course from the dashboard
              </p>
            </div>
          </div>
        : <>
            {Object.entries(
              subjects.reduce((acc, subj) => {
                if (!acc[subj.category]) acc[subj.category] = [];
                acc[subj.category].push(subj);
                return acc;
              }, {}),
            ).map(([category, subjectsInCategory]) => (
              <div key={category} className="mb-10">
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <FaLayerGroup className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {category}
                  </h2>
                </div>

                {/* Course Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjectsInCategory.map((subject) => (
                    <div
                      key={subject.id}
                      className="group relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40">
                      {/* Subject Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 shadow-md">
                            <FaBook className="text-white" />
                          </div>
                          {subject.subject_name}
                        </h3>
                        {subject.description && (
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {subject.description}
                          </p>
                        )}
                      </div>

                      {/* Subject Details */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <FaTags className="text-purple-400" />
                          <span className="font-semibold text-purple-200">
                            Category:
                          </span>
                          <span className="text-gray-300">
                            {subject.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <FaStar className="text-yellow-400" />
                          <span className="font-semibold text-purple-200">
                            Grade:
                          </span>
                          <span className="text-gray-300 font-bold">
                            {subject.grade ?? "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <FaCalendarAlt className="text-blue-400" />
                          <span className="font-semibold text-purple-200">
                            Semester:
                          </span>
                          <span className="text-gray-300">
                            {subject.semester}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <FaRegCalendarCheck className="text-green-400" />
                          <span className="font-semibold text-purple-200">
                            School Year:
                          </span>
                          <span className="text-gray-300">
                            {subject.school_year}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <FaCheckCircle
                            className={`${
                              subject.status === "Completed" ? "text-green-400"
                              : subject.status === "Pending" ? "text-yellow-400"
                              : subject.status === "Ongoing" ? "text-blue-400"
                              : "text-gray-400"
                            }`}
                          />
                          <span className="font-semibold text-purple-200">
                            Status:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold shadow-md ${
                              subject.status === "Completed" ?
                                "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                              : subject.status === "Pending" ?
                                "bg-gradient-to-r from-yellow-600 to-amber-600 text-white"
                              : subject.status === "Ongoing" ?
                                "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                              : "bg-gray-600 text-white"
                            }`}>
                            {subject.status}
                          </span>
                        </div>
                      </div>

                      {/* Decorative corner accent */}
                      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400/30 rounded-tr-lg group-hover:border-purple-300/60 transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        }
      </main>
    </div>
  );
}

export default Courses;
