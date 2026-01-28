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
  FaClipboardList,
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
  status?: string;
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
    {},
  );

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
    newList: Omit<TodoList, "id" | "created_at">,
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/statuses/add/",
        { ...newList, status: "ONGOING" },
        { withCredentials: true },
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
          { withCredentials: true },
        );
        if (res.data.success) {
          const updatedListWithStatus = {
            ...res.data.status,
            tasks: editingList.tasks,
            status: getListStatus(editingList.tasks),
          };

          setTodoLists((prev) =>
            prev.map((list) =>
              list.id === editingList.id ? updatedListWithStatus : list,
            ),
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
          { withCredentials: true },
        );

        if (response.data.success) {
          const listsWithStatus = response.data.statuses.map(
            (list: TodoList) => ({
              ...list,
              status: getListStatus(list.tasks),
            }),
          );

          setTodoLists(
            listsWithStatus.sort(
              (a: TodoList, b: TodoList) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            ),
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
        { withCredentials: true },
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.filter((list) => list.id !== deleteTarget.id),
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
        { withCredentials: true },
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.map((list) => {
            if (list.id !== listId) return list;

            const updatedTasks = list.tasks?.map((task) =>
              task.id === taskId ?
                { ...task, completed: !task.completed }
              : task,
            );

            return {
              ...list,
              tasks: updatedTasks,
              status: getListStatus(updatedTasks),
            };
          }),
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: prev.tasks?.map((task) =>
                  task.id === taskId ?
                    { ...task, completed: !task.completed }
                  : task,
                ),
                status: getListStatus(
                  prev.tasks?.map((task) =>
                    task.id === taskId ?
                      { ...task, completed: !task.completed }
                    : task,
                  ),
                ),
              }
            : null,
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

    try {
      const res = await axios.post(
        `http://localhost:8000/api/tasks/add/${listId}/`,
        { label },
        { withCredentials: true },
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
            : list,
          ),
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: [...(prev.tasks ?? []), res.data.task],
                status: getListStatus([...(prev.tasks ?? []), res.data.task]),
              }
            : null,
          );
        }

        setNewTaskLabel((prev) => ({ ...prev, [listId]: "" }));
        showAlert("Task added successfully!", "success");
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      showAlert("Failed to add task. Try again.", "error");
    }
  };

  const deleteTask = async (listId: number, taskId: number) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/tasks/delete/${taskId}/`,
        { withCredentials: true },
      );

      if (res.data.success) {
        setTodoLists((prev) =>
          prev.map((list) =>
            list.id === listId ?
              {
                ...list,
                tasks: list.tasks?.filter((task) => task.id !== taskId),
                status: getListStatus(
                  list.tasks?.filter((task) => task.id !== taskId),
                ),
              }
            : list,
          ),
        );

        if (selectedList?.id === listId) {
          setSelectedList((prev) =>
            prev ?
              {
                ...prev,
                tasks: prev.tasks?.filter((task) => task.id !== taskId),
                status: getListStatus(
                  prev.tasks?.filter((task) => task.id !== taskId),
                ),
              }
            : null,
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
        { withCredentials: true },
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

  const totalLists = todoLists.length;
  const completedLists = todoLists.filter(
    (list) => list.status === "COMPLETED",
  ).length;
  const totalTasks = todoLists.reduce(
    (acc, list) => acc + (list.tasks?.length || 0),
    0,
  );
  const completedTasks = todoLists.reduce(
    (acc, list) => acc + (list.tasks?.filter((t) => t.completed).length || 0),
    0,
  );

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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
                <FaCheckSquare className="text-cyan-400" /> Todo Lists
              </h1>
              <p className="text-gray-300 text-lg">
                Track your tasks and stay organized
              </p>
            </div>
            <button
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-xl shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/60 overflow-hidden"
              onClick={openCreateModal}>
              <span className="relative z-10 flex items-center gap-2">
                <FaPlus /> New List
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg">
                  <FaClipboardList className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-purple-200 text-sm">
                    Total Lists
                  </h3>
                  <p className="text-3xl font-bold text-white">{totalLists}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-green-400/20 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg">
                  <FaCheckCircle className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-green-200 text-sm">
                    Completed Lists
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {completedLists}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-blue-400/20 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg">
                  <FaListUl className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-blue-200 text-sm">
                    Total Tasks
                  </h3>
                  <p className="text-3xl font-bold text-white">{totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-cyan-400/20 p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-teal-600 shadow-lg">
                  <FaCheckSquare className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-cyan-200 text-sm">
                    Tasks Done
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {completedTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Todo Lists Grid */}
        <section className="w-full max-w-7xl mx-auto">
          {todoLists.length === 0 ?
            <div className="p-12 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 shadow-xl">
              <div className="text-center">
                <FaCheckSquare className="text-6xl text-purple-300 mx-auto mb-4 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Todo Lists Yet
                </h3>
                <p className="text-gray-300 mb-6">
                  Create your first todo list to start organizing your tasks!
                </p>
                <button
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <FaPlus className="inline mr-2" /> Create Your First List
                </button>
              </div>
            </div>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todoLists.map((list) => {
                const stats = getTaskStats(list.tasks);
                const completionPercentage =
                  stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

                return (
                  <div
                    key={list.id}
                    className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 flex-1">
                        <FaListUl className="text-cyan-400" />
                        <span className="line-clamp-1">{list.title}</span>
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          list.status === "COMPLETED" ?
                            "bg-gradient-to-r from-green-600 to-emerald-600"
                          : "bg-gradient-to-r from-yellow-600 to-amber-600"
                        } text-white shadow-lg`}>
                        {list.status}
                      </span>
                    </div>

                    <p className="text-xs text-purple-300 mb-3">
                      {new Date(list.created_at).toLocaleDateString()}
                    </p>

                    {list.description && (
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                        {list.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    {stats.total > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-300 mb-2">
                          <span>
                            {stats.completed} / {stats.total} completed
                          </span>
                          <span className="text-cyan-400 font-semibold">
                            {Math.round(completionPercentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Task Preview */}
                    <div className="flex-1 space-y-1 mb-4 max-h-32 overflow-hidden">
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
                              task.completed ?
                                "line-through text-gray-400"
                              : "text-gray-200"
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
                          No tasks yet. Click open to add tasks.
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      <button
                        className="flex-1 p-2.5 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105 shadow-md flex items-center justify-center gap-2 text-sm font-medium"
                        onClick={() => openViewModal(list)}>
                        <FaEye /> Open
                      </button>
                      <button
                        className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 hover:scale-110 shadow-md"
                        onClick={() => handleEdit(list)}>
                        <FaEdit />
                      </button>
                      <button
                        className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 shadow-md"
                        onClick={() => {
                          setDeleteTarget(list);
                          setShowDeleteModal(true);
                        }}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </section>
      </main>

      {/* View Modal */}
      {showViewModal && selectedList && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70 p-4">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                <FaListUl className="text-cyan-400" /> {selectedList.title}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300">
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-6">
              <p className="text-sm text-purple-300">
                Created {new Date(selectedList.created_at).toLocaleDateString()}{" "}
                at {new Date(selectedList.created_at).toLocaleTimeString()}
              </p>

              {selectedList.description && (
                <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20">
                  <h3 className="text-sm font-semibold text-purple-300 mb-2">
                    Description
                  </h3>
                  <p className="text-white whitespace-pre-wrap">
                    {selectedList.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-white">
                  <FaCheckCircle className="text-cyan-400" /> Tasks
                </h3>
                <div className="space-y-2">
                  {(selectedList.tasks ?? []).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300 group">
                      <button
                        onClick={() => toggleTask(selectedList.id, task.id)}
                        className="flex-shrink-0">
                        {task.completed ?
                          <FaCheckCircle className="text-green-400 w-5 h-5" />
                        : <FaCircle className="text-gray-400 w-5 h-5" />}
                      </button>
                      <span
                        className={`flex-1 ${
                          task.completed ?
                            "line-through text-gray-400"
                          : "text-white"
                        }`}>
                        {task.label}
                      </span>
                      <button
                        onClick={() => deleteTask(selectedList.id, task.id)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300">
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-purple-400/20">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
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
                        newTaskLabel[selectedList.id].trim(),
                      );
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-xl hover:from-cyan-500 hover:to-teal-500 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                  onClick={() => {
                    if (newTaskLabel[selectedList.id]?.trim()) {
                      addTask(
                        selectedList.id,
                        newTaskLabel[selectedList.id].trim(),
                      );
                    }
                  }}>
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-purple-400/20 mt-4">
              <button
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl hover:from-yellow-400 hover:to-amber-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedList);
                }}>
                <FaEdit /> Edit List
              </button>
              <button
                className="px-5 py-2.5 bg-gray-600 rounded-xl hover:bg-gray-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70 p-4">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl w-full max-w-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              {editingList ?
                <>
                  <FaEdit className="text-yellow-400" /> Edit Todo List
                </>
              : <>
                  <FaPlus className="text-cyan-400" /> Create New Todo List
                </>
              }
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  List Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Work Tasks, Study Plan, Shopping List"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add more details about this list..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-none"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-600 rounded-xl hover:bg-gray-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5"
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
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                  {editingList ? "Update List" : "Create List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70 p-4">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 w-96 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
              <FaTrash className="text-red-400" /> Delete Todo List
            </h3>
            <p className="mb-2 text-center text-gray-300">
              Are you sure you want to delete{" "}
              <strong className="text-purple-200">
                "{deleteTarget.title}"
              </strong>
              ?
            </p>
            <p className="mb-6 text-center text-sm text-gray-400">
              This will permanently delete all {deleteTarget.tasks?.length || 0}{" "}
              tasks in this list.
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
                onClick={handleDeleteList}
                disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete List"}
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

export default Status;
