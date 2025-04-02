const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'], 
    default: 'student',
  },
  courses: {
    type: [String],
    default: [],
  },
});

// Create the User model
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
