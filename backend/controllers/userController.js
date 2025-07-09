import User from '../models/userModel.js';
import Blog from '../models/blogModel.js';
import asyncHandler from 'express-async-handler';

// Update profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bio = req.body.bio || user.bio;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      iat: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get dashboard data
export const getUserDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  const blogs = await Blog.find({ user: userId });

  let totalLikes = 0;
  let totalComments = 0;

  blogs.forEach((blog) => {
    totalLikes += blog.likes.length;
    totalComments += blog.comments?.length || 0;
  });

  res.status(200).json({
    user,
    blogCount: blogs.length,
    totalLikes,
    totalComments,
  });
});

//  Get blogs by user ID
export const getBlogsByUserId = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.id }).sort({ createdAt: -1 });
    const author = await User.findById(req.params.id).select("name bio role");
    res.status(200).json({ blogs, author });
  } catch (error) {
    console.error("getBlogsByUserId error:", error);
    res.status(500).json({ message: "Failed to fetch user blogs" });
  }
};

//  Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
