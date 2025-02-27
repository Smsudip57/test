const mongoose = require('mongoose');
import Service from './service';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['vendor','user', 'admin', 'freelancer'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 300
    },
    avatarUrl: {
      type: String,
      default: 'https://default-avatar-url.com'
    }
  },
  payment:{
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid'
    },
    transactionId: {
      type: String,
    }
  },
  boughtServices: [
    {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Service'
  }
 ],
 isActive: {
   type: Boolean,
   default: false
 }
});



const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
