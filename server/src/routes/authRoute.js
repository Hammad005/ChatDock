import express from 'express'
import { login, logout, signup } from '../controllers/authControllers.js'

const authRoute = express.Router()

authRoute.post('/signup', signup)
authRoute.post('/login', login)
authRoute.post('/logut', logout)


export default authRoute