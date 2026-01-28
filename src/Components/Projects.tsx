import {
  FaBook,
  FaChartBar,
  FaProjectDiagram,
  FaSignOutAlt,
  FaStickyNote,
  FaTachometerAlt,
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlusCircle,
  FaInfoCircle,
  FaCheckSquare,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlayCircle,
} from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { type FormEvent, useEffect, useState } from "react";

type ProjectType = {
  id: number;
  title: string;
  description: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  created_at: string;
  updated_at: string;
};

function Projects() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
  >("NOT_STARTED");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setShowDeleteModal(false);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/projects/delete/${deleteTarget.id}/`,
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setAlertMessage("Project deleted successfully!");
        setAlertType("success");
      } else {
        setAlertMessage(response.data.message || "Failed to delete project.");
        setAlertType("error");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
      setAlertMessage("Failed to delete project. Try again.");
      setAlertType("error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/projects/", {
        withCredentials: true,
      });

      if (response.data.success && response.data.projects) {
        const sortedProjects = response.data.projects.sort(
          (a: ProjectType, b: ProjectType) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

        setProjects(sortedProjects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let response;
      if (editProjectId) {
        response = await axios.post(
          `http://localhost:8000/api/projects/edit/${editProjectId}/`,
          { title, description, status },
          { withCredentials: true },
        );
        setAlertMessage("Project updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:8000/api/add_project/",
          { title, description, status },
          { withCredentials: true },
        );
        setAlertMessage("Project added successfully!");
      }

      setAlertType("success");
      setShowModal(false);
      setTitle("");
      setDescription("");
      setStatus("NOT_STARTED");
      setEditProjectId(null);

      fetchProjects();

      setTimeout(() => setAlertMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save project:", error);
      setAlertMessage("Failed to save project. Try again.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <FaCheckCircle className="text-green-400" />;
      case "IN_PROGRESS":
        return <FaPlayCircle className="text-blue-400" />;
      default:
        return <FaHourglassHalf className="text-orange-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "from-green-600/20 to-emerald-600/20 border-green-400/30";
      case "IN_PROGRESS":
        return "from-blue-600/20 to-cyan-600/20 border-blue-400/30";
      default:
        return "from-orange-600/20 to-amber-600/20 border-orange-400/30";
    }
  };

  const notStartedCount = projects.filter(
    (p) => p.status === "NOT_STARTED",
  ).length;
  const inProgressCount = projects.filter(
    (p) => p.status === "IN_PROGRESS",
  ).length;
  const completedCount = projects.filter(
    (p) => p.status === "COMPLETED",
  ).length;

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
      <main className="flex-1 flex flex-col items-center p-8 ml-64 relative z-10">
        {/* Header Section */}
        <section className="mb-8 w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
                <FaProjectDiagram className="text-cyan-400" /> Projects
              </h1>
              <p className="text-gray-300 text-lg">
                Manage and track your projects efficiently
              </p>
            </div>
            <button
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-xl shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/60 overflow-hidden"
              onClick={() => setShowModal(true)}>
              <span className="relative z-10 flex items-center gap-2">
                <FaPlus /> Add New Project
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-orange-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/30 hover:border-orange-400/40">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg">
                  <FaHourglassHalf className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-orange-200 text-sm">
                    Not Started
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {notStartedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-blue-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-blue-400/40">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                  <FaPlayCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-blue-200 text-sm">
                    In Progress
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {inProgressCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-green-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/30 hover:border-green-400/40">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-green-200 text-sm">
                    Completed
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {completedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ?
              <div className="col-span-full p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 shadow-xl">
                <div className="text-center">
                  <FaProjectDiagram className="text-6xl text-purple-300 mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Create your first project to get started!
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <FaPlus className="inline mr-2" /> Create Project
                  </button>
                </div>
              </div>
            : projects.map((project) => (
                <div
                  key={project.id}
                  className={`group relative rounded-2xl bg-gradient-to-br ${getStatusColor(project.status)} backdrop-blur-lg border p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col`}>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <h2 className="text-xl font-bold text-white">
                          {project.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {project.description || "No description provided"}
                    </p>

                    <div className="inline-block px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                      <span className="text-xs font-semibold text-white">
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                    <button
                      className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 hover:scale-110 shadow-md"
                      onClick={() => {
                        setEditProjectId(project.id);
                        setTitle(project.title);
                        setDescription(project.description);
                        setStatus(project.status);
                        setShowModal(true);
                      }}>
                      <FaEdit size={16} />
                    </button>
                    <button
                      className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-md"
                      onClick={() => {
                        setDeleteTarget(project);
                        setShowDeleteModal(true);
                      }}>
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </section>
      </main>

      {/* Add/Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl w-11/12 max-w-2xl shadow-2xl relative">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              {editProjectId ?
                <>
                  <FaEdit className="text-yellow-400" /> Edit Project
                </>
              : <>
                  <FaPlusCircle className="text-cyan-400" /> Add New Project
                </>
              }
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-none"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300">
                  <option value="NOT_STARTED" className="bg-purple-900">
                    Not Started
                  </option>
                  <option value="IN_PROGRESS" className="bg-purple-900">
                    In Progress
                  </option>
                  <option value="COMPLETED" className="bg-purple-900">
                    Completed
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditProjectId(null);
                    setTitle("");
                    setDescription("");
                    setStatus("NOT_STARTED");
                  }}
                  className="px-6 py-3 bg-gray-600 rounded-xl hover:bg-gray-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                  {editProjectId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 w-96 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
              <FaTrash className="text-red-400" /> Delete Project
            </h3>
            <p className="mb-6 text-center text-gray-300">
              Are you sure you want to delete{" "}
              <strong className="text-purple-200">{deleteTarget.title}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 font-semibold"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}>
                Cancel
              </button>

              <button
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteProject}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {alertMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-8 py-4 rounded-2xl shadow-2xl text-white text-lg font-semibold transform transition-all duration-300 ${
              alertType === "success" ?
                "bg-gradient-to-r from-green-600 to-emerald-600 scale-100"
              : "bg-gradient-to-r from-red-600 to-rose-600 scale-100"
            }`}>
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
