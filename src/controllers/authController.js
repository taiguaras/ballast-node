const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Username or email already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    if (!user.active) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is disabled' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  register,
  login
}; 