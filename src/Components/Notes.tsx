import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStickyNote,
  FaChartBar,
  FaSignOutAlt,
  FaBook,
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaProjectDiagram,
  FaInfoCircle,
  FaCheckSquare,
} from "react-icons/fa";
import { useEffect, useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface SubjectNotes {
  subject_id: number;
  subject_name: string;
  notes: Note[];
}

interface Subject {
  id: number;
  subject_name: string;
}

function Notes() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [notesBySubject, setNotesBySubject] = useState<SubjectNotes[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredSubjects = notesBySubject.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteNote = async (noteId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/notes/delete/${noteId}/`, {
        withCredentials: true,
      });

      setNotesBySubject((prev) =>
        prev.map((subject) => ({
          ...subject,
          notes: subject.notes.filter((note) => note.id !== noteId),
        })),
      );

      setDeleteNoteId(null);

      setAlertMessage("Note deleted successfully!");
      setAlertType("success");
      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error("Failed to delete note:", err);
      setAlertMessage("Failed to delete note. Try again.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const submitEdit = async () => {
    if (!editingNote) return;
    try {
      await axios.patch(
        `http://localhost:8000/api/notes/edit/${editingNote.id}/`,
        { title: editedTitle, content: editedContent },
        { withCredentials: true },
      );

      setEditingNote(null);
      setAlertMessage("Note edited successfully!");
      setAlertType("success");

      setTimeout(() => setAlertMessage(null), 3000);
    } catch (err) {
      console.error("Failed to edit note:", err);
      setAlertMessage("Failed to edit note. Try again.");
      setAlertType("error");

      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/notes/fetch/", {
          withCredentials: true,
        });
        setNotesBySubject(res.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };

    fetchNotes();

    const interval = setInterval(fetchNotes, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/subjects/", {
          withCredentials: true,
        });

        const subjectsData = res.data?.subjects || res.data || [];

        setSubjects(subjectsData);

        if (subjectsData.length > 0) {
          setSelectedSubjectId(subjectsData[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  const handleAddNoteClick = () => {
    if (subjects.length === 0) {
      setAlertMessage("Please add a subject first before creating notes.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    setShowModal(true);
  };

  const handleSaveNote = async () => {
    if (!title.trim()) {
      setAlertMessage("Please enter a title.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (!content.trim()) {
      setAlertMessage("Please enter content.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    if (!selectedSubjectId) {
      setAlertMessage("Please select a subject.");
      setAlertType("error");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/notes/",
        { title, content, subject: selectedSubjectId },
        { withCredentials: true },
      );
      setAlertMessage("Note added successfully!");
      setAlertType("success");
      setTitle("");
      setContent("");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to add note. Try again.");
      setAlertType("error");
    }

    setTimeout(() => setAlertMessage(null), 3000);
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
      <main className="flex-1 flex flex-col p-8 ml-64 text-white relative z-10">
        {/* Page Title & Actions */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
                <FaStickyNote className="text-cyan-400" /> Notes
              </h1>
              <p className="text-gray-300 text-lg">
                Organize your study notes by subject
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 w-64"
              />
              <button
                className="group relative flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-semibold shadow-xl shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/60 overflow-hidden"
                onClick={handleAddNoteClick}>
                <span className="relative z-10 flex items-center gap-2">
                  <FaPlus /> Add New Note
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Content */}
        <div className="w-full h-full">
          {notesBySubject.length === 0 ?
            <div className="flex items-center justify-center py-20">
              <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20">
                <FaStickyNote className="text-6xl text-purple-400 mb-4 mx-auto" />
                <p className="text-gray-300 text-xl">No notes yet</p>
                <p className="text-gray-400 mt-2">
                  Click "Add New Note" to create your first note!
                </p>
              </div>
            </div>
          : filteredSubjects.map((subject) => (
              <div
                key={subject.subject_id}
                className="mb-8 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold mb-5 pb-3 border-b border-purple-400/30 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-md">
                    <FaBook className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {subject.subject_name}
                  </span>
                </h2>

                {subject.notes.length === 0 ?
                  <p className="text-gray-400 ml-2 italic">
                    No notes for this subject yet.
                  </p>
                : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    {subject.notes
                      .slice()
                      .sort((a, b) => a.id - b.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-lg mb-3 text-white">
                              {note.title}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-4 leading-relaxed">
                              {note.content.length > 150 ?
                                note.content.slice(0, 150) + "..."
                              : note.content}
                            </p>
                          </div>

                          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-purple-400/20">
                            <button
                              className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 hover:scale-110 shadow-md"
                              onClick={() => setSelectedNote(note)}
                              title="View Note">
                              <FaEye />
                            </button>
                            <button
                              className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-600 to-amber-600 text-white hover:from-yellow-500 hover:to-amber-500 transition-all duration-300 hover:scale-110 shadow-md"
                              onClick={() => handleEditNote(note)}
                              title="Edit Note">
                              <FaEdit />
                            </button>
                            <button
                              className="p-2.5 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 transition-all duration-300 hover:scale-110 shadow-md"
                              onClick={() => setDeleteNoteId(note.id)}
                              title="Delete Note">
                              <FaTrash />
                            </button>
                          </div>

                          {/* Decorative corner accent */}
                          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-purple-400/30 rounded-tr-lg group-hover:border-purple-300/60 transition-colors duration-300"></div>
                        </div>
                      ))}
                  </div>
                }
              </div>
            ))
          }
        </div>

        {/* View Note Modal */}
        {selectedNote && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/70 flex justify-center items-center z-50">
            <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-10 rounded-3xl w-10/12 max-w-3xl shadow-2xl relative flex flex-col max-h-[80vh]">
              <h2 className="text-3xl font-bold mb-6 pb-4 border-b border-purple-400/30 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                {selectedNote.title}
              </h2>

              <div className="text-gray-200 mb-6 overflow-y-auto px-4 flex-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
                <p className="whitespace-pre-wrap text-base leading-relaxed">
                  {selectedNote.content}
                </p>
              </div>

              <div className="flex justify-end mt-auto pt-4">
                <button
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                  onClick={() => setSelectedNote(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Note Modal */}
      {(showModal || editingNote) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-10 rounded-3xl w-10/12 max-w-3xl shadow-2xl relative">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              {editingNote ?
                <>
                  <FaEdit className="text-yellow-400" /> Edit Note
                </>
              : <>
                  <FaPlus className="text-cyan-400" /> Add New Note
                </>
              }
            </h2>

            {/* Subject selector only for Add Note */}
            {!editingNote && subjects.length > 0 && (
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full mb-5 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300">
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-purple-900">
                    {sub.subject_name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Title"
              value={editingNote ? editedTitle : title}
              onChange={(e) =>
                editingNote ?
                  setEditedTitle(e.target.value)
                : setTitle(e.target.value)
              }
              className="w-full mb-5 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            />

            <textarea
              placeholder="Content"
              value={editingNote ? editedContent : content}
              onChange={(e) =>
                editingNote ?
                  setEditedContent(e.target.value)
                : setContent(e.target.value)
              }
              className="w-full mb-6 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-none"
              rows={8}
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  editingNote ? setEditingNote(null) : setShowModal(false);
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl hover:from-gray-500 hover:to-gray-600 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
                Cancel
              </button>
              <button
                onClick={editingNote ? submitEdit : handleSaveNote}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteNoteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
          <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 w-96 text-white shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FaTrash className="text-red-400" /> Confirm Delete
            </h2>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteNoteId(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 font-semibold">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(deleteNoteId)}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 transition-all duration-300 shadow-lg font-semibold">
                Delete
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
                "bg-gradient-to-r from-green-600 to-emerald-600"
              : "bg-gradient-to-r from-red-600 to-rose-600"
            }`}>
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
