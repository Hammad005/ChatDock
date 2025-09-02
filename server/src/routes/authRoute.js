import express from 'express'
import { getAllUsers, googleAuth, login, logout, removeProfile, signup, updateProfile } from '../controllers/authControllers.js'
import { protectRoute } from '../middleware/protectRoute.js';

const authRoute = express.Router()

authRoute.post('/google', googleAuth);

authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/logout', logout)

authRoute.put('/update', protectRoute, updateProfile)

authRoute.delete('/removeProfile', protectRoute, removeProfile)

authRoute.get('/me', protectRoute, (req, res) => res.status(200).json({user: req.user}));
authRoute.get('/allUsers', protectRoute, getAllUsers);


export default authRoute