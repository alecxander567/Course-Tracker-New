import {
  FaBook,
  FaChartBar,
  FaProjectDiagram,
  FaSignOutAlt,
  FaStickyNote,
  FaTachometerAlt,
  FaUser,
  FaInfoCircle,
  FaCheckSquare,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

type SubjectStatus = "Pending" | "Ongoing" | "Completed";
type SubjectPriority = "LOW" | "MODERATE" | "HIGH";

interface SubjectType {
  id: number;
  subject_name: string;
  status: SubjectStatus;
  category: string;
  priority: SubjectPriority;
  grade?: string;
}

function Guide() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
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

  const getPriorityConfig = (priority: SubjectPriority) => {
    switch (priority) {
      case "HIGH":
        return {
          icon: <FaExclamationCircle />,
          color: "from-red-600/20 to-rose-600/20 border-red-400/30",
          iconBg: "from-red-600 to-rose-700",
          badgeBg: "bg-gradient-to-r from-red-600 to-rose-600",
          textColor: "text-red-200",
        };
      case "MODERATE":
        return {
          icon: <FaClock />,
          color: "from-yellow-600/20 to-amber-600/20 border-yellow-400/30",
          iconBg: "from-yellow-600 to-amber-600",
          badgeBg: "bg-gradient-to-r from-yellow-600 to-amber-600",
          textColor: "text-yellow-200",
        };
      case "LOW":
        return {
          icon: <FaCheckCircle />,
          color: "from-green-600/20 to-emerald-600/20 border-green-400/30",
          iconBg: "from-green-600 to-emerald-700",
          badgeBg: "bg-gradient-to-r from-green-600 to-emerald-600",
          textColor: "text-green-200",
        };
    }
  };

  const getStatusBadge = (status: SubjectStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border border-green-400/30";
      case "Ongoing":
        return "bg-blue-500/20 text-blue-300 border border-blue-400/30";
      case "Pending":
        return "bg-orange-500/20 text-orange-300 border border-orange-400/30";
    }
  };

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
      <main className="flex-1 flex flex-col p-8 ml-64 relative z-10">
        {/* Header Section */}
        <section className="mb-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
            <FaInfoCircle className="text-cyan-400" /> Priority Guide
          </h1>
          <p className="text-gray-300 text-lg">
            Organize your subjects by priority level
          </p>
        </section>

        {/* Priority Sections */}
        <section className="w-full max-w-7xl mx-auto space-y-8">
          {(["HIGH", "MODERATE", "LOW"] as SubjectPriority[]).map(
            (priority) => {
              const config = getPriorityConfig(priority);
              return (
                <div key={priority}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${config.iconBg} shadow-lg`}>
                      {config.icon}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${config.textColor}`}>
                        {priority} Priority
                      </h2>
                      <p className="text-gray-400 text-sm">
                        {groupedSubjects[priority].length} subject
                        {groupedSubjects[priority].length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedSubjects[priority].length === 0 ?
                      <div
                        className={`col-span-full p-8 rounded-2xl bg-gradient-to-br ${config.color} backdrop-blur-lg border`}>
                        <p className="text-gray-300 text-center">
                          No subjects in this priority category
                        </p>
                      </div>
                    : groupedSubjects[priority].map((subj) => (
                        <div
                          key={subj.id}
                          className={`group relative rounded-2xl bg-gradient-to-br ${config.color} backdrop-blur-lg border p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col`}>
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-white flex-1 pr-2">
                              {subj.subject_name}
                            </h3>
                            <div
                              className={`px-3 py-1 rounded-lg ${config.badgeBg} text-white text-xs font-bold shadow-lg`}>
                              {priority}
                            </div>
                          </div>

                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-white/10">
                                <FaBook className="text-cyan-400 text-sm" />
                              </div>
                              <span className="text-sm text-gray-300">
                                <span className="font-semibold text-white">
                                  Category:
                                </span>{" "}
                                {subj.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-white/10">
                                <FaStickyNote className="text-purple-400 text-sm" />
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-lg font-medium ${getStatusBadge(subj.status)}`}>
                                {subj.status}
                              </span>
                            </div>

                            {subj.grade && (
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-white/10">
                                  <FaChartBar className="text-yellow-400 text-sm" />
                                </div>
                                <span className="text-sm text-gray-300">
                                  <span className="font-semibold text-white">
                                    Grade:
                                  </span>{" "}
                                  {subj.grade}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              );
            },
          )}
        </section>

        {/* Summary Stats */}
        <section className="mt-8 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-lg border border-red-400/30 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg">
                  <FaExclamationCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-red-200 text-sm">
                    High Priority
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {groupedSubjects.HIGH.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-yellow-600/20 to-amber-600/20 backdrop-blur-lg border border-yellow-400/30 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-600 shadow-lg">
                  <FaClock className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-yellow-200 text-sm">
                    Moderate Priority
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {groupedSubjects.MODERATE.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg border border-green-400/30 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-green-200 text-sm">
                    Low Priority
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {groupedSubjects.LOW.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Guide;
