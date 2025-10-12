import axios from "axios";
import { useNavigate } from "react-router-dom";
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

      <main className="flex-1 flex p-10 ml-64 text-white w-full gap-6 relative">
        {alertMessage && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white z-50 shadow-lg"
            style={{
              backgroundColor: alertType === "success" ? "#22c55e" : "#ef4444",
            }}
          >
            {alertMessage}
          </div>
        )}

        <div className="flex gap-6 w-full">
          <div className="flex-1 bg-purple-900/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-white min-h-[500px]">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-700 mb-4">
              <img
                src={
                  profile.profile_pic
                    ? `http://localhost:8000${profile.profile_pic}?t=${Date.now()}`
                    : `https://ui-avatars.com/api/?name=${user.username}&background=random`
                }
                alt={user.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
                }}
              />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-center text-white">
              {user.full_name || user.username}
            </h2>

            <div className="flex flex-col gap-3 w-full px-4">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-cyan-400" />{" "}
                <span className="font-semibold text-white">Email:</span>{" "}
                {user.email}
              </p>
              {profile.address && (
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-cyan-400" />{" "}
                  <span className="font-semibold text-white">Address:</span>{" "}
                  {profile.address}
                </p>
              )}
              {profile.school && (
                <p className="flex items-center gap-2">
                  <FaSchool className="text-cyan-400" />{" "}
                  <span className="font-semibold text-white">School:</span>{" "}
                  {profile.school}
                </p>
              )}
              {profile.course && (
                <p className="flex items-center gap-2">
                  <FaBook className="text-cyan-400" />{" "}
                  <span className="font-semibold text-white">Course:</span>{" "}
                  {profile.course}
                </p>
              )}
              {profile.bio && (
                <div className="flex items-start gap-2 mt-2 w-full">
                  <FaUserAlt className="text-cyan-400 mt-1 text-lg" />
                  <div className="w-full">
                    <span className="font-semibold text-white text-lg">
                      Bio:
                    </span>
                    <div className="bg-purple-800/50 p-6 rounded-lg mt-2 min-h-[200px] text-white text-lg w-full max-w-full shadow-lg">
                      {profile.bio}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-purple-900/90 rounded-2xl shadow-lg p-6 flex flex-col min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaUser className="text-cyan-400" />
              Account Details
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              className="flex flex-col gap-4 flex-1"
            >
              <input
                type="text"
                placeholder="Username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={user.full_name || ""}
                onChange={(e) =>
                  setUser({ ...user, full_name: e.target.value })
                }
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <input
                type="text"
                placeholder="Address"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <input
                type="text"
                placeholder="School"
                value={profile.school || ""}
                onChange={(e) =>
                  setProfile({ ...profile, school: e.target.value })
                }
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <input
                type="text"
                placeholder="Course"
                value={profile.course || ""}
                onChange={(e) =>
                  setProfile({ ...profile, course: e.target.value })
                }
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <textarea
                placeholder="Bio"
                value={profile.bio || ""}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                className="p-2 rounded bg-purple-700 border border-purple-600"
              />
              <label className="flex items-center gap-2 p-2 bg-purple-700 border border-purple-600 rounded cursor-pointer hover:bg-purple-800 transition">
                <FaUpload className="text-cyan-400" />
                <span>
                  {selectedFile ? selectedFile.name : "Upload Profile Picture"}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition w-full self-start"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
