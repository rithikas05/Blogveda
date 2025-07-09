import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'writer'],
      default: 'user',
    },
    avatar: {
      type: String, // e.g. URL to avatar image or first letter fallback
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
