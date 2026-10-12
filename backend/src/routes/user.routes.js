import express from 'express';
import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', registerUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', deleteUser);

export default router;
