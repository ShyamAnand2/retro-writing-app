// AUTH CONTROLLER: Handles user registration and login logic
// Controllers contain business logic separate from routes

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// HELPER FUNCTION: Generate JWT token for authenticated user
const generateToken = (userId) => {
  // jwt.sign creates a token with payload, secret key, and options
  return jwt.sign(
    { id: userId }, // Payload: data stored in token (keep minimal)
    process.env.JWT_SECRET, // Secret key to sign token
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token valid for 7 days
  );
};

// CONTROLLER: Register new user (POST /api/auth/signup)
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] // Find by email OR username
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // 2. Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      username,
      email,
      password
    });

    // 3. Generate JWT token for automatic login after signup
    const token = generateToken(user._id);

    // 4. Return success response with token and user info
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user'
    });
  }
};

// CONTROLLER: Login existing user (POST /api/auth/login)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2. Find user by email and include password field
    // We need ".select('+password')" because password is excluded by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials' // Don't specify if email or password is wrong (security)
      });
    }

    // 3. Check if password matches using our custom method
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in'
    });
  }
};

// CONTROLLER: Get current user info (GET /api/auth/me)
// Requires authentication (protect middleware)
export const getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};
