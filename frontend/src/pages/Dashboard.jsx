import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { FileText, Heart, CalendarClock, BadgeCheck } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageWrapper from "../components/PageWrapper";
import { getAllBlogs } from "../services/blogAPI";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
      fetchMyBlogs(decoded.id);
    } catch (err) {
      console.error("Invalid token", err);
      toast.error("Session expired. Please login again.");
    }
  }, []);

  const fetchMyBlogs = async (id) => {
    try {
      const res = await getAllBlogs();
      const userBlogs = res.data.filter(
        (b) => b.user === id || b.user?._id === id
      );
      setMyBlogs(userBlogs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    }
  };

  const totalLikes = myBlogs.reduce((sum, blog) => sum + blog.likes.length, 0);
  const latestBlog = [...myBlogs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  return (
    <PageWrapper>
      <DashboardLayout>
        {/* Welcome Banner */}
        <div className="mt-6 relative overflow-hidden rounded-2xl p-6 mb-6 bg-gradient-to-tr from-[#faf5ff] via-[#fff8e1] to-[#fefefe] dark:from-[#1b1b1d] dark:via-[#232323] dark:to-[#1a1a1a] shadow-inner border border-yellow-100 dark:border-[#333]">
          <div className="z-10 relative">
            <h1 className="text-4xl font-extrabold text-primary dark:text-yellow-300 mb-1">
              Hello, {user?.name || "Divine Blogger"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 italic text-sm">
              “You have the power to awaken minds through your words.”
            </p>
          </div>
          <div className="absolute top-0 right-0 h-full w-32 blur-3xl opacity-40 bg-yellow-300 dark:bg-yellow-400 rounded-full"></div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col sm:flex-row items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-yellow-300 dark:from-yellow-400 dark:to-yellow-200 text-white dark:text-black flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>

            <span className="mt-2 inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
              {user?.role || "user"}
            </span>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Joined:{" "}
              <span className="font-medium">
                {moment(user?.iat * 1000).format("MMMM Do YYYY")}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<FileText className="text-indigo-500" size={28} />}
            title="Blogs Written"
            value={myBlogs.length}
          />
          <StatCard
            icon={<Heart className="text-rose-500" size={28} />}
            title="Total Likes"
            value={totalLikes}
          />
          <StatCard
            icon={
              <CalendarClock className="text-yellow-500" size={28} />
            }
            title="Latest Blog"
            value={latestBlog ? moment(latestBlog.createdAt).fromNow() : "N/A"}
          />
          <StatCard
            icon={<BadgeCheck className="text-green-500" size={28} />}
            title="Role"
            value={user?.role || "user"}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <a
            href="/create"
            className="bg-primary dark:bg-yellow-400 text-white dark:text-black px-6 py-2 rounded-full shadow hover:shadow-xl transition-all"
          >
            Create New Blog
          </a>
          <a
            href="/myblogs"
            className="border border-primary dark:border-yellow-400 text-primary dark:text-yellow-300 px-6 py-2 rounded-full hover:bg-primary/10 dark:hover:bg-yellow-400/10 transition-all"
          >
            My Blogs
          </a>
          <a
            href="/profile"
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            Edit Profile
          </a>
        </div>
      </DashboardLayout>
    </PageWrapper>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white/90 dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
      <div className="mb-2">{icon}</div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
