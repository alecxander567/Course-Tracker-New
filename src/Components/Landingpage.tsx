import React, { useState } from "react";
import { FaBook, FaStickyNote, FaProjectDiagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Logged in user:", data);

      navigate("/homepage");

      setUsername("");
      setPassword("");
      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-purple-900 rounded-xl p-10 w-96 md:w-[28rem] text-white shadow-2xl relative">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">Log in</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold shadow-lg transition-all duration-300 text-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullname,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(JSON.stringify(errData));
        setLoading(false);
        return;
      }

      const data = await response.json();
        console.log("Registered user:", data);

        setLoading(false);
        setSuccess(true); 
        setUsername("");
        setEmail("");
        setFullname("");
        setPassword("");

        setTimeout(() => {
          setSuccess(false);
          onClose();
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-purple-900 rounded-xl p-10 w-96 md:w-[28rem] text-white shadow-2xl relative">
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">Register</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {success && (
          <div className="bg-green-600 text-white p-3 rounded mb-4 text-center">
            Successfully registered!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-5 py-3 rounded bg-purple-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold shadow-lg transition-all duration-300 text-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};


function Landingpage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 text-white">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
          <FaBook className="text-purple-400 animate-pulse" />
          Course Tracker
          <FaProjectDiagram className="text-purple-400 animate-pulse" />
        </h1>
        <p className="text-lg text-gray-300 flex items-center justify-center gap-4 mt-2">
          <FaStickyNote className="text-purple-400" />
          Keep track of your subjects, notes, and projects in one place.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        <button
          className="px-8 py-3 bg-purple-900 hover:bg-purple-700 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsLoginOpen(true)}
        >
          Log in
        </button>
        <button
          className="px-8 py-3 border border-purple-400 hover:bg-purple-900 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsRegisterOpen(true)}
        >
          Register
        </button>
      </div>

      <section className="mt-20 max-w-5xl w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-purple-800/50 p-6 rounded-xl text-center flex flex-col items-center gap-4">
          <FaBook className="text-purple-400 text-4xl" />
          <h2 className="text-2xl font-bold mb-2">Subjects</h2>
          <p>Track all your subjects and record grades effortlessly.</p>
        </div>

        <div className="bg-purple-800/50 p-6 rounded-xl text-center flex flex-col items-center gap-4">
          <FaStickyNote className="text-purple-400 text-4xl" />
          <h2 className="text-2xl font-bold mb-2">Notes</h2>
          <p>Organize notes per subject to revise faster and smarter.</p>
        </div>

        <div className="bg-purple-800/50 p-6 rounded-xl text-center flex flex-col items-center gap-4">
          <FaProjectDiagram className="text-purple-400 text-4xl" />
          <h2 className="text-2xl font-bold mb-2">Projects</h2>
          <p>Keep all your projects in one place and track progress.</p>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
       />
    </div>
  );
}

export default Landingpage;
