import {
  FaCheckSquare,
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
  FaTimes,
  FaCheckCircle,
  FaCircle,
  FaListUl,
} from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  label: string;
  completed: boolean;
}

interface TodoList {
  id: number;
  title: string;
  description: string;
  created_at: string;
  tasks?: Task[];
}

type AlertType = "success" | "error";

function Status() {
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<TodoList | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editingList, setEditingList] = useState<TodoList | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TodoList | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertType>("success");
  const location = useLocation();
  const [newTaskLabel, setNewTaskLabel] = useState<{ [key: number]: string }>(
    {}
  );
  const [inputValue, setInputValue] = useState("");

  const openViewModal = (list: TodoList) => {
    setSelectedList(list);
    setNewTaskLabel((prev) => ({ ...prev, [list.id]: "" }));
    setShowViewModal(true);
  };

  const openCreateModal = () => {
    setEditingList(null);
    setTitle("");
    setDescription("");
    setShowModal(true);
  };

  const menuItems = [
    { path: "/homepage", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/courses", label: "Courses", icon: <FaBook /> },
    { path: "/Notes", label: "Notes", icon: <FaStickyNote /> },
    { path: "/projects", label: "Projects", icon: <FaProjectDiagram /> },
    { path: "/profile", label: "Profile", icon: <FaUser /> },
    { path: "/guide", label: "Guide", icon: <FaInfoCircle /> },
    { path: "/status", label: "Status", icon: <FaCheckSquare /> },
  ];

  const showAlert = (message: string, type: AlertType) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const handleAddList = async (
    newList: Omit<TodoList, "id" | "created_at">
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/statuses/add/",
        { ...newList, status: "ONGOING" },
        { withCredentials: true }
      );
      if (res.data.success) {
        const newListWithStatus = {
          ...res.data.status,
          status: getListStatus(res.data.status.tasks),
        };
        setTodoLists((prev) => [...prev, newListWithStatus]);
        setShowModal(false);
        setTitle("");
        setDescription("");
        showAlert("Todo list created successfully!", "success");
      } else {
        showAlert(res.data.message, "error");
      }
    } catch (err) {
      console.error("Failed to add list:", err);
      showAlert("Failed to create todo list. Try again.", "error");
    }
  };

  const handleEdit = (item: TodoList) => {
    setEditingList(item);
    setTitle(item.title);
    setDescription(item.description);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingList) {
      try {
        const res = await axios.put(
          `http://localhost:8000/api/statuses/edit/${editingList.id}/`,
          { title, description, status: "ONGOING" },
          { withCredentials: true }
        );
        if (res.data.success) {
          const updatedListWithStatus = {
            ...res.data.status,
            tasks: editingList.tasks,
            status: getListStatus(editingList.tasks),
          };

          setTodoLists((prev) =>
            prev.map((list) =>
              list.id === editingList.id ? updatedListWithStatus : list
            )
          );

          if (selectedList?.id === editingList.id) {
            setSelectedList(updatedListWithStatus);
          }

          setShowModal(false);
          setEditingList(null);
          setTitle("");
          setDescription("");
          showAlert("Todo list updated successfully!", "success");
        } else {
          showAlert(res.data.message || "Failed to edit list.", "error");
        }
      } catch (err) {
        console.error("Failed to edit list:", err);
        showAlert("Failed to edit list. Try again.", "error");
      }
    } else {
      handleAddList({ title, description });
    }
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/statuses/",
          { withCredentials: true }
        );

        if (response.data.success) {
          const listsWithStatus = response.data.statuses.map(
            (list: TodoList) => ({
              ...list,
              status: getListStatus(list.tasks),
            })
          );

          setTodoLists(
            listsWithStatus.sort(
              (a: TodoList, b: TodoList) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch lists:", error);
      }
    };

    fetchLists();
  }, []);

  const handleDeleteList = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/statuses/delete/${deleteTarget.id}/`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.filter((list) => list.id !== deleteTarget.id)
        );
        setShowDeleteModal(false);
        setDeleteTarget(null);
        showAlert("Todo list deleted successfully!", "success");
      } else {
        showAlert(res.data.message || "Failed to delete list.", "error");
      }
    } catch (err) {
      console.error("Failed to delete list:", err);
      showAlert("Failed to delete list. Try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getListStatus = (tasks?: Task[]) => {
    if (!tasks || tasks.length === 0) return "ONGOING";
    return tasks.every((t) => t.completed) ? "COMPLETED" : "ONGOING";
  };

  const toggleTask = async (listId: number, taskId: number) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/tasks/toggle/${taskId}/`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.map((list) => {
            if (list.id !== listId) return list;

            const updatedTasks = list.tasks?.map((task) =>
              task.id === taskId ?
                { ...task, completed: !task.completed }
              : task
            );

            return {
              ...list,
              tasks: updatedTasks,
              status: getListStatus(updatedTasks),
            };
          })
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: prev.tasks?.map((task) =>
                  task.id === taskId ?
                    { ...task, completed: !task.completed }
                  : task
                ),
                status: getListStatus(
                  prev.tasks?.map((task) =>
                    task.id === taskId ?
                      { ...task, completed: !task.completed }
                    : task
                  )
                ),
              }
            : null
          );
        }
      }
    } catch (err) {
      console.error("Toggle task error:", err);
      showAlert("Failed to toggle task.", "error");
    }
  };

  const addTask = async (listId: number, label: string) => {
    if (!label.trim()) return;

    console.log("Adding task:", { listId, label });

    try {
      const res = await axios.post(
        `http://localhost:8000/api/tasks/add/${listId}/`,
        { label },
        { withCredentials: true }
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.map((list) =>
            list.id === listId ?
              {
                ...list,
                tasks: [...(list.tasks ?? []), res.data.task],
                status: getListStatus([...(list.tasks ?? []), res.data.task]),
              }
            : list
          )
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: [...(prev.tasks ?? []), res.data.task],
                status: getListStatus([...(prev.tasks ?? []), res.data.task]),
              }
            : null
          );
        }

        setNewTaskLabel((prev) => ({ ...prev, [listId]: "" }));
        showAlert("Task added successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      console.error("Error response:", err.response?.data);
      showAlert("Failed to add task. Try again.", "error");
    }
  };

  const deleteTask = async (listId: number, taskId: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/tasks/delete/${taskId}/`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.map((list) =>
            list.id === listId ?
              {
                ...list,
                tasks: list.tasks?.filter((task) => task.id !== taskId),
                status: getListStatus(
                  list.tasks?.filter((task) => task.id !== taskId)
                ),
              }
            : list
          )
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: prev.tasks?.filter((task) => task.id !== taskId),
                status: getListStatus(
                  prev.tasks?.filter((task) => task.id !== taskId)
                ),
              }
            : null
          );
        }

        showAlert("Task deleted successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      showAlert("Failed to delete task. Try again.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };

  const getTaskStats = (tasks?: Task[]) => {
    if (!tasks || tasks.length === 0) return { completed: 0, total: 0 };
    const completed = tasks.filter((t) => t.completed).length;
    return { completed, total: tasks.length };
  };

  const TaskListComponent = ({
    listId,
    tasks,
    showDelete = false,
  }: {
    listId: number;
    tasks?: Task[];
    showDelete?: boolean;
  }) => {
    const stats = getTaskStats(tasks);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
          <span>
            {stats.completed} / {stats.total} tasks completed
          </span>
          {stats.total > 0 && (
            <span className="text-cyan-400 font-semibold">
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {(tasks ?? []).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 bg-purple-700/50 p-2 rounded group hover:bg-purple-700 transition">
              <button
                onClick={() => toggleTask(listId, task.id)}
                className="flex-shrink-0">
                {task.completed ?
                  <FaCheckCircle className="text-green-400 w-5 h-5" />
                : <FaCircle className="text-gray-400 w-5 h-5" />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.completed ?
                    "line-through text-gray-400"
                  : "text-gray-100"
                }`}>
                {task.label}
              </span>
              {showDelete && (
                <button
                  onClick={() => deleteTask(listId, task.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300">
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.8);
        }
      `}</style>

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
                  location.pathname === item.path ?
                    "bg-purple-700 shadow-md"
                  : "hover:bg-purple-700"
                }`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 px-4 rounded bg-red-600 hover:bg-red-700 transition w-full">
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center p-6 ml-64 w-full">
        <div className="flex justify-between items-center w-full mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FaCheckSquare className="text-cyan-400" /> Status
          </h1>
          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
            onClick={openCreateModal}>
            <FaPlus /> New List
          </button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todoLists.map((list) => {
            const stats = getTaskStats(list.tasks);
            const completionPercentage =
              stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

            return (
              <div
                key={list.id}
                className="bg-purple-800 p-5 rounded-xl shadow-lg text-white flex flex-col hover:shadow-2xl transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <FaListUl className="text-cyan-400" /> {list.title}
                    </h2>

                    {/* Display status here */}
                    <span
                      className={`text-xs px-3 py-1 font-medium rounded ${
                        list.status === "COMPLETED" ?
                          "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                      }`}>
                      {list.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 mb-3">
                    Created {new Date(list.created_at).toLocaleDateString()}
                  </p>

                  {list.description && (
                    <p className="text-sm text-gray-200 line-clamp-2 mb-3">
                      {list.description}
                    </p>
                  )}

                  {stats.total > 0 && (
                    <div className="mb-3">
                      <div className="w-full bg-purple-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-green-400 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 mb-3 max-h-32 overflow-hidden">
                    {(list.tasks ?? []).slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 text-xs">
                        {task.completed ?
                          <FaCheckCircle className="text-green-400 w-3 h-3 flex-shrink-0" />
                        : <FaCircle className="text-gray-400 w-3 h-3 flex-shrink-0" />
                        }
                        <span
                          className={`truncate ${
                            task.completed ? "line-through text-gray-400" : ""
                          }`}>
                          {task.label}
                        </span>
                      </div>
                    ))}
                    {(list.tasks ?? []).length > 4 && (
                      <p className="text-xs text-cyan-400 italic font-medium">
                        +{(list.tasks ?? []).length - 4} more tasks
                      </p>
                    )}
                    {(list.tasks ?? []).length === 0 && (
                      <p className="text-xs text-gray-400 italic">
                        No tasks yet. Click view to add tasks.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-3 border-t border-purple-700">
                  <button
                    className="flex-1 p-2 bg-blue-500 rounded hover:bg-blue-600 text-white text-sm flex items-center justify-center gap-1 transition"
                    onClick={() => openViewModal(list)}
                    title="View & Manage Tasks">
                    <FaEye /> Open
                  </button>

                  <button
                    className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 text-white text-sm flex items-center justify-center transition"
                    onClick={() => handleEdit(list)}
                    title="Edit List">
                    <FaEdit />
                  </button>

                  <button
                    className="p-2 bg-red-500 rounded hover:bg-red-600 text-white text-sm flex items-center justify-center transition"
                    onClick={() => {
                      setDeleteTarget(list);
                      setShowDeleteModal(true);
                    }}
                    title="Delete List">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {todoLists.length === 0 && (
          <div className="text-center text-white mt-20">
            <FaCheckSquare className="text-6xl text-cyan-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Todo Lists Yet</h3>
            <p className="text-gray-300 mb-4">
              Create your first todo list to start organizing your tasks!
            </p>
            <button
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-lg transition flex items-center gap-2 mx-auto"
              onClick={() => setShowModal(true)}>
              <FaPlus /> Create Your First List
            </button>
          </div>
        )}
      </main>

      {showViewModal && selectedList && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-purple-900/95 p-8 rounded-xl w-full max-w-2xl shadow-2xl text-white backdrop-blur-lg border border-purple-700 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaListUl className="text-cyan-400" /> {selectedList.title}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white transition">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              <p className="text-xs text-gray-300 mb-4">
                Created {new Date(selectedList.created_at).toLocaleDateString()}{" "}
                at {new Date(selectedList.created_at).toLocaleTimeString()}
              </p>

              {selectedList.description && (
                <div className="p-4 bg-purple-800/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-100 whitespace-pre-wrap">
                    {selectedList.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-400" /> Tasks
                </h3>
                <TaskListComponent
                  listId={selectedList.id}
                  tasks={selectedList.tasks}
                  showDelete={true}
                />
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-purple-600">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 px-3 py-2 rounded bg-purple-700 text-white placeholder-gray-400 text-sm border border-purple-600 focus:border-cyan-400 focus:outline-none"
                  value={newTaskLabel[selectedList.id] || ""}
                  onChange={(e) =>
                    setNewTaskLabel((prev) => ({
                      ...prev,
                      [selectedList.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      newTaskLabel[selectedList.id]?.trim()
                    ) {
                      e.preventDefault();
                      addTask(
                        selectedList.id,
                        newTaskLabel[selectedList.id].trim()
                      );
                      setNewTaskLabel((prev) => ({
                        ...prev,
                        [selectedList.id]: "",
                      }));
                    }
                  }}
                />

                <button
                  type="button"
                  className="bg-cyan-500 px-4 py-2 rounded text-white hover:bg-cyan-600 transition text-sm font-medium"
                  onClick={() => {
                    if (newTaskLabel[selectedList.id]?.trim()) {
                      addTask(
                        selectedList.id,
                        newTaskLabel[selectedList.id].trim()
                      );
                      setNewTaskLabel((prev) => ({
                        ...prev,
                        [selectedList.id]: "",
                      }));
                    }
                  }}>
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-purple-700">
              <button
                className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition flex items-center gap-2"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedList);
                }}>
                <FaEdit /> Edit List
              </button>
              <button
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-purple-800 p-8 rounded-xl w-full max-w-2xl shadow-2xl relative border border-purple-700">
            <h2 className="text-2xl font-bold mb-5 text-white flex items-center gap-3">
              {editingList ?
                <>
                  <FaEdit className="text-yellow-400" /> Edit Todo List
                </>
              : <>
                  <FaPlus className="text-cyan-400" /> Create New Todo List
                </>
              }
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="List Title (e.g., 'Work Tasks', 'Coding Projects')"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white placeholder-gray-300 text-base focus:border-cyan-400 focus:outline-none"
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-purple-600 rounded bg-purple-700 text-white placeholder-gray-300 text-base focus:border-cyan-400 focus:outline-none"
                rows={4}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white text-base transition"
                  onClick={() => {
                    setShowModal(false);
                    setEditingList(null);
                    setTitle("");
                    setDescription("");
                  }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 rounded hover:bg-cyan-600 text-white text-base transition">
                  {editingList ? "Update List" : "Create List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 p-4">
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 w-full max-w-md text-white shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-center">
              Delete Todo List
            </h3>
            <p className="mb-6 text-center">
              Are you sure you want to delete{" "}
              <strong className="text-cyan-400">"{deleteTarget.title}"</strong>?
              <br />
              <span className="text-sm text-gray-300">
                This will permanently delete all{" "}
                {deleteTarget.tasks?.length || 0} tasks in this list.
              </span>
            </p>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-purple-300 text-purple-900 rounded hover:bg-purple-400 transition"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}>
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={handleDeleteList}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete List"}
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-white text-center pointer-events-auto ${
              alertType === "success" ? "bg-green-500" : "bg-red-500"
            }`}>
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Status;
