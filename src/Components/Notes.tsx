import axios from "axios";
import { useNavigate } from "react-router-dom";
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

      <main className="flex-1 flex flex-col p-10 ml-64 text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaStickyNote className="text-cyan-400" /> Notes
          </h1>
          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-md transition"
            onClick={handleAddNoteClick}
          >
            <FaPlus /> Add New Note
          </button>
        </div>

        <div className="w-full h-full">
          {notesBySubject.length === 0 ? (
            <div className="flex items-center justify-center text-purple-300">
              <p>No notes yet. Click "Add New Note" to create one!</p>
            </div>
          ) : (
            notesBySubject.map((subject) => (
              <div
                key={subject.subject_id}
                className="mb-6 p-4 bg-purple-900 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-semibold mb-3 border-b border-purple-700 pb-2 flex items-center gap-2">
                  <FaBook className="text-cyan-400" />
                  {subject.subject_name}
                </h2>

                {subject.notes.length === 0 ? (
                  <p className="text-purple-300 ml-2">
                    No notes for this subject.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {subject.notes
                      .slice()
                      .sort((a, b) => a.id - b.id)
                      .map((note) => (
                        <div
                          key={note.id}
                          className="bg-purple-800 p-4 rounded-lg shadow-md hover:bg-purple-700 transition flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="font-bold text-lg mb-2">
                              {note.title}
                            </h3>
                            <p className="text-purple-200 line-clamp-3 overflow-hidden text-ellipsis">
                              {note.content.length > 120
                                ? note.content.slice(0, 120) + "..."
                                : note.content}
                            </p>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-md transition"
                              onClick={() => setSelectedNote(note)}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition"
                              onClick={() => handleEditNote(note)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition"
                              onClick={() => setDeleteNoteId(note.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedNote && (
          <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-purple-800 p-8 rounded-xl w-10/12 max-w-3xl shadow-2xl relative border border-purple-700 flex flex-col max-h-[70vh]">
              <h2 className="text-2xl font-bold mb-5 border-b border-purple-700 pb-2 text-white">
                {selectedNote.title}
              </h2>

              <div className="text-gray-100 mb-6 overflow-y-auto px-4">
                <p className="whitespace-pre-wrap text-base">
                  {selectedNote.content}
                </p>
              </div>

              <div className="flex justify-end mt-auto">
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-5 py-2 rounded text-white text-base transition"
                  onClick={() => setSelectedNote(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {(showModal || editingNote) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-purple-800 p-8 rounded-xl w-10/12 max-w-3xl shadow-2xl relative border border-purple-700">
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 text-white">
              {editingNote ? (
                <>
                  <FaEdit className="text-yellow-400" /> Edit Note
                </>
              ) : (
                <>
                  <FaPlus className="text-cyan-400" /> Add New Note
                </>
              )}
            </h2>

            {/* Subject selector only for Add Note */}
            {!editingNote && subjects.length > 0 && (
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
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
                editingNote
                  ? setEditedTitle(e.target.value)
                  : setTitle(e.target.value)
              }
              className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
            />

            <textarea
              placeholder="Content"
              value={editingNote ? editedContent : content}
              onChange={(e) =>
                editingNote
                  ? setEditedContent(e.target.value)
                  : setContent(e.target.value)
              }
              className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
              rows={6}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  editingNote ? setEditingNote(null) : setShowModal(false);
                }}
                className="px-5 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white text-base"
              >
                Cancel
              </button>
              <button
                onClick={editingNote ? submitEdit : handleSaveNote}
                className="px-5 py-2 bg-cyan-500 rounded hover:bg-cyan-600 text-white text-base"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteNoteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950 text-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaTrash className="text-red-400" /> Confirm Delete
            </h2>
            <p className="mb-6">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteNoteId(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(deleteNoteId)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded shadow-lg z-50 ${
            alertType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default Notes;
