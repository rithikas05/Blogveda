import { useEffect, useState } from "react";
import { updateProfile } from "../services/userAPI";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import PageWrapper from "../components/PageWrapper";

const quotes = [
  " Be still. The truth you seek is already within you.",
  " Shiva is not an entity — he is a possibility.",
  " Meditation is not about becoming better, it's about becoming nothing.",
  " From silence, came the sound. From the sound, came creation.",
];

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        if (!decoded || !decoded.id) throw new Error("Invalid token");
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || "user",
          bio: decoded.bio || "",
          iat: decoded.iat,
        });
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      } catch (err) {
        console.error("Token decode error:", err);
        toast.error("Invalid session. Please login again.");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleSave = async () => {
    try {
      const res = await updateProfile({
        bio: user.bio,
        role: user.role,
      });

      toast.success("Profile updated!");
      setUser((prev) => ({
        ...prev,
        bio: res.data.bio,
        role: res.data.role,
      }));
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center mt-20 text-gray-600 text-lg dark:text-gray-400">
          Loading profile...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <PageWrapper>
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          {/* Spiritual Quote */}
          <div className="text-center mb-10 max-w-2xl px-2">
            <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-400 dark:from-yellow-400 dark:to-indigo-400 drop-shadow-md animate-fade-in">
              {quote}
            </p>
          </div>

          {/*  Profile Card */}
          <div className="w-full max-w-xl bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl px-6 py-10 text-center transition-all space-y-4">
            {/* Avatar */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-4xl font-bold flex items-center justify-center shadow-lg ring-4 ring-gold mb-2">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-3xl font-extrabold text-primary dark:text-yellow-300 tracking-wide">
              {user.name}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">{user.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role:{" "}
              <span className="font-medium text-gold capitalize">
                {user.role}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined on {moment(user.iat * 1000).format("LL")}
            </p>

            <p className="italic text-gray-700 dark:text-gray-300">
              {user.bio || "No bio added yet."}
            </p>

            {editing ? (
              <div className="text-left space-y-4 pt-4">
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold text-gray-800 dark:text-white"
                  rows={4}
                  placeholder="Enter your new bio..."
                  value={user.bio}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, bio: e.target.value }))
                  }
                />
                <select
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2b2b2b] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold text-gray-800 dark:text-white"
                  value={user.role}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                >
                  <option value="user">User</option>
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="flex justify-center gap-4 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gold text-black font-semibold rounded-full shadow hover:brightness-110 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:text-black transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center gap-6 pt-4 flex-wrap">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-gradient-to-tr from-gold to-yellow-400 text-black font-semibold px-6 py-2.5 rounded-full shadow hover:scale-105 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate("/myblogs")}
                  className="bg-primary text-white font-semibold px-6 py-2.5 rounded-full shadow hover:scale-105 transition"
                >
                  My Blogs
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </PageWrapper>
  );
}

export default Profile;
