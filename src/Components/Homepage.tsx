import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStickyNote,
  FaCheckSquare,
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
  FaInfoCircle,
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

type Subject = {
  id?: number;
  category:
    | "Programming"
    | "Database"
    | "Networking"
    | "Security"
    | "Electives";
  name: string;
  description: string;
  grade: string;
  semester: string;
  schoolYear: string;
  status: "Pending" | "Ongoing" | "Completed";
  priority: "LOW" | "MODERATE" | "HIGH";
};

type SubjectDetails = {
  category: Subject["category"];
  name: string;
  description: string;
  grade: string;
  semester: string;
  schoolYear: string;
  status: "Pending" | "Ongoing" | "Completed";
  priority: "LOW" | "MODERATE" | "HIGH";
};

type SubjectStatus = "Pending" | "Ongoing" | "Completed";
type SubjectPriority = "LOW" | "MODERATE" | "HIGH";

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
  const [newSubjectDetails, setNewSubjectDetails] = useState<SubjectDetails>({
    category: "Programming",
    name: "",
    description: "",
    grade: "",
    semester: "",
    schoolYear: "",
    status: "Pending",
    priority: "MODERATE",
  });

  const [subjects, setSubjects] = useState<Record<string, Subject[]>>({
    Programming: [],
    Database: [],
    Networking: [],
    Security: [],
    Electives: [],
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const openEditSubjectModal = (category: string, subject: Subject) => {
    setEditingSubject({
      id: subject.id,
      category: category as Subject["category"],
      name: subject.name,
      description: subject.description || "",
      grade: subject.grade || "",
      semester: subject.semester || "",
      schoolYear: subject.schoolYear || "",
      status: subject.status || "Pending",
      priority: subject.priority || "MODERATE",
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

      data.subjects.forEach((subj: any) => {
        if (grouped[subj.category]) {
          grouped[subj.category].push({
            id: subj.id,
            category: subj.category,
            name: subj.subject_name,
            description: subj.description,
            grade: subj.grade,
            semester: subj.semester,
            schoolYear: subj.school_year,
            status: subj.status,
            priority: subj.priority,
          });
        }
      });

      const totalCount = data.subjects.length;
      const completedCount = data.subjects.filter(
        (s: any) => s.status === "Completed",
      ).length;
      const ongoingCount = data.subjects.filter(
        (s: any) => s.status === "Ongoing",
      ).length;
      const pendingCount = data.subjects.filter(
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
        grade:
          newSubjectDetails.grade ? parseFloat(newSubjectDetails.grade) : null,
        semester: newSubjectDetails.semester,
        school_year: newSubjectDetails.schoolYear,
        status: newSubjectDetails.status,
        priority: newSubjectDetails.priority,
      };

      const response = await axios.post(
        "http://localhost:8000/api/subjects/add/",
        payload,
        { withCredentials: true },
      );

      const newSubj: Subject = {
        id: response.data.subject.id,
        category: response.data.subject.category,
        name: response.data.subject.subject_name,
        description: response.data.subject.description,
        grade: response.data.subject.grade ?? "",
        semester: response.data.subject.semester ?? "",
        schoolYear: response.data.subject.school_year ?? "",
        status: response.data.subject.status,
        priority: response.data.subject.priority,
      };

      setSubjects((prev) => {
        const updated = { ...prev };
        if (!updated[newSubj.category]) updated[newSubj.category] = [];
        updated[newSubj.category].push(newSubj);
        return updated;
      });

      setNewSubjectDetails({
        ...newSubjectDetails,
        name: "",
        description: "",
        grade: "",
        semester: "",
        schoolYear: "",
        status: "Pending",
        priority: "MODERATE",
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
        priority: editingSubject.priority,
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
          category: updatedSubject.category,
          name: updatedSubject.subject_name,
          description: updatedSubject.description,
          grade: updatedSubject.grade ?? "",
          semester: updatedSubject.semester,
          schoolYear: updatedSubject.school_year,
          status: updatedSubject.status,
          priority: updatedSubject.priority,
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
      <main className="flex-1 flex flex-col items-center p-8 ml-64 relative z-10">
        {/* Welcome Section */}
        <section className="mb-8 w-full text-left text-white max-w-6xl">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
            Welcome Back{username ? `, ${username}` : ""}!
          </h2>
          <p className="text-gray-300 text-lg">
            Keep track of your courses, assignments, and progress with ease.
          </p>
        </section>

        {/* Stats Cards */}
        <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-400/40">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg">
                <FaBook className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-purple-200 text-sm">
                  Total Courses
                </h3>
                <p className="text-3xl font-bold text-white">{totalCourses}</p>
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
                <p className="text-3xl font-bold text-white">{completed}</p>
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
                  Ongoing
                </h3>
                <p className="text-3xl font-bold text-white">{ongoing}</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-orange-400/20 p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/30 hover:border-orange-400/40">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg">
                <FaHourglassHalf className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-orange-200 text-sm">
                  Pending
                </h3>
                <p className="text-3xl font-bold text-white">{pending}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Analysis Chart */}
        <section className="mb-8 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Career Options Analysis
          </h2>
          <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={careerData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#e5e7eb"
                  strokeDasharray="3 3"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="career"
                  tick={{ fill: "#e9d5ff", fontSize: 14 }}
                />
                <YAxis tick={{ fill: "#e9d5ff", fontSize: 14 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(88, 28, 135, 0.95)",
                    backdropFilter: "blur(12px)",
                    borderRadius: 12,
                    border: "1px solid rgba(168, 85, 247, 0.3)",
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
              <div className="mt-6 p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold mb-2 text-purple-300 uppercase tracking-wider">
                      Recommended Career Path
                    </h3>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
                      {careerRecommendation}
                    </p>
                    <p className="mt-2 text-sm text-purple-300">
                      Based on your performance across all categories
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                      <GraduationCap className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Subjects Section */}
        <section className="mb-6 w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-4 text-white">My Subjects</h2>
          <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20">
            <div className="flex justify-end mb-6">
              <button
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-xl shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/60 overflow-hidden"
                onClick={() => setShowModal(true)}>
                <span className="relative z-10 flex items-center gap-2">
                  <FaPlus /> Add New Subject
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grid-flow-dense">
              {STATIC_CATEGORIES.map((category) => (
                <div
                  key={category}
                  className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-80">
                  <h3 className="font-bold text-xl mb-4 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {category}
                  </h3>
                  <ul className="space-y-2 flex-1 overflow-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-900/20">
                    {subjects[category]?.length > 0 ?
                      subjects[category].map((subj) => (
                        <li
                          key={subj.id}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-purple-400/10">
                          <span className="text-white font-medium">
                            {subj.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-all duration-300 hover:scale-110 shadow-md"
                              onClick={() =>
                                openEditSubjectModal(category, subj)
                              }>
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-all duration-300 hover:scale-110 shadow-md"
                              onClick={() => {
                                setDeleteTarget({
                                  id: subj.id,
                                  category,
                                  name: subj.name,
                                });
                                setShowDeleteModal(true);
                              }}>
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </li>
                      ))
                    : <li className="text-gray-400 italic text-center py-8">
                        No subjects yet
                      </li>
                    }
                  </ul>
                </div>
              ))}

              {/* Calendar Widget */}
              {STATIC_CATEGORIES.length % 2 !== 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 shadow-xl flex flex-col h-80">
                  <h3 className="font-bold text-xl mb-4 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Calendar
                  </h3>
                  <div className="flex-1">
                    <div className="w-full h-full bg-white/5 rounded-xl p-3 flex flex-col border border-purple-400/10">
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
                            <div className="text-center font-bold mb-3 text-white text-lg">
                              {month} {year}
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-xs text-center text-white">
                              {days.map((d) => (
                                <div
                                  key={d}
                                  className="font-semibold text-purple-300 mb-1">
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
                                    className={`p-1.5 rounded-lg h-7 flex items-center justify-center transition-all duration-200 ${
                                      day ?
                                        isToday ?
                                          "bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-lg"
                                        : "hover:bg-white/10 cursor-pointer"
                                      : ""
                                    }`}>
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

          {/* Add/Edit Subject Modal */}
          {(showModal || editingSubject) && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
              <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 p-8 rounded-3xl w-11/12 max-w-4xl shadow-2xl relative">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {editingSubject ?
                    <>
                      <FaEdit className="text-yellow-400" /> Edit Subject
                    </>
                  : <>
                      <FaPlus className="text-cyan-400" /> Add New Subject
                    </>
                  }
                </h2>

                {/* Two Column Grid Layout */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <select
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                      value={
                        editingSubject ?
                          editingSubject.category
                        : newSubjectDetails.category
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            category: e.target.value as Subject["category"],
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            category: e.target.value as Subject["category"],
                          })
                      }>
                      {STATIC_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-purple-900">
                          {cat}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Subject Name"
                      value={
                        editingSubject ?
                          editingSubject.name
                        : newSubjectDetails.name
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            name: e.target.value,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            name: e.target.value,
                          })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                    />

                    <input
                      type="text"
                      placeholder="Grade"
                      value={
                        editingSubject ?
                          editingSubject.grade
                        : newSubjectDetails.grade
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            grade: e.target.value,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            grade: e.target.value,
                          })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                    />

                    <input
                      type="text"
                      placeholder="Semester (e.g., 1st Semester)"
                      value={
                        editingSubject ?
                          editingSubject.semester
                        : newSubjectDetails.semester
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            semester: e.target.value,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            semester: e.target.value,
                          })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                    />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <textarea
                      placeholder="Description"
                      value={
                        editingSubject ?
                          editingSubject.description
                        : newSubjectDetails.description
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            description: e.target.value,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            description: e.target.value,
                          })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-none"
                      rows={6}
                    />

                    <input
                      type="text"
                      placeholder="School Year (e.g., 2025–2026)"
                      value={
                        editingSubject ?
                          editingSubject.schoolYear
                        : newSubjectDetails.schoolYear
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            schoolYear: e.target.value,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            schoolYear: e.target.value,
                          })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                    />

                    <select
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                      value={
                        editingSubject ?
                          editingSubject.status
                        : newSubjectDetails.status
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            status: e.target.value as SubjectStatus,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            status: e.target.value as SubjectStatus,
                          })
                      }>
                      <option value="Pending" className="bg-purple-900">
                        Pending
                      </option>
                      <option value="Ongoing" className="bg-purple-900">
                        Ongoing
                      </option>
                      <option value="Completed" className="bg-purple-900">
                        Completed
                      </option>
                    </select>

                    <select
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                      value={
                        editingSubject ?
                          editingSubject.priority
                        : newSubjectDetails.priority
                      }
                      onChange={(e) =>
                        editingSubject ?
                          setEditingSubject({
                            ...editingSubject,
                            priority: e.target.value as SubjectPriority,
                          })
                        : setNewSubjectDetails({
                            ...newSubjectDetails,
                            priority: e.target.value as SubjectPriority,
                          })
                      }>
                      <option value="HIGH" className="bg-purple-900">
                        HIGH
                      </option>
                      <option value="MODERATE" className="bg-purple-900">
                        MODERATE
                      </option>
                      <option value="LOW" className="bg-purple-900">
                        LOW
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() =>
                      editingSubject ?
                        setEditingSubject(null)
                      : setShowModal(false)
                    }
                    className="px-6 py-3 bg-gray-600 rounded-xl hover:bg-gray-500 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5">
                    Cancel
                  </button>
                  <button
                    onClick={
                      editingSubject ?
                        handleSaveEditedSubject
                      : handleSaveSubject
                    }
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && deleteTarget && (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/70">
              <div className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 w-96 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                  <FaTrash className="text-red-400" /> Delete Subject
                </h3>
                <p className="mb-6 text-center text-gray-300">
                  Are you sure you want to delete{" "}
                  <strong className="text-purple-200">
                    {deleteTarget.name}
                  </strong>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-5 py-2.5 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 font-semibold"
                    onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg font-semibold"
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
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Alert Notifications */}
      {alert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-8 py-4 rounded-2xl shadow-2xl text-white text-lg font-semibold transform transition-all duration-300 ${
              alert.type === "success" ?
                "bg-gradient-to-r from-green-600 to-emerald-600 scale-100"
              : "bg-gradient-to-r from-red-600 to-rose-600 scale-100"
            }`}>
            {alert.message}
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold">
            {alertMessage}
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
