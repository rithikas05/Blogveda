import { useEffect, useState } from "react";
import { getAllBlogs, deleteBlog, getFeaturedBlogs } from "../services/blogAPI";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BlogCard from "../components/BlogCard";
import ConfirmModal from "../components/ConfirmModal";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [featured, setFeatured] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogs();
      console.log("getAllBlogs response:", res.data); // ✅ Debugging
      const blogArray = Array.isArray(res.data) ? res.data : res.data.blogs; // ✅ Handles both shapes
      setBlogs(blogArray);
      setFilteredBlogs(blogArray);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login to delete a blog");
      navigate("/login");
      return;
    }

    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully");
      fetchBlogs();
      setIsConfirmModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete blog");
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(term) ||
        blog.content.toLowerCase().includes(term)
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

useEffect(() => {
  async function fetchFeatured() {
    try {
      const featuredArray = await getFeaturedBlogs(); // 👈 fixed
      console.log("getFeaturedBlogs response:", featuredArray);
      setFeatured(featuredArray);
    } catch (err) {
      console.error(err);
      console.error("Failed to load featured blogs");
    }
  }
  fetchFeatured();
}, []);


  return (
    <div className="min-h-screen bg-background dark:bg-[#0b0b0b] text-darkText dark:text-gray-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-primary dark:text-yellow-300 drop-shadow-md tracking-tight">
          🔱 <span className="text-gold">Blogveda</span> – Explore Divine Wisdom
        </h1>

        {/* 🔍 Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search blogs by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-white dark:bg-[#1b1b1b] shadow-glow border border-primary text-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold transition"
          />
        </div>

        {/* ➕ Create Blog Button */}
        <div className="flex justify-end mb-10">
          <button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-tr from-primary to-gold text-white dark:text-black px-6 py-3 rounded-xl shadow-glow hover:scale-105 transition font-semibold tracking-wide"
          >
            ➕ Create Blog
          </button>
        </div>

        {/* Featured Blogs */}
        {Array.isArray(featured) && featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-primary dark:text-yellow-300 drop-shadow-glow">
              Featured Blogs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {featured.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                  className="cursor-pointer bg-white/90 dark:bg-[#1a1a1a]/90 p-4 rounded-xl border border-primary/10 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold mb-1 text-[#4b0082] dark:text-yellow-200 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {blog.user?.name || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Blogs */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {Array.isArray(filteredBlogs) && filteredBlogs.length === 0 ? (
            <p className="text-center col-span-2 text-gray-500 dark:text-gray-400 text-lg">
              No matching blogs found.
            </p>
          ) : (
            Array.isArray(filteredBlogs) &&
            filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                image={blog.image}
                onEditClick={() => navigate(`/edit/${blog.slug}`)}
                onDeleteClick={() => {
                  setSelectedBlog(blog);
                  setIsConfirmModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={() => handleDelete(selectedBlog?._id)}
        title="Delete this blog?"
        message="This action cannot be undone. Are you sure you want to delete this blog?"
      />
    </div>
  );
}

export default Home;
