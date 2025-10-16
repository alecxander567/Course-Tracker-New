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
    { path: "/status", label: "Status", icon: <FaChartBar /> },
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <aside className="w-64 bg-purple-900 text-white flex flex-col justify-between p-6 shadow-lg fixed h-full">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Course Tracker
          </h2>
          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 py-2 px-4 rounded text-left transition ${
                  location.pathname === item.path
                    ? "bg-purple-700 shadow-md"
                    : "hover:bg-purple-700"
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
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

      <main className="flex-1 flex flex-col items-center p-6 ml-64 w-full">
        <div className="flex justify-between items-center mb-8 w-full">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <FaProjectDiagram className="text-cyan-400" /> Projects
          </h1>
          <button
            className="text-white flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md transition"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add New Project
          </button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-white text-lg">
              No projects yet. Create your first project!
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-purple-800 p-4 rounded shadow-lg text-white flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <FaProjectDiagram className="text-cyan-400" />{" "}
                    {project.title}
                  </h2>
                  <p className="text-sm mb-2">{project.description}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      project.status === "COMPLETED"
                        ? "bg-green-500"
                        : project.status === "IN_PROGRESS"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 text-white"
                    onClick={() => {
                      setEditProjectId(project.id);
                      setTitle(project.title);
                      setDescription(project.description);
                      setStatus(project.status);
                      setShowModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white text-sm"
                    onClick={() => {
                      setDeleteTarget(project);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-purple-800 p-8 rounded-xl w-10/12 max-w-3xl shadow-2xl relative border border-purple-700">
            <h2 className="text-2xl font-bold mb-5 text-white flex items-center gap-3">
              {editProjectId ? (
                <>
                  <FaEdit className="text-yellow-400" /> Edit Project
                </>
              ) : (
                <>
                  <FaPlusCircle className="text-cyan-400" /> Add New Project
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white placeholder-gray-300 text-base"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white placeholder-gray-300 text-base"
                rows={5}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white text-base"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white text-base"
                  onClick={() => {
                    setShowModal(false);
                    setEditProjectId(null);
                    setTitle("");
                    setDescription("");
                    setStatus("NOT_STARTED");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 rounded hover:bg-cyan-600 text-white text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 w-96 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
              <FaTrash className="text-red-400" /> Delete Project
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-purple-300 text-purple-900 rounded hover:bg-purple-400 transition"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded shadow-lg text-white z-50 text-center ${
            alertType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default Projects;
