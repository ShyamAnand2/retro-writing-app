// USER MODEL: Defines structure of user documents in MongoDB

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// SCHEMA: Blueprint for how user data is stored
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'], // Validation with custom error message
      unique: true, // No duplicate usernames allowed
      trim: true, // Remove whitespace from start/end
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // Convert to lowercase before saving
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't include password in query results by default
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// PRE-SAVE HOOK: Hash password before saving to database
// "this" refers to the user document being saved
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (random string added to password before hashing)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next(); // Continue with save operation
  } catch (error) {
    next(error); // Pass error to error handler
  }
});

// INSTANCE METHOD: Compare provided password with stored hashed password
// Used during login to verify credentials
userSchema.methods.comparePassword = async function(candidatePassword) {
  // bcrypt.compare automatically handles salt extraction and comparison
  return await bcrypt.compare(candidatePassword, this.password);
};

// INSTANCE METHOD: Return user object without sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password; // Remove password from JSON responses
  return user;
};

// Create and export model
// "User" is the model name, MongoDB will create a collection called "users"
const User = mongoose.model('User', userSchema);

export default User;
