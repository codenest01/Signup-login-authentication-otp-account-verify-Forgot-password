const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const registerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 6, 
  },
});

// Middleware to hash password before saving
registerSchema.pre('save', async function(next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
