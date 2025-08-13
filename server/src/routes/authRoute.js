import express from 'express'
import { login, logout, sendToken, signup } from '../controllers/authControllers.js'
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
authRoute.post('/logut', logout)
authRoute.put('/update', protectRoute, updateProfile)


export default authRoute