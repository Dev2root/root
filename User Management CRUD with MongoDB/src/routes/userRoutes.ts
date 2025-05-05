import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

// CRUD routes
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/stats/city', userController.getUserStatsByCity);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
