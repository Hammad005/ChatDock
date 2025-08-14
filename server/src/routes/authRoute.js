import express from 'express'
import { getAllUsers, login, logout, sendToken, signup, updateProfile } from '../controllers/authControllers.js'
import passport from 'passport';
import { protectRoute } from '../middleware/protectRoute.js';

const authRoute = express.Router()

authRoute.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    prompt: 'select_account consent',
  })
);

authRoute.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL }),
  (req, res) => {
    // Send JWT token after successful login
    sendToken(req.user, res);
  }
);

authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/logout', logout)
authRoute.put('/update', protectRoute, updateProfile)

authRoute.get('/me', protectRoute, (req, res) => res.status(200).json({user: req.user}));
authRoute.get('/allUsers', protectRoute, getAllUsers);


export default authRoute