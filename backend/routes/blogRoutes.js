// routes/blogRoutes.js
import express from 'express';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
  getBlogsByTag,
  getFeaturedBlogs,
} from '../controllers/blogController.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/tag/:tag', getBlogsByTag);
router.get('/slug/:slug', getBlogBySlug);
router.get('/featured', getFeaturedBlogs);

router.get('/:id', getBlogById); // expects MongoDB _id
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog); // expects MongoDB _id
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
