import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog } from "../services/blogAPI";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import PageWrapper from "../components/PageWrapper";

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (!decoded?.id) throw new Error("Token missing user ID");
      fetchUserBlogs(decoded.id);
    } catch (err) {
      console.error("Token parse error:", err);
      toast.error("Session expired. Please login again.");
    }
  }, []);

  const fetchUserBlogs = async (userId) => {
    try {
      const res = await getAllBlogs();
      const myBlogs = res.data
        .filter((blog) => {
          const blogUserId =
            typeof blog.user === "string" ? blog.user : blog.user?._id;
          return blogUserId === userId;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBlogs(myBlogs);
    } catch (err) {
      console.error("Error loading blogs:", err);
      toast.error("Could not load your blogs");
    }
  };

  const confirmDelete = (blogId) => {
    setSelectedBlogId(blogId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting blog...");
      await deleteBlog(selectedBlogId);
      toast.dismiss();
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((blog) => blog._id !== selectedBlogId));
      setShowModal(false);
    } catch (err) {
      toast.dismiss();
      console.error("Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <PageWrapper>
      <DashboardLayout>
        <h1 className="text-3xl font-extrabold text-primary dark:text-yellow-300 mb-8 drop-shadow-sm">
          My Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No blogs found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition group flex flex-col"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt="cover"
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                  />
                )}

                <div className="p-5 flex flex-col grow justify-between">
                  <div>
                    <h2
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="text-lg font-semibold text-primary dark:text-yellow-300 hover:underline cursor-pointer mb-1 line-clamp-2"
                    >
                      {blog.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white text-xs px-2 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.likes?.length > 0 && (
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                          ❤️ {blog.likes.length}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {moment(blog.createdAt).fromNow()}
                    </p>

                    <p className="text-gray-700 dark:text-gray-200 text-sm mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/edit/${blog.slug}`)}
                      className="px-4 py-1.5 text-sm font-semibold border border-primary text-primary dark:text-yellow-300 rounded-xl hover:bg-primary/10 dark:hover:bg-yellow-300/10 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(blog._id)}
                      className="px-4 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirm Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-6 shadow-xl w-[90%] max-w-md border border-gray-300 dark:border-gray-600">
              <h3 className="text-xl font-semibold text-center text-red-600 dark:text-yellow-300 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
                Are you sure you want to delete this blog? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </PageWrapper>
  );
}

export default MyBlogs;
