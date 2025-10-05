import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaBook, FaStickyNote, FaChartBar, FaSignOutAlt } from "react-icons/fa";

function Homepage() {
    const navigate = useNavigate();

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

    return(
       <div className="min-h-screen flex bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <aside className="w-64 bg-purple-900 text-white flex flex-col justify-between p-6 shadow-lg">
        <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Course Tracker</h2>
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
        <header className="w-full bg-purple-800 text-white py-4 mb-6 rounded shadow-md">
          <h1 className="text-3xl font-bold text-center">Course Tracker</h1>
        </header>

        <section className="mb-6 text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Welcome Back!</h2>
          <p>
            Keep track of your courses, assignments, and progress easily.
          </p>
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