import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, getBlogsByUser } from "../services/userAPI";
import BlogCard from "../components/BlogCard";

function AuthorProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getUserById(id);
        const blogRes = await getBlogsByUser(id);
        setUser(userRes.data);
        setBlogs(blogRes.data.blogs);
      } catch (err) {
        console.error("Failed to fetch author profile:", err);
      }
    };
    fetchData();
  }, [id]);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#111] transition">
        <p className="text-xl text-gray-600 dark:text-gray-300 animate-pulse">
          Loading author...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen py-12 px-4 bg-background dark:bg-[#111] transition">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-primary dark:text-yellow-300 mb-2">
          {user.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{user.email}</p>
        {user.bio && (
          <p className="text-base italic text-gray-700 dark:text-gray-300 mb-8">
            {user.bio}
          </p>
        )}
        <hr className="border-gray-300 dark:border-gray-600 mb-8" />
        <h2 className="text-2xl font-semibold text-left text-darkText dark:text-gray-100 mb-4">
          Blogs by {user.name}
        </h2>
        <div className="grid gap-6">
          {blogs.length > 0 ? (
            blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No blogs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;
