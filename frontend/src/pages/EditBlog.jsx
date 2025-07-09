import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogBySlug, updateBlog } from "../services/blogAPI";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import ConfirmModal from "../components/ConfirmModal";

function EditBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blogId, setBlogId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        const blog = res.data;
        if (!blog) {
          toast.error("Blog not found");
          navigate("/");
          return;
        }
        setBlogId(blog._id);
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags?.join(", "));
        setPreview(blog.image);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [slug, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    if (image) formData.append("image", image);

    try {
      await updateBlog(blogId, formData);
      toast.success("Blog updated successfully!");
      navigate("/myblogs");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error("Failed to update blog");
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background dark:bg-[#111] py-12 px-4 transition">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 sm:p-10 border border-primary/30 dark:border-gray-700 transition">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-yellow-300 mb-10 tracking-wide drop-shadow-glow">
            Edit Blog
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium mb-1 text-darkText dark:text-gray-200">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary outline-none text-sm text-darkText dark:text-gray-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-darkText dark:text-gray-200">
                Blog Content
              </label>
              <textarea
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Update your thoughts..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary resize-none outline-none text-sm text-darkText dark:text-gray-100 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-darkText dark:text-gray-200">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. shiva, meditation, vedas"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary outline-none text-sm text-darkText dark:text-gray-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-darkText dark:text-gray-200">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 dark:text-gray-300 
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold
                  file:bg-primary file:text-white 
                  dark:file:bg-yellow-500 dark:file:text-black 
                  hover:file:brightness-110 transition"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 h-52 w-full object-cover rounded-xl shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-tr from-primary to-gold shadow hover:brightness-110 transition text-lg"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmUpdate}
        title="Save Changes?"
        message="Are you sure you want to update this blog post?"
      />
    </PageWrapper>
  );
}

export default EditBlog;
