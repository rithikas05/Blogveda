import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../services/blogAPI";
import BlogCard from "../components/BlogCard";
import ConfirmModal from "../components/ConfirmModal";
import PageWrapper from "../components/PageWrapper";
import toast from "react-hot-toast";

function TagBlogs() {
  const { tag } = useParams();
  const navigate = useNavigate();

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await getAllBlogs();
        const allBlogs = res.data;

        const normalizedTag = tag?.toLowerCase();
        const matching = allBlogs.filter((blog) =>
          blog.tags?.some((t) => t.toLowerCase() === normalizedTag)
        );

        setFilteredBlogs(matching);
      } catch (err) {
        console.error("Error fetching blogs by tag:", err);
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [tag]);

  const openConfirmModal = (blog) => {
    setBlogToDelete(blog);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete._id || blogToDelete.slug);
      setFilteredBlogs((prev) =>
        prev.filter(
          (b) =>
            b._id !== blogToDelete._id &&
            b.slug !== blogToDelete.slug
        )
      );
      toast.success("Blog deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete blog");
    } finally {
      setShowConfirm(false);
      setBlogToDelete(null);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-lightGray dark:bg-darkBackground py-12 px-4 sm:px-8 transition-all">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-primary dark:text-yellow-300 tracking-wide drop-shadow-glow">
            Blogs tagged with <span className="text-gold">#{tag}</span>
          </h1>

          {loading ? (
            <div className="text-gray-600 dark:text-gray-300 text-center text-sm">
              Loading blogs...
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  image={blog.image}
                  onEditClick={() => navigate(`/edit/${blog.slug}`)}
                  onDeleteClick={() => openConfirmModal(blog)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-lg italic">
              No blogs found with the tag{" "}
              <span className="text-primary dark:text-yellow-300">#{tag}</span>.
            </p>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title=" Confirm Deletion"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
      />
    </PageWrapper>
  );
}

export default TagBlogs;
