import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaStickyNote,
  FaChartBar,
  FaSignOutAlt,
  FaBook,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSchool,
  FaUserAlt,
  FaUpload,
  FaProjectDiagram,
  FaInfoCircle,
  FaCheckSquare,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  full_name?: string;
  email: string;
}

interface UserProfile {
  profile_pic?: string;
  address?: string;
  school?: string;
  course?: string;
  bio?: string;
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    id: 0,
    username: "",
    email: "",
    full_name: "",
  });

  const [profile, setProfile] = useState<UserProfile>({
    profile_pic: "",
    address: "",
    school: "",
    course: "",
    bio: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
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

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("full_name", user.full_name || "");
    formData.append("address", profile.address || "");
    formData.append("school", profile.school || "");
    formData.append("course", profile.course || "");
    formData.append("bio", profile.bio || "");

    if (selectedFile) formData.append("profile_pic", selectedFile);

    try {
      await axios.post(`http://localhost:8000/profile/${user.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const resProfile = await axios.get(
        `http://localhost:8000/profile/${user.id}/`,
        { withCredentials: true },
      );
      setUser(resProfile.data.user);
      setProfile(resProfile.data.profile);
      setSelectedFile(null);

      setAlertType("success");
      setAlertMessage("Profile updated successfully!");
      setTimeout(() => setAlertMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMessage("Failed to update profile.");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchCurrentUserAndProfile = async () => {
      try {
        const resUser = await axios.get(
          "http://localhost:8000/api/current_user/",
          { withCredentials: true },
        );
        const currentUser = resUser.data;
        setUser(currentUser);

        const resProfile = await axios.get(
          `http://localhost:8000/profile/${currentUser.id}/`,
          { withCredentials: true },
        );
        setProfile(resProfile.data.profile);
      } catch (err) {
        console.error("Failed to fetch user/profile:", err);
      }
    };
    fetchCurrentUserAndProfile();
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
      setAlertType("error");
      setAlertMessage("Failed to log out.");
      setTimeout(() => setAlertMessage(""), 3000);
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
      <main className="flex-1 flex flex-col p-8 ml-64 relative z-10">
        {/* Header Section */}
        <section className="mb-8 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">
            <FaUser className="text-cyan-400" /> My Profile
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your account information and preferences
          </p>
        </section>

        {/* Profile Content */}
        <section className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Profile Display */}
            <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-8 shadow-xl">
              <div className="flex flex-col items-center">
                {/* Profile Picture */}
                <div className="relative group mb-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-400/30 shadow-2xl shadow-purple-500/50 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-400/50">
                    <img
                      src={
                        profile.profile_pic ?
                          `http://localhost:8000${profile.profile_pic}?t=${Date.now()}`
                        : `https://ui-avatars.com/api/?name=${user.username}&background=random&size=160`
                      }
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.username}&background=random&size=160`;
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* User Name */}
                <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                  {user.full_name || user.username}
                </h2>
                <p className="text-purple-300 text-sm mb-6">@{user.username}</p>

                {/* Profile Information Cards */}
                <div className="w-full space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                        <FaEnvelope className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {profile.address && (
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                          <FaMapMarkerAlt className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                            Address
                          </p>
                          <p className="text-white font-medium">
                            {profile.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.school && (
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                          <FaSchool className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                            School
                          </p>
                          <p className="text-white font-medium">
                            {profile.school}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.course && (
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                          <FaBook className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                            Course
                          </p>
                          <p className="text-white font-medium">
                            {profile.course}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.bio && (
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                          <FaUserAlt className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-2">
                            Bio
                          </p>
                          <p className="text-white leading-relaxed">
                            {profile.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-400/20 p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <FaEdit className="text-cyan-400" />
                Edit Profile
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProfile();
                }}
                className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) =>
                      setUser({ ...user, username: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={user.full_name || ""}
                    onChange={(e) =>
                      setUser({ ...user, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={profile.address || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    School
                  </label>
                  <input
                    type="text"
                    placeholder="School"
                    value={profile.school || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, school: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Course
                  </label>
                  <input
                    type="text"
                    placeholder="Course"
                    value={profile.course || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, course: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Profile Picture
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-purple-400/30 cursor-pointer hover:bg-white/15 transition-all duration-300 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 group-hover:scale-110 transition-transform duration-300">
                      <FaUpload className="text-white" />
                    </div>
                    <span className="text-white font-medium flex-1">
                      {selectedFile ?
                        selectedFile.name
                      : "Choose a profile picture"}
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2">
                  <FaSave /> Save Changes
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

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

export default Profile;
