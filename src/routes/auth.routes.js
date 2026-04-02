import express from 'express';
import { deleteUsers, getAllUsers, getUserById, loginUser, logoutUser, registerUser } from '../controllers/user.js';
import { isAdmin, protect } from '../middlewares/protect/protect.js';

const router = express.Router();


router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/logout',logoutUser);
router.get('/users',protect,isAdmin, getAllUsers);
router.delete('/:id',protect,isAdmin,deleteUsers)
router.get('/:id',protect,isAdmin,getUserById);


export default router;

