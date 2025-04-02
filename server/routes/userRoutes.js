const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('C:/WUSTL FL 2024/CSE 330/Modules/Module 7/creative-project-cp_528660_528553/330_Final/server/models/userModel.jsx');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { _id, name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds
    const user = new User({ _id, name, email, password: hashedPassword, role });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });
    res.status(200).json({ message: 'User registered successfully', token, userId: user._id, name: user.name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({ message: 'Login successful', token, userId: user._id, name: user.name })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (for testing)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Role retrieval route
router.get('/role', authMiddleware, async (req, res) => {
  try {
    // Assuming authMiddleware adds the user to the request object
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized access. User not found.' });
    }

    // Assuming `user` has a `role` field
    const role = user.role;

    if (!role) {
      return res.status(404).json({ message: 'Role not found for the user.' });
    }

    res.status(200).json({ role });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user role.', error: error.message });
  }
});


module.exports = router;
