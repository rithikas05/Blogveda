import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toggleLike } from "../services/blogAPI";
import toast from "react-hot-toast";
import moment from "moment";

function BlogCard({ blog, image, onEditClick, onDeleteClick }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const loggedInUser = token ? JSON.parse(atob(token.split(".")[1]))?.id : null;

  const isOwner = blog.user === loggedInUser || blog.user?._id === loggedInUser;
  const [likes, setLikes] = useState(blog.likes || []);
  const isLiked = Array.isArray(likes) && loggedInUser && likes.includes(loggedInUser);

  const handleLike = async () => {
    if (!token) {
      toast.error("Login to like");
      return;
    }

    try {
      const res = await toggleLike(blog._id);
      if (Array.isArray(res.data.likes)) {
        setLikes(res.data.likes);
      } else {
        toast.error("Failed to update likes");
      }
    } catch (err) {
      console.error("Error liking blog", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900/60 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col">
      {image && (
        <img
          src={image}
          alt={blog.title || "Blog cover image"}
          className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}

      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-darkText dark:text-white mb-2 tracking-wide group-hover:text-primary transition line-clamp-2">
            {blog.title || "Untitled"}
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3 text-sm md:text-base leading-relaxed tracking-wide">
            {blog.content || "No content available..."}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-wider italic">
             {blog?.user?.name || "Anonymous"} • {moment(blog.createdAt).fromNow()}
          </p>

          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => navigate(`/tags/${tag}`)}
                  className="bg-gradient-to-tr from-primary to-gold text-white px-2 py-1 rounded-full text-xs font-medium cursor-pointer shadow-sm hover:brightness-110 transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/*  Like */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`text-xl transition-transform duration-200 ${
                isLiked ? "text-red-600 scale-110" : "text-gray-400 hover:text-red-500"
              }`}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300 tracking-wide">
              {likes.length} {likes.length === 1 ? "Like" : "Likes"}
            </span>
          </div>

          {/* 🔧 Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/blog/${blog.slug}`)}
              className="px-4 py-1.5 text-sm font-semibold bg-gold text-darkText rounded-xl shadow-sm hover:brightness-110 hover:shadow-md transition"
            >
              Read
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => onEditClick(blog)}
                  className="px-4 py-1.5 text-sm font-semibold border border-primary text-primary dark:text-yellow-300 rounded-xl hover:bg-primary/10 dark:hover:bg-yellow-300/10 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDeleteClick(blog)}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
