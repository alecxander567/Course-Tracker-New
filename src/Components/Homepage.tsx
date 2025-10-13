import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStickyNote,
  FaChartBar,
  FaSignOutAlt,
  FaCheckCircle,
  FaPlayCircle,
  FaHourglassHalf,
  FaBook,
  FaEdit,
  FaTrash,
  FaUser,
  FaProjectDiagram,
  FaPlus,
} from "react-icons/fa";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Subject {
  id: number;
  name: string;
  description?: string;
  grade?: string;
  semester?: string;
  schoolYear?: string;
  status?: string;
}

const STATIC_CATEGORIES = [
  "Programming",
  "Database",
  "Networking",
  "Security",
  "Electives",
];

function Homepage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [newSubjectDetails, setNewSubjectDetails] = useState({
    category: "Programming",
    name: "",
    description: "",
    grade: "",
    semester: "",
    schoolYear: "",
    status: "Pending",
  });
  const [subjects, setSubjects] = useState<Record<string, Subject[]>>({
    Programming: [],
    Database: [],
    Networking: [],
    Security: [],
    Electives: [],
  });
  const [editingSubject, setEditingSubject] = useState<null | {
    id: number;
    category: string;
    name: string;
    description: string;
    grade: string;
    semester: string;
    schoolYear: string;
    status: "Pending" | "Ongoing" | "Completed";
  }>(null);

  const openEditSubjectModal = (category: string, subject: Subject) => {
    setEditingSubject({
      id: subject.id,
      category,
      name: subject.name,
      description: subject.description || "",
      grade: subject.grade ? String(subject.grade) : "",
      semester: subject.semester || "",
      schoolYear: subject.schoolYear || "",
      status:
        (subject.status as "Pending" | "Ongoing" | "Completed") || "Pending",
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [totalCourses, setTotalCourses] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [ongoing, setOngoing] = useState(0);
  const [pending, setPending] = useState(0);
  const [careerData, setCareerData] = useState([]);
  const [careerRecommendation, setCareerRecommendation] = useState<string>("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/career_recommendation/",
          { withCredentials: true },
        );
        setCareerRecommendation(response.data.recommended_career);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    };

    fetchRecommendation();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/career_recommendation/",
          { withCredentials: true },
        );

        const formattedData = Object.entries(
          response.data.category_average_grades,
        ).map(([category, avgGrade]) => ({
          career: category,
          courses: avgGrade,
        }));

        setCareerData(formattedData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/current_user/",
          { withCredentials: true },
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };
    fetchUser();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/", {
        withCredentials: true,
      });

      const grouped: Record<string, Subject[]> = {
        Programming: [],
        Database: [],
        Networking: [],
        Security: [],
        Electives: [],
      };

      data.forEach((subj: any) => {
        if (grouped[subj.category]) {
          grouped[subj.category].push({
            id: subj.id,
            name: subj.subject_name,
            description: subj.description,
            grade: subj.grade,
            semester: subj.semester,
            schoolYear: subj.school_year,
            status: subj.status,
          });
        }
      });

      const totalCount = data.length;
      const completedCount = data.filter(
        (s: any) => s.status === "Completed",
      ).length;
      const ongoingCount = data.filter(
        (s: any) => s.status === "Ongoing",
      ).length;
      const pendingCount = data.filter(
        (s: any) => s.status === "Pending",
      ).length;

      setSubjects(grouped);
      setTotalCourses(totalCount);
      setCompleted(completedCount);
      setOngoing(ongoingCount);
      setPending(pendingCount);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    const interval = setInterval(fetchSubjects, 5000);
    return () => clearInterval(interval);
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

  const handleSaveSubject = async () => {
    if (!newSubjectDetails.name.trim()) {
      setAlert({ message: "Subject name is required", type: "error" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    try {
      const payload = {
        category: newSubjectDetails.category,
        subject_name: newSubjectDetails.name,
        description: newSubjectDetails.description,
        grade: newSubjectDetails.grade
          ? parseFloat(newSubjectDetails.grade)
          : null,
        semester: newSubjectDetails.semester,
        school_year: newSubjectDetails.schoolYear,
        status: newSubjectDetails.status,
      };

      const response = await axios.post(
        "http://localhost:8000/api/subjects/add/",
        payload,
        { withCredentials: true },
      );

      setSubjects((prev) => ({
        ...prev,
        [newSubjectDetails.category]: [
          ...(prev[newSubjectDetails.category] || []),
          {
            id: response.data.subject.id,
            name: newSubjectDetails.name,
            description: newSubjectDetails.description,
            grade: newSubjectDetails.grade,
            semester: newSubjectDetails.semester,
            schoolYear: newSubjectDetails.schoolYear,
          },
        ],
      }));

      setNewSubjectDetails({
        category: "Programming",
        name: "",
        description: "",
        grade: "",
        semester: "",
        schoolYear: "",
        status: "Pending",
      });
      setShowModal(false);

      setAlert({ message: "Subject added successfully!", type: "success" });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error(error);
      setAlert({ message: "Failed to add subject.", type: "error" });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleSaveEditedSubject = async () => {
    if (!editingSubject) return;

    try {
      const payload = {
        subject_name: editingSubject.name,
        description: editingSubject.description,
        grade: editingSubject.grade ? parseFloat(editingSubject.grade) : null,
        semester: editingSubject.semester,
        school_year: editingSubject.schoolYear,
        category: editingSubject.category,
        status: editingSubject.status,
      };

      const { data: updatedSubject } = await axios.patch(
        `http://localhost:8000/api/subjects/edit/${editingSubject.id}/`,
        payload,
      );

      setSubjects((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((cat) => {
          updated[cat] = updated[cat].filter((s) => s.id !== updatedSubject.id);
        });

        if (!updated[updatedSubject.category])
          updated[updatedSubject.category] = [];

        updated[updatedSubject.category].push({
          id: updatedSubject.id,
          name: updatedSubject.subject_name,
          description: updatedSubject.description,
          grade: updatedSubject.grade,
          semester: updatedSubject.semester,
          schoolYear: updatedSubject.school_year,
          status: updatedSubject.status,
        });

        return updated;
      });

      setEditingSubject(null);
      setAlert({ message: "Subject updated successfully!", type: "success" });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      console.error(error);
      setAlert({ message: "Failed to update subject.", type: "error" });
      setTimeout(() => setAlert(null), 3000);
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

      <main className="flex-1 flex flex-col items-center p-6 ml-64">
        <header className="w-full bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white py-10 mb-6 rounded-2xl shadow-md text-center flex flex-col items-center justify-center">
          <div className="flex gap-4 mb-4">
            <BookOpen size={36} className="text-white drop-shadow-md" />
            <ClipboardList size={36} className="text-white drop-shadow-md" />
            <GraduationCap size={36} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">
            Course Tracker
          </h1>
          <p className="text-base max-w-xl mx-auto text-gray-200">
            Keep track of your courses, assignments, and progress — all in one
            place.
          </p>
        </header>

        <section className="mb-6 w-full text-left text-white max-w-6xl">
          <h2 className="text-xl font-semibold mb-2">
            Welcome Back{username ? `, ${username}` : ""}!
          </h2>
          <p>Keep track of your courses, assignments, and progress easily.</p>
        </section>

        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-purple-600 p-4 rounded shadow hover:shadow-lg transition flex items-center gap-3">
            <FaBook className="text-purple-900 text-3xl" />
            <div>
              <h3 className="font-bold mb-1 text-white">Total Courses</h3>
              <p className="text-2xl text-white">{totalCourses}</p>
            </div>
          </div>
          <div className="bg-blue-500 p-4 rounded shadow hover:shadow-lg transition flex items-center gap-3">
            <FaCheckCircle className="text-white text-3xl" />
            <div>
              <h3 className="font-bold mb-1 text-white">Completed</h3>
              <p className="text-2xl text-white">{completed}</p>
            </div>
          </div>
          <div className="bg-red-400 p-4 rounded shadow hover:shadow-lg transition flex items-center gap-3">
            <FaPlayCircle className="text-red-700 text-3xl" />
            <div>
              <h3 className="font-bold mb-1 text-white">Ongoing</h3>
              <p className="text-2xl text-white">{ongoing}</p>
            </div>
          </div>
          <div className="bg-orange-500 p-4 rounded shadow hover:shadow-lg transition flex items-center gap-3">
            <FaHourglassHalf className="text-yellow-900 text-3xl" />
            <div>
              <h3 className="font-bold mb-1 text-white">Pending</h3>
              <p className="text-2xl text-white">{pending}</p>
            </div>
          </div>
        </section>

        <section className="mb-6 mt-5 w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Career Options Analysis
          </h2>
          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={careerData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="career" tick={{ fill: "#fff", fontSize: 14 }} />
                <YAxis tick={{ fill: "#fff", fontSize: 14 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F766E",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar
                  dataKey="courses"
                  fill="url(#barGradient)"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            {careerRecommendation && (
              <div className="mt-6 p-5 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-xl border border-purple-600/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold mb-2 text-purple-200 uppercase tracking-wider">
                      Recommended Career Path
                    </h3>
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">
                      {careerRecommendation}
                    </p>
                    <p className="mt-2 text-xs text-purple-300">
                      Based on your performance across all categories
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6 w-full max-w-6xl">
          <h2 className="text-xl font-semibold mb-4 text-white">My Subjects</h2>
          <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grid-flow-dense">
              {STATIC_CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="relative p-4 rounded-lg bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 shadow hover:shadow-lg transition flex flex-col h-70"
                >
                  <h3 className="font-bold mb-2 text-center">{category}</h3>
                  <ul className="list-disc list-inside mb-2 flex-1 overflow-auto max-h-40 pr-2">
                    {subjects[category]?.length > 0 ? (
                      subjects[category].map((subj) => (
                        <li
                          key={subj.id}
                          className="flex justify-between items-center mb-1"
                        >
                          <span>{subj.name}</span>
                          <div className="flex gap-1">
                            <button
                              className="p-1 rounded bg-white text-purple-700 hover:bg-purple-700 hover:text-white transition"
                              onClick={() =>
                                openEditSubjectModal(category, subj)
                              }
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="p-1 rounded bg-purple-700 text-white hover:bg-white hover:text-purple-700 border border-white transition"
                              onClick={() => {
                                setDeleteTarget({
                                  id: subj.id,
                                  category,
                                  name: subj.name,
                                });
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-300 italic text-center">
                        No subjects yet
                      </li>
                    )}
                  </ul>

                  <button
                    className="absolute bottom-4 left-4 right-4 bg-white text-black px-2 py-1 rounded hover:bg-gray-200 transition"
                    onClick={() => setShowModal(true)}
                  >
                    + Add Subject
                  </button>
                </div>
              ))}

              {STATIC_CATEGORIES.length % 2 !== 0 && (
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 shadow flex flex-col h-70">
                  <h3 className="font-bold mb-2 text-center">Calendar</h3>
                  <div className="flex-1">
                    <div className="w-full h-full bg-purple-800/50 rounded-lg p-2 flex flex-col">
                      {(() => {
                        const today = new Date();
                        const month = today.toLocaleString("default", {
                          month: "long",
                        });
                        const year = today.getFullYear();
                        const firstDay = new Date(
                          year,
                          today.getMonth(),
                          1,
                        ).getDay();
                        const totalDays = new Date(
                          year,
                          today.getMonth() + 1,
                          0,
                        ).getDate();

                        const calendarDays: (number | null)[] =
                          Array(firstDay).fill(null);
                        for (let i = 1; i <= totalDays; i++)
                          calendarDays.push(i);

                        const days = [
                          "Sun",
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                        ];

                        return (
                          <>
                            <div className="text-center font-bold mb-2 text-white">
                              {month} {year}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-xs text-center text-white/80">
                              {days.map((d) => (
                                <div key={d} className="font-semibold">
                                  {d}
                                </div>
                              ))}
                              {calendarDays.map((day, index) => {
                                const isToday =
                                  day === today.getDate() &&
                                  today.getMonth() === new Date().getMonth();
                                return (
                                  <div
                                    key={index}
                                    className={`p-1 rounded h-6 flex items-center justify-center ${
                                      day
                                        ? isToday
                                          ? "bg-purple-300 text-purple-900 font-bold"
                                          : "hover:bg-purple-700 transition"
                                        : ""
                                    }`}
                                  >
                                    {day || ""}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(showModal || editingSubject) && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
              <div className="bg-purple-800 p-8 rounded-xl w-10/12 max-w-3xl shadow-2xl relative border border-purple-700">
                <h2 className="text-2xl font-bold mb-5 flex items-center gap-3 text-white">
                  {editingSubject ? (
                    <>
                      <FaEdit className="text-yellow-400" /> Edit Subject
                    </>
                  ) : (
                    <>
                      <FaPlus className="text-cyan-400" /> Add New Subject
                    </>
                  )}
                </h2>

                {/* Category select only for Add Subject */}
                {!editingSubject && (
                  <select
                    className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                    value={newSubjectDetails.category}
                    onChange={(e) =>
                      setNewSubjectDetails((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    {STATIC_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  placeholder="Subject Name"
                  value={
                    editingSubject
                      ? editingSubject.name
                      : newSubjectDetails.name
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          name: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          name: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                />

                <textarea
                  placeholder="Description"
                  value={
                    editingSubject
                      ? editingSubject.description
                      : newSubjectDetails.description
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          description: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          description: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                  rows={5}
                />

                <input
                  type="text"
                  placeholder="Grade"
                  value={
                    editingSubject
                      ? editingSubject.grade
                      : newSubjectDetails.grade
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          grade: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          grade: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                />

                <input
                  type="text"
                  placeholder="Semester"
                  value={
                    editingSubject
                      ? editingSubject.semester
                      : newSubjectDetails.semester
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          semester: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          semester: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                />

                <input
                  type="text"
                  placeholder="School Year"
                  value={
                    editingSubject
                      ? editingSubject.schoolYear
                      : newSubjectDetails.schoolYear
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          schoolYear: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          schoolYear: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                />

                <select
                  value={
                    editingSubject
                      ? editingSubject.status
                      : newSubjectDetails.status
                  }
                  onChange={(e) =>
                    editingSubject
                      ? setEditingSubject({
                          ...editingSubject,
                          status: e.target.value,
                        })
                      : setNewSubjectDetails({
                          ...newSubjectDetails,
                          status: e.target.value,
                        })
                  }
                  className="w-full mb-4 px-4 py-3 rounded bg-purple-700 text-white border border-purple-600 text-base"
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() =>
                      editingSubject
                        ? setEditingSubject(null)
                        : setShowModal(false)
                    }
                    className="px-5 py-2 bg-gray-500 rounded hover:bg-gray-600 text-white text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={
                      editingSubject
                        ? handleSaveEditedSubject
                        : handleSaveSubject
                    }
                    className="px-5 py-2 bg-cyan-500 rounded hover:bg-cyan-600 text-white text-base"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && deleteTarget && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
              <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-xl p-6 w-96 text-white shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2">
                  <FaTrash className="text-red-400" /> Delete Subject
                </h3>
                <p className="mb-6 text-center">
                  Are you sure you want to delete{" "}
                  <strong>{deleteTarget.name}</strong>?
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
                    onClick={async () => {
                      try {
                        await axios.post(
                          `http://localhost:8000/delete-subject/${deleteTarget.id}/`,
                        );

                        setSubjects((prev) => ({
                          ...prev,
                          [deleteTarget.category]: prev[
                            deleteTarget.category
                          ].filter((s) => s.id !== deleteTarget.id),
                        }));

                        setShowDeleteModal(false);
                        setDeleteTarget(null);

                        setAlertMessage("Subject deleted successfully!");
                        setShowAlert(true);
                        setTimeout(() => setShowAlert(false), 3000);
                      } catch (err) {
                        console.error("Failed to delete subject:", err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {alert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg text-white text-lg transform transition-all duration-300 ${
              alert.type === "success"
                ? "bg-green-500 scale-100"
                : "bg-red-500 scale-100"
            }`}
          >
            {alert.message}
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg transition">
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
