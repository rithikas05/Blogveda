import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';
import { readingTime } from 'reading-time-estimator';
import {
  getBlogBySlug,
  addComment,
  deleteComment,
} from '../services/blogAPI';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from 'react-share';

import PageWrapper from '../components/PageWrapper';
import CommentCard from '../components/CommentCard';

function ViewBlog() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [readTime, setReadTime] = useState('');

  const token = localStorage.getItem('userToken');
  const loggedInUser = (() => {
    try {
      return token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch blog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, navigate]);

  useEffect(() => {
    if (blog?.content) {
      const stats = readingTime(blog.content, 200);
      setReadTime(stats.text);
    }
  }, [blog]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return toast.error('Comment cannot be empty');
    try {
      const res = await addComment(blog._id, { text: commentText });
      setBlog((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data],
      }));
      setCommentText('');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(blog._id, commentId);
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      toast.success('Comment deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <PageWrapper>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-primary dark:border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-300 text-sm">Loading blog...</p>
          </div>
        </div>
      ) : !blog ? null : (
        <div className="min-h-screen bg-background dark:bg-[#0d0d0d] py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a1a] shadow-xl rounded-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition">

            {blog.image && (
              <img
                src={blog.image}
                alt="Cover"
                onError={(e) => (e.target.style.display = 'none')}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <h1 className="text-4xl font-bold text-[#4B0082] dark:text-yellow-300 mb-3">
              {blog.title}
            </h1>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => navigate(`/tags/${tag}`)}
                    className="cursor-pointer text-sm bg-[#EDE9FE] dark:bg-indigo-800 text-[#5B21B6] dark:text-white px-3 py-1 rounded-full hover:scale-105 transition"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p
              onClick={() => navigate(`/user/${blog?.user?._id}`)}
              className="cursor-pointer text-sm font-semibold text-[#5B21B6] dark:text-yellow-400 hover:underline mb-1"
            >
              {blog?.user?.name || 'Anonymous'}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {moment(blog.createdAt).fromNow()}
            </p>

            {readTime && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                {readTime}
              </p>
            )}

            <div className="text-base leading-relaxed text-gray-800 dark:text-gray-100 whitespace-pre-line mb-10">
              {blog.content}
            </div>

            {/* Social Share */}
            <div className="mt-8 mb-12">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Share this post:
              </h4>
              <div className="flex gap-3 items-center">
                <FacebookShareButton url={window.location.href} quote={blog.title}>
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton url={window.location.href} title={blog.title}>
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton url={window.location.href} title={blog.title}>
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <LinkedinShareButton url={window.location.href} summary={blog.content}>
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>
              </div>
            </div>

            {/* Comments Section */}
            <h2 className="text-2xl font-semibold text-primary dark:text-yellow-300 mb-4">
              Comments
            </h2>

            {token ? (
              <div className="mb-6">
                <textarea
                  rows={3}
                  placeholder="Write your thoughts..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-[#111] dark:text-white focus:outline-[#5B21B6]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={handleAddComment}
                  className="mt-3 bg-gold dark:bg-yellow-400 text-black font-medium px-5 py-2 rounded hover:brightness-95"
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                Login to comment
              </p>
            )}

            {blog.comments?.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment._id} className="mb-3">
                  <CommentCard
                    comment={comment}
                    onDelete={
                      comment.user?._id === loggedInUser
                        ? () => handleDeleteComment(comment._id)
                        : null
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

export default ViewBlog;
