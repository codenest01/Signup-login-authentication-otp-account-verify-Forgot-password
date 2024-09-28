
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
    match: [/.+@.+\..+/, 'Please enter a valid email address'], 
  },
  password: {
    type: String,
    required: true,
    minlength: 3
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String, 
  },
  verifyCode: {
    type: String,
    default: '', 
  },
 
  jwtToken: { 
    type: String,
    default: null,
  },

},{ timestamps: true });

// Middleware to hash password before saving
registerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed for user:', this.email); // Add logging here
    next();
  } catch (err) {
    next(err); // Pass any errors to the next middleware
  }
});




const Register = mongoose.model('Register', registerSchema);

module.exports = Register;