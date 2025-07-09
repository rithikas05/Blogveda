import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogAPI";
import toast from "react-hot-toast";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";

function CreateBlog() {
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file instanceof Blob) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
      toast.error("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("featured", featured);
    if (image) formData.append("image", image);

    try {
      await createBlog(formData);
      toast.success("Blog published successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error creating blog:", err);
      toast.error("Failed to create blog");
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="min-h-screen bg-background dark:bg-[#111] py-12 px-4 transition">
        <div className="max-w-3xl mx-auto bg-white/80 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 border border-primary/30 dark:border-gray-700 transition">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary dark:text-yellow-300 mb-10 tracking-wide drop-shadow-glow">
            ✍️ Publish a New Blog
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-darkText dark:text-gray-200 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Enter your blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary outline-none text-sm text-darkText dark:text-gray-100 transition"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-darkText dark:text-gray-200 mb-1">
                Content
              </label>
              <textarea
                rows="6"
                placeholder="Your thoughts, stories, teachings..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary resize-none outline-none text-sm text-darkText dark:text-gray-100 transition"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-darkText dark:text-gray-200 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. meditation, karma, mindfulness"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2b2b2b] focus:ring-2 focus:ring-primary outline-none text-sm text-darkText dark:text-gray-100 transition"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-darkText dark:text-gray-200">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 dark:text-gray-300 
                  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold
                  file:bg-[#4b0082] file:text-white 
                  dark:file:bg-yellow-500 dark:file:text-black 
                  hover:file:brightness-110 transition"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 w-full max-h-64 object-cover rounded-xl shadow"
                />
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-primary dark:accent-yellow-400"
              />
              <label htmlFor="featured" className="text-sm text-darkText dark:text-gray-200">
                Mark as Featured
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-tr from-primary to-gold shadow hover:brightness-110 transition text-lg"
            >
              Publish Blog
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}

export default CreateBlog;
