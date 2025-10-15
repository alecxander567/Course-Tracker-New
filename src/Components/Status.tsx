import {
  FaChartBar,
  FaPlus,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBook,
  FaStickyNote,
  FaProjectDiagram,
  FaUser,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface StatusItem {
  id: number;
  title: string;
  description: string;
  status: "ONGOING" | "COMPLETED";
  created_at: string;
}

type AlertType = "success" | "error";

function Status() {
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<StatusItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"ONGOING" | "COMPLETED">("ONGOING");
  const [editingStatus, setEditingStatus] = useState<StatusItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StatusItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>("success");

  const handleAddStatus = async (
    newStatus: Omit<StatusItem, "id" | "created_at">,
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/statuses/add/",
        newStatus,
        { withCredentials: true },
      );
      if (res.data.success) {
        setStatuses((prev) => [...prev, res.data.status]);
        setShowModal(false);
        setTitle("");
        setDescription("");
        setStatus("ONGOING");

        setAlertMessage("Status added successfully!");
        setAlertType("success");
        setTimeout(() => setAlertMessage(""), 3000);
      } else {
        setAlertMessage(res.data.message);
        setAlertType("error");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to add status:", err);
      setAlertMessage("Failed to add status. Try again.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleEdit = (item: StatusItem) => {
    setEditingStatus(item);
    setTitle(item.title);
    setDescription(item.description);
    setStatus(item.status);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStatus) {
      try {
        const res = await axios.put(
          `http://localhost:8000/api/statuses/edit/${editingStatus.id}/`,
          { title, description, status },
          { withCredentials: true },
        );

        if (res.data.success) {
          setStatuses((prev) =>
            prev.map((s) => (s.id === editingStatus.id ? res.data.status : s)),
          );

          setShowModal(false);
          setEditingStatus(null);
          setTitle("");
          setDescription("");
          setStatus("ONGOING");

          setAlertMessage("Status updated successfully!");
          setAlertType("success");
          setTimeout(() => setAlertMessage(""), 3000);
        } else {
          setAlertMessage(res.data.message || "Failed to edit status.");
          setAlertType("error");
          setTimeout(() => setAlertMessage(""), 3000);
        }
      } catch (err) {
        console.error("Failed to edit status:", err);
        setAlertMessage("Failed to edit status. Try again.");
        setAlertType("error");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } else {
      handleAddStatus({ title, description, status });
    }
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/statuses/",
          { withCredentials: true },
        );

        if (response.data.success) {
          setStatuses(
            response.data.statuses.sort(
              (a: StatusItem, b: StatusItem) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            ),
          );
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  const handleDeleteStatus = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/statuses/delete/${deleteTarget.id}/`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setStatuses((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setShowDeleteModal(false);
        setDeleteTarget(null);
        setAlertMessage("Status deleted successfully!");
        setAlertType("success");
        setTimeout(() => setAlertMessage(""), 3000);
      } else {
        setAlertMessage(res.data.message || "Failed to delete status.");
        setAlertType("error");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to delete status:", err);
      setAlertMessage("Failed to delete status. Try again.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    } finally {
      setIsDeleting(false);
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

      <main className="flex-1 flex flex-col items-center p-6 ml-64 w-full">
        <div className="flex justify-between items-center w-full mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaChartBar className="text-cyan-400" /> Status
          </h1>
          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Add New Status
          </button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((item) => (
            <div
              key={item.id}
              className="bg-purple-800 p-5 rounded-xl shadow-lg text-white flex flex-col justify-between h-72"
            >
              <div className="mb-3">
                <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <FaInfoCircle className="text-cyan-400" /> {item.title}
                </h2>
                <p className="text-xs text-gray-300 mb-2">
                  {new Date(item.created_at).toLocaleDateString()}{" "}
                  {new Date(item.created_at).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-200 line-clamp-4">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span
                  className={`text-xs px-3 py-1 font-medium rounded ${
                    item.status === "COMPLETED"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex gap-2">
                  <button
                    className="p-2 bg-blue-500 rounded hover:bg-blue-600 text-white text-sm flex items-center justify-center"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowViewModal(true);
                    }}
                    title="View"
                  >
                    <FaEye />
                  </button>

                  <button
                    className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 text-white text-sm flex items-center justify-center"
                    onClick={() => handleEdit(item)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="p-2 bg-red-500 rounded hover:bg-red-600 text-white text-sm flex items-center justify-center"
                    onClick={() => {
                      setDeleteTarget(item);
                      setShowDeleteModal(true);
                    }}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showViewModal && selectedItem && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-purple-900/80 p-8 rounded-xl w-11/12 md:w-1/2 shadow-2xl text-white backdrop-blur-lg border border-purple-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-cyan-400" /> {selectedItem.title}
            </h2>

            <p className="text-xs text-gray-300 mb-4">
              {new Date(selectedItem.created_at).toLocaleDateString()}{" "}
              {new Date(selectedItem.created_at).toLocaleTimeString()}
            </p>

            <p className="text-gray-100 mb-6 whitespace-pre-wrap">
              {selectedItem.description}
            </p>

            <div className="flex justify-end">
              <button
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-purple-800 p-8 rounded-xl w-10/12 max-w-3xl shadow-2xl relative border border-purple-700">
            <h2 className="text-2xl font-bold mb-5 text-white flex items-center gap-3">
              {editingStatus ? (
                <>
                  <FaEdit className="text-yellow-400" /> Edit Status
                </>
              ) : (
                <>
                  <FaPlus className="text-cyan-400" /> Add New Status
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Status Title"
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
                onChange={(e) =>
                  setStatus(e.target.value as "ONGOING" | "COMPLETED")
                }
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white text-base"
              >
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white text-base"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStatus(null);
                    setTitle("");
                    setDescription("");
                    setStatus("ONGOING");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 rounded hover:bg-cyan-600 text-white text-base"
                >
                  {editingStatus ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 w-96 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center">
              Delete Status
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
                onClick={handleDeleteStatus}
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
          className={`fixed inset-0 flex items-center justify-center z-50 transition-all`}
        >
          <div
            className={`px-6 py-4 rounded shadow-lg text-white text-center 
        ${alertType === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Status;
