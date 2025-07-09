import express from 'express';
import {
  updateUserProfile,
  getUserDashboardData,
  getBlogsByUserId,
  getUserById,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Dashboard data (likes, comments, count)
router.get('/dashboard', protect, getUserDashboardData);

// Get blogs by user ID
router.get('/:id/blogs', getBlogsByUserId);

// Get user by ID
router.get('/:id', getUserById);

export default router;
