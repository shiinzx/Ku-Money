import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // For JWT_SECRET etc
import { OAuth2Client } from 'google-auth-library';
import * as userDatasource from '../../datasource/user.datasource.js';
import * as subscriptionDatasource from '../../datasource/subscription.datasource.js'; // Import subscription datasource
import * as emailService from '../../services/email.service.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/token.js';
import subscriptionPackages from '../../../subscription-packages.js'; // Import subscription packages

// Initialize Google OAuth2Client
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Get free package limits
const freePackage = subscriptionPackages.find(pkg => pkg.package === 'free');
const FREE_PACKAGE_LIMITS = {
  limitCategory: freePackage.category,
  limitAccount: freePackage.account,
  limitIncomes: freePackage.incomes,
  limitExpenses: freePackage.expenses,
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await userDatasource.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password dengan bcrypt (salt: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour from now

    // Simpan user ke database
    const user = await userDatasource.createUser({
      email,
      name,
      status: 'free',
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationTokenExpires,
      verified: false, // Ensure user is marked as not verified initially
    });

    // Create a default free subscription for the new user
    const expiredAt = new Date();
    expiredAt.setFullYear(expiredAt.getFullYear() + 100); // Set to 100 years from now

    await subscriptionDatasource.createSubscription({
      expiredAt: expiredAt,
      createdBy: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      isActive: true,
      ...FREE_PACKAGE_LIMITS,
    });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(user.email, emailVerificationToken);
    } catch (emailError) {
      console.error('Error sending verification email after user registration:', emailError);
      return res.status(500).json({ message: 'Error sending verification email. Please try again later.' });
    }

    res.status(201).json({ 
      message: 'User registered. Please check your email for verification.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        verified: user.verified,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userDatasource.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email, name: user.name });
    const refreshToken = generateRefreshToken({ id: user._id, email: user.email, name: user.name });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        verified: user.verified,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMe = async (req, res) => {
  // req.user is populated by the protect middleware
  try {
    const user = await userDatasource.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        verified: user.verified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await userDatasource.findUserByVerificationToken(token); // Assuming this function exists
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (user.emailVerificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userDatasource.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    user.lastVerificationEmailSent = Date.now();
    await user.save();

    await emailService.sendVerificationEmail(user.email, emailVerificationToken);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending verification email.' });
  }
};


export const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userDatasource.findUserByEmail(email);
    let isNewUser = false; // Flag to check if a new user is created

    if (user) {
      // If user exists, update their name and picture if necessary, and ensure verified
      if (!user.verified) {
        user.verified = true;
        await user.save();
      }
    } else {
      // If user doesn't exist, create a new one
      user = await userDatasource.createUser({
        email,
        name: name || email.split('@')[0], // Use name from Google or derive from email
        verified: true, // Google users are considered verified
        status: 'free',
        // Password is not needed for OAuth users
      });
      isNewUser = true;
    }

    // Create a default free subscription for the new user if it's a new registration
    if (isNewUser) {
      const expiredAt = new Date();
      expiredAt.setFullYear(expiredAt.getFullYear() + 100); // Set to 100 years from now

      await subscriptionDatasource.createSubscription({
        expiredAt: expiredAt,
        createdBy: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        isActive: true,
        ...FREE_PACKAGE_LIMITS,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id, email: user.email });

    res.status(200).json({
      message: 'Google login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        verified: user.verified,
        picture: picture, // Include picture from Google profile
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // In a real application, you would invalidate the refresh token here (e.g., blacklist it, remove from DB)
    // For now, we just acknowledge the logout request.
    console.log(`Logout request received for refresh token: ${refreshToken}`);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
  };