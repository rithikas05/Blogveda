import Blog from '../models/blogModel.js';
import slugify from 'slugify';
// Create blog with slug
// controllers/blogController.js

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, featured } = req.body;
    const userId = req.user?._id;
    const image = req.file ? req.file.path : null;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please login again." });
    }

    // Generate slug safely
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Ensure unique slug
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const newBlog = new Blog({
      title,
      content,
      image,
      tags: tags?.split(',').map((t) => t.trim()),
      user: userId,
      featured: featured === "true", // if passed as string from frontend
      slug,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Create Blog Error:", error.message);
    res.status(500).json({ message: "Failed to create blog. " + error.message });
  }
};


// @desc Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('user', 'name email') // include author's name/email
      .populate('comments.user', 'name email') // include commenter info
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error(' Error fetching blogs:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};



// @desc Get a single blog post by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('user', 'name email')
      .populate('comments.user', 'name email');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (error) {
    console.error(' Error fetching blog by ID:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('user', 'name email')
      .populate('comments.user', 'name email');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update blog & regenerate slug if title changes
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    //  FIXED: Use blog.user instead of blog.author
    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    if (tags) {
      blog.tags = tags.split(",").map(tag => tag.trim());
    }

    if (req.file) {
      blog.image = req.file.path; // Or cloudinary url
    }

    await blog.save();

    res.status(200).json({ message: "Blog updated", blog });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

// @desc Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not allowed to modify this blog' });
  } 
    
    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: error.message || 'Server error'  });
  }
};
//get featured blogs
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch featured blogs" });
  }
};




// @desc Get blogs by tag
export const getBlogsByTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const blogs = await Blog.find({ tags: { $in: [tag] } })
      .populate('user', 'name email')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};



// Like or Unlike a blog
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (!req.user || !req.user._id) {
  return res.status(401).json({ message: "Unauthorized: user not found in request" });
}

    const userId = req.user._id.toString();

    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) {
      blog.likes.pull(userId); // Unlike
    } else {
      blog.likes.push(userId); // Like
    }

    await blog.save();
res.status(200).json({ 
  message: alreadyLiked ? "Unliked" : "Liked",
  likes: blog.likes, // Return updated likes
});

  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//  Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    blog.comments.unshift(comment); // Add latest comment to top
    await blog.save();

    // Populate the user info for the latest comment
    await blog.populate('comments.user', 'name email');

    const latestComment = blog.comments[0];

    res.status(201).json(latestComment); // Send populated comment
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


//  Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = blog.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your comment' });
    }

    blog.comments.pull(comment._id); //  use pull instead of remove
    await blog.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(" Error deleting comment:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

