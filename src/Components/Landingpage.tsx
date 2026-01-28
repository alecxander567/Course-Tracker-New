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
        className="absolute inset-0 bg-black/70 backdrop-blur-md
                   animate-backdrop-in"
        onClick={onClose}
      />

      <div
        className="
          relative w-[90%] max-w-md rounded-3xl
          bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-indigo-900/95
          backdrop-blur-xl border border-purple-500/20
          p-10 text-white shadow-2xl
          animate-modal-in
        ">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-white text-3xl 
                     transition-all hover:rotate-90 duration-300">
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
        },
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
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Log in to continue tracking your courses
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-center text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                     px-5 py-3.5 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                     transition-all duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                     px-5 py-3.5 text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                     transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                    py-4 text-lg font-semibold transition-all duration-300
                    hover:from-purple-500 hover:to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50
                    hover:-translate-y-0.5
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {loading ?
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Logging in...
            </span>
          : "Log in"}
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
        },
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
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-center text-gray-300 text-sm">
          Start organizing your academic life
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-center text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-green-500/20 border border-green-500/50 p-3 text-center font-semibold text-green-200">
          Successfully registered!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                   px-5 py-3.5 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   transition-all duration-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                   px-5 py-3.5 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   transition-all duration-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                   px-5 py-3.5 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   transition-all duration-300"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30
                   px-5 py-3.5 text-white placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
                   transition-all duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 
                    py-4 text-lg font-semibold transition-all duration-300
                    hover:from-purple-500 hover:to-pink-500 hover:shadow-2xl hover:shadow-purple-500/50
                    hover:-translate-y-0.5
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
          {loading ?
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Registering...
            </span>
          : "Register"}
        </button>
      </form>
    </ModalWrapper>
  );
};

function Landingpage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}></div>

        {/* Floating icons */}
        {[
          {
            Icon: FaCode,
            top: "10%",
            left: "5%",
            size: "text-6xl",
            delay: "0s",
          },
          {
            Icon: FaDatabase,
            top: "20%",
            left: "85%",
            size: "text-7xl",
            delay: "1s",
          },
          {
            Icon: FaLaptopCode,
            top: "65%",
            left: "8%",
            size: "text-6xl",
            delay: "2s",
          },
          {
            Icon: FaServer,
            top: "75%",
            left: "75%",
            size: "text-7xl",
            delay: "3s",
          },
          {
            Icon: FaBug,
            top: "40%",
            left: "50%",
            size: "text-5xl",
            delay: "1.5s",
          },
          {
            Icon: FaCloud,
            top: "85%",
            left: "35%",
            size: "text-6xl",
            delay: "2.5s",
          },
        ].map(({ Icon, top, left, size, delay }, index) => (
          <Icon
            key={index}
            className={`absolute ${size} text-purple-400/15 animate-float`}
            style={{ top, left, animationDelay: delay }}
          />
        ))}
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 relative z-10 py-12">
        <header className="mb-20 text-center mt-8">
          <div className="mb-6 inline-block">
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50">
                <FaBook className="text-5xl text-white" />
              </div>
            </div>
          </div>

          <h1 className="mb-6 text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Course Tracker
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-gray-300 leading-relaxed">
            Track subjects, manage notes, and monitor projects — all in one
            <span className="text-purple-300 font-semibold">
              {" "}
              clean dashboard
            </span>
            .
          </p>
        </header>

        <div className="mb-24 flex flex-col gap-5 sm:flex-row">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="group relative rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 
                     px-12 py-4 text-lg font-bold shadow-xl shadow-purple-500/50
                     transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/60
                     overflow-hidden">
            <span className="relative z-10">Log in</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="rounded-2xl border-2 border-purple-400/50 backdrop-blur-sm bg-white/5
                     px-12 py-4 text-lg font-bold transition-all duration-300 
                     hover:-translate-y-1 hover:bg-white/10 hover:border-purple-300 hover:shadow-xl">
            Register
          </button>
        </div>

        <section className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 mb-12">
          {[
            {
              icon: FaBook,
              title: "Subjects",
              text: "Organize all your enrolled subjects with ease and clarity.",
              gradient: "from-purple-600 to-purple-800",
            },
            {
              icon: FaStickyNote,
              title: "Notes",
              text: "Attach detailed notes per subject for quick and easy review.",
              gradient: "from-pink-600 to-purple-700",
            },
            {
              icon: FaProjectDiagram,
              title: "Projects",
              text: "Track project progress, deadlines, and milestones effortlessly.",
              gradient: "from-indigo-600 to-purple-800",
            },
          ].map(({ icon: Icon, title, text, gradient }) => (
            <div
              key={title}
              className="group relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 
                       backdrop-blur-lg border border-purple-400/20
                       p-8 text-center shadow-xl transition-all duration-500 
                       hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/30
                       hover:border-purple-400/40">
              <div
                className={`mx-auto mb-6 w-fit rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg`}>
                <Icon className="text-5xl text-white" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-purple-100">
                {title}
              </h2>
              <p className="text-gray-300 leading-relaxed">{text}</p>

              {/* Decorative corner accent */}
              <div
                className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400/30 rounded-tr-lg 
                            group-hover:border-purple-300/60 transition-colors duration-300"></div>
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
