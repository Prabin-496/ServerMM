import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define schema for User model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function() { return this.role === 'admin'; }, // Only required for admins
    default: function() {
      return this.role === 'user' ? `user_${this.email.split('@')[0]}` : ''; // Auto-generate username for normal users
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() { return this.role === 'admin'; }, // Only required for admins
    select: false, // Exclude password from being returned in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  profileImage: {
    type: String,
  },
});

// Pre-save hook to hash password before saving it to the database (only for admins)
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) { // Hash password for both admins and regular users
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
// Method to verify password (only needed for admin users)
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
