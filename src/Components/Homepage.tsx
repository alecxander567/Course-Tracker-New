import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaStickyNote,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

function Homepage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/1/"); // replace 1 with dynamic ID if needed
        setUsername(response.data.username);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUser();
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <aside className="w-64 bg-purple-900 text-white flex flex-col justify-between p-6 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Course Tracker
          </h2>
          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left">
              <FaTachometerAlt /> Dashboard
            </button>
            <button className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left">
              <FaBook /> Courses
            </button>
            <button className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left">
              <FaStickyNote /> Notes
            </button>
            <button className="flex items-center gap-2 py-2 px-4 rounded hover:bg-purple-700 transition text-left">
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

      <main className="flex-1 flex flex-col items-center p-6">
        <header className="w-full bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white py-10 mb-6 rounded-b-2xl rounded-t-2xl shadow-md text-center flex flex-col items-center justify-center">
          {/* Icons Row */}
          <div className="flex gap-4 mb-4">
            <BookOpen size={36} className="text-white drop-shadow-md" />
            <ClipboardList size={36} className="text-white drop-shadow-md" />
            <GraduationCap size={36} className="text-white drop-shadow-md" />
          </div>

          {/* Title and Subtitle */}
          <h1 className="text-4xl font-extrabold mb-2 drop-shadow-md">
            Course Tracker
          </h1>
          <p className="text-base max-w-xl mx-auto text-gray-200">
            Keep track of your courses, assignments, and progress — all in one
            place.
          </p>
        </header>

        <section className="mb-6 w-full text-left text-white">
          <h2 className="text-xl font-semibold mb-2">
            Welcome Back{username ? `, ${username}` : ""}!
          </h2>
          <p>Keep track of your courses, assignments, and progress easily.</p>
        </section>

        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Total Courses</h3>
            <p className="text-2xl text-purple-700">5</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Completed</h3>
            <p className="text-2xl text-green-600">2</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h3 className="font-bold mb-2">Pending</h3>
            <p className="text-2xl text-red-600">3</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Homepage;
