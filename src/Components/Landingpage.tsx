import React, { useState } from "react";
import {
  FaBook,
  FaStickyNote,
  FaProjectDiagram,
  FaCode,
  FaDatabase,
  FaLaptopCode,
  FaServer,
  FaBug,
  FaCloud,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm
                   animate-backdrop-in"
        onClick={onClose}
      />

      <div
        className="
          relative w-[90%] max-w-md rounded-2xl
          bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900
          p-8 text-white shadow-2xl
          animate-modal-in
        ">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-white text-2xl transition">
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

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
      const { data } = await axios.post(
        "http://localhost:8000/api/login/",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Logged in user:", data);
      navigate("/homepage");

      setUsername("");
      setPassword("");
      onClose();
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Login failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-gray-300 mb-6">
        Log in to continue tracking your courses
      </p>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg bg-purple-600 py-3 text-lg font-semibold transition-all hover:bg-purple-500 hover:shadow-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </ModalWrapper>
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
      const { data } = await axios.post(
        "http://localhost:8000/api/register/",
        { username, email, password, full_name: fullname },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Registered user:", data);
      setSuccess(true);

      setUsername("");
      setEmail("");
      setFullname("");
      setPassword("");

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
      <p className="text-center text-gray-300 mb-6">
        Start organizing your academic life
      </p>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
      {success && (
        <div className="mb-4 rounded-lg bg-green-600 p-3 text-center font-semibold">
          Successfully registered!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-lg bg-purple-800/80 px-4 py-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg bg-purple-600 py-3 text-lg font-semibold transition-all hover:bg-purple-500 hover:shadow-xl ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </ModalWrapper>
  );
};

function Landingpage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-purple-600 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          {
            Icon: FaCode,
            top: "10%",
            left: "5%",
            size: "text-5xl",
            delay: "0s",
          },
          {
            Icon: FaDatabase,
            top: "20%",
            left: "80%",
            size: "text-6xl",
            delay: "1s",
          },
          {
            Icon: FaLaptopCode,
            top: "65%",
            left: "10%",
            size: "text-5xl",
            delay: "2s",
          },
          {
            Icon: FaServer,
            top: "75%",
            left: "70%",
            size: "text-6xl",
            delay: "3s",
          },
          {
            Icon: FaBug,
            top: "40%",
            left: "50%",
            size: "text-4xl",
            delay: "1.5s",
          },
          {
            Icon: FaCloud,
            top: "85%",
            left: "30%",
            size: "text-5xl",
            delay: "2.5s",
          },
        ].map(({ Icon, top, left, size, delay }, index) => (
          <Icon
            key={index}
            className={`absolute ${size} text-purple-300/20 animate-float`}
            style={{ top, left, animationDelay: delay }}
          />
        ))}
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6">
        <header className="mb-16 text-center">
          <h1 className="mb-4 flex items-center justify-center gap-4 text-5xl font-extrabold">
            <FaBook className="text-purple-300" />
            Course Tracker
            <FaProjectDiagram className="text-purple-300" />
          </h1>
          <p className="mx-auto max-w-xl text-lg text-gray-200">
            Track subjects, manage notes, and monitor projects — all in one
            clean dashboard.
          </p>
        </header>

        <div className="mb-20 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="rounded-xl bg-purple-700 px-10 py-3 text-lg font-semibold shadow-lg transition-all hover:-translate-y-1 hover:bg-purple-600 hover:shadow-2xl">
            Log in
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-xl border border-purple-300 px-10 py-3 text-lg font-semibold transition-all hover:-translate-y-1 hover:bg-purple-800">
            Register
          </button>
        </div>

        <section className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: FaBook,
              title: "Subjects",
              text: "Organize all your enrolled subjects.",
            },
            {
              icon: FaStickyNote,
              title: "Notes",
              text: "Attach notes per subject for easy review.",
            },
            {
              icon: FaProjectDiagram,
              title: "Projects",
              text: "Track project progress and deadlines.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-purple-900/80 p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
              <Icon className="mx-auto mb-4 text-4xl text-purple-300" />
              <h2 className="mb-2 text-2xl font-bold">{title}</h2>
              <p className="text-gray-200">{text}</p>
            </div>
          ))}
        </section>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </div>
  );
}

export default Landingpage;
