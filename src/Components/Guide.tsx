import {
  FaBook,
  FaChartBar,
  FaProjectDiagram,
  FaSignOutAlt,
  FaStickyNote,
  FaTachometerAlt,
  FaUser,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type SubjectStatus = "Pending" | "Ongoing" | "Completed";
type SubjectPriority = "LOW" | "MODERATE" | "HIGH";

interface SubjectType {
  id: number;
  subject_name: string;
  status: SubjectStatus;
  category: string;
  priority: SubjectPriority;
}

function Guide() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get<{
          success: boolean;
          subjects: SubjectType[];
        }>("http://localhost:8000/api/subjects/", { withCredentials: true });

        if (res.data.success) {
          setSubjects(res.data.subjects);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

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

  const groupedSubjects: Record<SubjectPriority, SubjectType[]> = {
    HIGH: [],
    MODERATE: [],
    LOW: [],
  };
  subjects.forEach((subj) => {
    groupedSubjects[subj.priority].push(subj);
  });

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

      <main className="flex-1 flex flex-col items-center p-6 ml-64 w-full gap-6">
        {/* Header */}
        <div className="w-full mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaInfoCircle className="text-cyan-400" /> Guide
          </h1>
        </div>

        {["HIGH", "MODERATE", "LOW"].map((priority) => (
          <div key={priority} className="w-full">
            <h2 className="text-white text-2xl mb-4 font-semibold flex items-center gap-2">
              {priority === "HIGH" && <FaChartBar className="text-green-500" />}
              {priority === "MODERATE" && (
                <FaChartBar className="text-yellow-500" />
              )}
              {priority === "LOW" && <FaChartBar className="text-red-500" />}
              {priority} Priority Subjects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {groupedSubjects[priority as SubjectPriority].length === 0 ? (
                <p className="text-gray-300">No subjects in this category.</p>
              ) : (
                groupedSubjects[priority as SubjectPriority].map((subj) => (
                  <div
                    key={subj.id}
                    className="bg-purple-800 p-4 rounded shadow-lg text-white flex flex-col justify-between"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {subj.subject_name}
                    </h3>

                    <p className="text-sm mb-1 flex items-center gap-2">
                      <FaStickyNote className="text-cyan-400" /> Status:{" "}
                      {subj.status}
                    </p>

                    <p className="text-sm mb-2 flex items-center gap-2">
                      <FaBook className="text-yellow-400" /> Grade:{" "}
                      {subj.grade || "N/A"}
                    </p>

                    <span
                      className={`text-xs w-20 py-1 rounded-full font-medium text-center ${
                        subj.priority === "HIGH"
                          ? "bg-green-500"
                          : subj.priority === "MODERATE"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {subj.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Guide;
