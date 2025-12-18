import express from 'express';
import {
  register,
  getMe, // Import getMe controller
  resendVerification, // Import resendVerification controller
  verifyEmail, // Import verifyEmail controller
  login, // Import login controller
  googleAuth, // Import googleAuth controller
  logout, // Import logout controller
} from '../controllers/auth/auth.controller.js';

import { validate } from '../middlewares/validator.middleware.js';
import { authMiddleware } from '../middlewares/auth/auth.middleware.js'; // Import authMiddleware

import { 
  registerDto,
  resendVerificationDto, // Import resendVerificationDto
  verifyEmailDto, // Import verifyEmailDto
  loginDto, // Import loginDto
  googleLoginDto, // Import googleLoginDto
} from '../dto/auth.dto.js';

const router = express.Router();

router.post('/register', validate(registerDto), register);
router.post('/login', validate(loginDto), login); // Add login route
router.post('/verify', validate(verifyEmailDto), verifyEmail); // Add verify email route
router.post('/resend-verification', validate(resendVerificationDto), resendVerification); // Add resend verification route
router.post('/google', validate(googleLoginDto), googleAuth); // Add Google auth route

router.get('/me', authMiddleware, getMe); // Add getMe route
router.post('/logout', logout); // Add logout route

export default router;